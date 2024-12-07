// app/[subjectId]/[courseId]/[unitId]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

interface Props {
	params: {
		subjectId: string;
		courseId: string;
		unitId: string;
	};
}

export default function UnitPage({ params }: Props) {
	const { subjectId, courseId, unitId } = params;

	const summaryPath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"summary.md"
	);
	const fileContent = fs.readFileSync(summaryPath, "utf-8");
	const { data, content } = matter(fileContent);

	const resourcesDir = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"resources"
	);
	const resourceFiles = fs.readdirSync(resourcesDir);

	const resources = resourceFiles.map((file) => {
		const [type, id] = file.split("_");
		return { type, id: id.replace(/\.[^/.]+$/, "") };
	});

	return (
		<div className="prose mx-auto p-4">
			<h1>{data.title}</h1>
			<ReactMarkdown>{content}</ReactMarkdown>
			<h2>Resources</h2>
			<ul>
				{resources.map((resource) => (
					<li key={resource.id}>
						<a
							href={`/${subjectId}/${courseId}/${unitId}/${resource.type}/${resource.id}`}
						>
							{resource.type.toUpperCase()} - {resource.id}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
