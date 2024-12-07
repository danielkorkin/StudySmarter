// app/[subjectId]/[courseId]/[unitId]/text/[resourceId]/page.tsx
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default async function TextResourcePage(props: Props) {
    const params = await props.params;
    const { subjectId, courseId, unitId, resourceId } = params;

    const resourcePath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"resources",
		`text_${resourceId}.md`
	);
    const content = fs.readFileSync(resourcePath, "utf-8");

    return (
		<div className="prose mx-auto p-4">
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
}
