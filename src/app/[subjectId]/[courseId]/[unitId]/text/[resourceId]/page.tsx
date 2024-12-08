// src/app/[subjectId]/[courseId]/[unitId]/text/[resourceId]/page.tsx
import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default async function TextResourcePage(props: Props) {
	const { subjectId, courseId, unitId, resourceId } = (await props.params);

	const filePath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"resources",
		`text_${resourceId}.md`
	);

	if (!fs.existsSync(filePath)) {
		redirect("/");
	}

	const content = fs.readFileSync(filePath, "utf8");

	return (
        (<Card>
            <CardHeader>
				<CardTitle>
					{resourceId
						.replace(/-/g, " ")
						.replace(/\b\w/g, (l) => l.toUpperCase())}
				</CardTitle>
			</CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
				<ReactMarkdown>{content}</ReactMarkdown>
			</CardContent>
        </Card>)
    );
}
