import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTitle } from "@/lib/utils";

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
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">
				Courses for{" "}
				<span className="capitalize">{formatTitle(subjectId)}</span>
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{courseData.map((course) => (
					<Link key={course.id} href={`/${subjectId}/${course.id}`}>
						<Card className="hover:bg-muted/50 transition-colors">
							<CardHeader>
								<CardTitle className="capitalize">
									{formatTitle(course.title)}
								</CardTitle>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
