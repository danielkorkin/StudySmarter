// src/app/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

interface Subject {
	id: string;
	title: string;
}

export default function HomePage() {
	const contentDir = path.join(process.cwd(), "content");
	const subjects = fs.readdirSync(contentDir).filter((file) => {
		const stat = fs.statSync(path.join(contentDir, file));
		return stat.isDirectory();
	});

	const subjectData: Subject[] = subjects.map((subjectId) => {
		const summaryPath = path.join(contentDir, subjectId, "summary.md");
		let title = subjectId;
		if (fs.existsSync(summaryPath)) {
			const fileContent = fs.readFileSync(summaryPath, "utf-8");
			const { data } = matter(fileContent);
			title = data.title || subjectId;
		}
		return { id: subjectId, title };
	});

	return (
		<div className="prose mx-auto p-4">
			<h1>Subjects</h1>
			<ul>
				{subjectData.map((subject) => (
					<li key={subject.id}>
						<Link href={`/${subject.id}`}>{subject.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
