// app/[subjectId]/[courseId]/[unitId]/link/[resourceId]/page.tsx
import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";

interface Props {
	params: {
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	};
}

export default function LinkResourcePage({ params }: Props) {
	const { subjectId, courseId, unitId, resourceId } = params;

	const linkPath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"resources",
		`link_${resourceId}.txt`
	);
	const url = fs.readFileSync(linkPath, "utf-8").trim();

	redirect(url);
}
