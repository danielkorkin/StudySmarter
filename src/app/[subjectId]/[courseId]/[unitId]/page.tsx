import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
	params: {
		subjectId: string;
		courseId: string;
		unitId: string;
	};
}

interface Resource {
	id: string;
	type: string;
	title: string;
	path: string;
}

interface PathValidationResult {
	path: string;
	redirect?: string;
}

function validatePath(
	subjectId: string,
	courseId?: string,
	unitId?: string
): PathValidationResult | null {
	const basePath = path.join(process.cwd(), "content");
	const subjectPath = path.join(basePath, subjectId);

	if (!fs.existsSync(subjectPath)) {
		return null;
	}

	if (!courseId) {
		return { path: subjectPath };
	}

	const coursePath = path.join(subjectPath, courseId);
	if (!fs.existsSync(coursePath)) {
		const courses = fs
			.readdirSync(subjectPath)
			.filter((dir) =>
				fs.statSync(path.join(subjectPath, dir)).isDirectory(),
			);
		const correctCourse = courses.find(
			(c) => c.toLowerCase() === courseId.toLowerCase(),
		);
		if (correctCourse) {
			return {
				path: coursePath,
				redirect: `/${subjectId}/${correctCourse}${
					unitId ? `/${unitId}` : ""
				}`,
			};
		}
		return null;
	}

	if (!unitId) {
		return { path: coursePath };
	}

	const unitPath = path.join(coursePath, unitId);
	if (!fs.existsSync(unitPath)) {
		const units = fs
			.readdirSync(coursePath)
			.filter((dir) =>
				fs.statSync(path.join(coursePath, dir)).isDirectory(),
			);
		const correctUnit = units.find(
			(u) => u.toLowerCase() === unitId.toLowerCase(),
		);
		if (correctUnit) {
			return {
				path: unitPath,
				redirect: `/${subjectId}/${courseId}/${correctUnit}`,
			};
		}
		return null;
	}

	return { path: unitPath };
}

function getResources(
	resourcesDir: string,
	subjectId: string,
	courseId: string,
	unitId: string
): Resource[] {
	if (!fs.existsSync(resourcesDir)) {
		return [];
	}

	// Get content directory resources
	const contentResources = fs.readdirSync(resourcesDir).filter((file) => {
		const filePath = path.join(resourcesDir, file);
		return fs.statSync(filePath).isFile();
	});

	// Check public directory for PDF files
	const publicPdfDir = path.join(
		process.cwd(),
		"public",
		"resources",
		subjectId,
		courseId,
		unitId,
	);

	// Get local PDF files
	let pdfFiles: string[] = [];
	if (fs.existsSync(publicPdfDir)) {
		pdfFiles = fs
			.readdirSync(publicPdfDir)
			.filter((file) => file.startsWith("pdf_") && file.endsWith(".pdf"))
			// Remove the local: prefix
			.map((file) => file);
	}

	// Get PDF URL files
	const pdfUrlFiles = contentResources
		.filter((file) => file.startsWith("pdf_") && file.endsWith(".txt"))
		.map((file) => file);

	// Combine all resources
	const allFiles = [...contentResources, ...pdfFiles, ...pdfUrlFiles];

	return allFiles.map((file) => {
		const [type, ...idParts] = file.split("_");
		const id = idParts.join("_").replace(/\.[^/.]+$/, "");

		let resourcePath = "";
		if (type === "pdf") {
			// Check if it's a local PDF file
			if (file.endsWith(".pdf")) {
				resourcePath = `/resources/${subjectId}/${courseId}/${unitId}/${file}`;
			}
			// Check if it's a URL PDF file
			else if (file.endsWith(".txt")) {
				const txtPath = path.join(resourcesDir, file);
				resourcePath = fs.readFileSync(txtPath, "utf-8").trim();
			}
		}

		return {
			id,
			type,
			title: id
				.replace(/-/g, " ")
				.replace(/\b\w/g, (l) => l.toUpperCase()),
			path: resourcePath,
		};
	});
}

export default async function UnitPage(props: Props) {
	const params = await props.params;
	const { subjectId, courseId, unitId } = params;

	const validation = validatePath(subjectId, courseId, unitId);

	if (!validation) {
		redirect("/");
	}

	if (validation.redirect) {
		redirect(validation.redirect);
	}

	try {
		const summaryPath = path.join(validation.path, "summary.md");
		if (!fs.existsSync(summaryPath)) {
			redirect("/");
		}

		const fileContent = fs.readFileSync(summaryPath, "utf-8");
		const { data, content } = matter(fileContent);

		const resourcesDir = path.join(validation.path, "resources");
		const resources = getResources(
			resourcesDir,
			subjectId,
			courseId,
			unitId
		);

		return (
			<div className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>{data.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<ReactMarkdown className="prose dark:prose-invert max-w-none">
							{content}
						</ReactMarkdown>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Resources</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{resources.map((resource) => (
								<li key={`${resource.type}-${resource.id}`}>
									<Link
										href={`/${subjectId}/${courseId}/${unitId}/${resource.type}/${resource.id}`}
										className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-center justify-between">
											<span className="font-medium">
												{resource.title}
											</span>
											<Badge>
												{resource.type.toUpperCase()}
											</Badge>
										</div>
									</Link>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		);
	} catch (error) {
		console.error("Error loading unit:", error);
		redirect("/");
	}
}
