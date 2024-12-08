import fs from "fs";
import path from "path";
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
        (<Card className="max-w-3xl mx-auto">
            <CardHeader>
				<CardTitle>{resourceId.replace(/-/g, " ")}</CardTitle>
			</CardHeader>
            <CardContent>
				<ReactMarkdown className="prose dark:prose-invert">
					{content}
				</ReactMarkdown>
			</CardContent>
        </Card>)
    );
}
