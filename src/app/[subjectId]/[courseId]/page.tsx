import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Units for <span className="capitalize">{courseId}</span></h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{unitData.map((unit) => (
					<Link
						key={unit.id}
						href={`/${subjectId}/${courseId}/${unit.id}`}
					>
						<Card className="hover:bg-muted/50 transition-colors">
							<CardHeader>
								<CardTitle>{unit.title}</CardTitle>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
