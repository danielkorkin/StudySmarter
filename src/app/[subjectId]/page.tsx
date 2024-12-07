// src/app/[subjectId]/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

interface Course {
	id: string;
	title: string;
}

interface Props {
	params: Promise<{
		subjectId: string;
	}>;
}

export default async function SubjectPage(props: Props) {
    const params = await props.params;
    const { subjectId } = params;
    const subjectPath = path.join(process.cwd(), "content", subjectId);
    const courses = fs.readdirSync(subjectPath).filter((file) => {
		const stat = fs.statSync(path.join(subjectPath, file));
		return stat.isDirectory();
	});

    const courseData: Course[] = courses.map((courseId) => {
		const summaryPath = path.join(subjectPath, courseId, "summary.md");
		let title = courseId;
		if (fs.existsSync(summaryPath)) {
			const fileContent = fs.readFileSync(summaryPath, "utf-8");
			const { data } = matter(fileContent);
			title = data.title || courseId;
		}
		return { id: courseId, title };
	});

    return (
		<div className="prose mx-auto p-4">
			<h1>Courses for {subjectId}</h1>
			<ul>
				{courseData.map((course) => (
					<li key={course.id}>
						<Link href={`/${subjectId}/${course.id}`}>
							{course.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
