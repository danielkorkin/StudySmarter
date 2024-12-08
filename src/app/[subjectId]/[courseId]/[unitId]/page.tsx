// src/app/[subjectId]/[courseId]/[unitId]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
	}>;
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

async function getUnitContent(
	subjectId: string,
	courseId: string,
	unitId: string
) {
	const mdPath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"summary.md"
	);

	if (!fs.existsSync(mdPath)) {
		throw new Error("Unit content not found");
	}

	const fileContents = fs.readFileSync(mdPath, "utf8");
	const { data, content } = matter(fileContents);

	return {
		title: data.title,
		content: content,
	};
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

	const contentResources = fs.readdirSync(resourcesDir).filter((file) => {
		const filePath = path.join(resourcesDir, file);
		return fs.statSync(filePath).isFile();
	});

	const publicPdfDir = path.join(
		process.cwd(),
		"public",
		"resources",
		subjectId,
		courseId,
		unitId
	);

	let pdfFiles: string[] = [];
	if (fs.existsSync(publicPdfDir)) {
		pdfFiles = fs
			.readdirSync(publicPdfDir)
			.filter((file) => file.startsWith("pdf_") && file.endsWith(".pdf"))
			.map((file) => file);
	}

	const allFiles = [...contentResources, ...pdfFiles];

	return allFiles.map((file) => {
		const [type, ...idParts] = file.split("_");
		const id = idParts.join("_").replace(/\.[^/.]+$/, "");

		let resourcePath = "";
		if (type === "pdf") {
			resourcePath = `/resources/${subjectId}/${courseId}/${unitId}/${file}`;
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
	const { subjectId, courseId, unitId } = (await props.params);

	try {
		const unitContent = await getUnitContent(subjectId, courseId, unitId);
		const resourcesDir = path.join(
			process.cwd(),
			"content",
			subjectId,
			courseId,
			unitId,
			"resources"
		);
		const resources = getResources(
			resourcesDir,
			subjectId,
			courseId,
			unitId
		);

		return (
			<div className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>{unitContent.title}</CardTitle>
					</CardHeader>
					<CardContent className="prose dark:prose-invert max-w-none">
						<ReactMarkdown>{unitContent.content}</ReactMarkdown>
					</CardContent>
				</Card>

				{resources.length > 0 && (
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
				)}
			</div>
		);
	} catch (error) {
		console.error("Error loading unit:", error);
		redirect("/");
	}
}
