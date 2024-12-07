// src/app/[subjectId]/[courseId]/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

interface Unit {
	id: string;
	title: string;
}

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
	}>;
}

export default async function CoursePage(props: Props) {
    const params = await props.params;
    const { subjectId, courseId } = params;
    const coursePath = path.join(process.cwd(), "content", subjectId, courseId);
    const units = fs.readdirSync(coursePath).filter((file) => {
		const stat = fs.statSync(path.join(coursePath, file));
		return stat.isDirectory();
	});

    const unitData: Unit[] = units.map((unitId) => {
		const summaryPath = path.join(coursePath, unitId, "summary.md");
		let title = unitId;
		if (fs.existsSync(summaryPath)) {
			const fileContent = fs.readFileSync(summaryPath, "utf-8");
			const { data } = matter(fileContent);
			title = data.title || unitId;
		}
		return { id: unitId, title };
	});

    return (
		<div className="prose mx-auto p-4">
			<h1>Units for {courseId}</h1>
			<ul>
				{unitData.map((unit) => (
					<li key={unit.id}>
						<Link href={`/${subjectId}/${courseId}/${unit.id}`}>
							{unit.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
