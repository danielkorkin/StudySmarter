// src/app/[subjectId]/[courseId]/[unitId]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
	}>;
}

interface UnitContent {
	title: string;
	content: string;
	inProgress?: boolean;
}

interface Resource {
	id: string;
	type: string;
	title: string;
	path: string;
}

async function getUnitContent(
	subjectId: string,
	courseId: string,
	unitId: string,
): Promise<UnitContent> {
	const mdPath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"summary.md",
	);

	if (!fs.existsSync(mdPath)) {
		throw new Error("Unit content not found");
	}

	const fileContents = fs.readFileSync(mdPath, "utf8");
	const { data, content } = matter(fileContents);

	return {
		title: data.title,
		content: content,
		inProgress: data.inProgress || false, // Add this line
	};
}

function getResources(
	resourcesDir: string,
	subjectId: string,
	courseId: string,
	unitId: string,
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
			.map((file) => file);
	}

	// Filter podcast files from content resources
	const podcastFiles = contentResources
		.filter((file) => file.startsWith("podcast_") && file.endsWith(".json"))
		.map((file) => ({
			id: file.replace(/^podcast_/, "").replace(/\.json$/, ""),
			type: "podcast",
			title: file
				.replace(/^podcast_/, "")
				.replace(/\.json$/, "")
				.replace(/-/g, " ")
				.replace(/\b\w/g, (l) => l.toUpperCase()),
			path: "",
		}));

	// Filter flashcard files from content resources
	const flashcardFiles = contentResources
		.filter(
			(file) => file.startsWith("flashcard_") && file.endsWith(".json"),
		)
		.map((file) => ({
			id: file.replace(/^flashcard_/, "").replace(/\.json$/, ""),
			type: "flashcard",
			title: file
				.replace(/^flashcard_/, "")
				.replace(/\.json$/, "")
				.replace(/-/g, " ")
				.replace(/\b\w/g, (l) => l.toUpperCase()),
			path: "",
		}));

	// Combine all resources excluding podcast and flashcard files
	const allFiles = [
		...contentResources.filter(
			(f) => !f.startsWith("podcast_") && !f.startsWith("flashcard_"),
		),
		...pdfFiles,
	];

	const standardResources = allFiles.map((file) => {
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

	return [...standardResources, ...podcastFiles, ...flashcardFiles];
}

export default async function UnitPage(props: Props) {
	const { subjectId, courseId, unitId } = await props.params;

	try {
		const unitContent = await getUnitContent(subjectId, courseId, unitId);
		const resourcesDir = path.join(
			process.cwd(),
			"content",
			subjectId,
			courseId,
			unitId,
			"resources",
		);
		const resources = getResources(
			resourcesDir,
			subjectId,
			courseId,
			unitId,
		);

		return (
			<div className="space-y-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle>{unitContent.title}</CardTitle>
						{unitContent.inProgress && (
							<Badge variant="secondary">In Progress</Badge>
						)}
					</CardHeader>
					<CardContent className="prose dark:prose-invert max-w-none">
						<ReactMarkdown
							remarkPlugins={[remarkMath]}
							rehypePlugins={[rehypeKatex]}
						>
							{unitContent.content}
						</ReactMarkdown>
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
