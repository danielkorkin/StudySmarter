import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SubjectCard } from "@/components/SubjectCard";

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
		<div className="space-y-8">
			<h1 className="text-4xl font-bold">Subjects</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{subjectData.map((subject) => (
					<SubjectCard key={subject.id} subject={subject} />
				))}
			</div>
		</div>
	);
}
