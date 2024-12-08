// src/app/[subjectId]/[courseId]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
	}>;
}

interface Unit {
	id: string;
	title: string;
	inProgress?: boolean;
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
		let inProgress = false;

		if (fs.existsSync(summaryPath)) {
			const fileContent = fs.readFileSync(summaryPath, "utf-8");
			const { data } = matter(fileContent);
			title = data.title || unitId;
			inProgress = data.inProgress || false;
		}

		return { id: unitId, title, inProgress };
	});

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">
				Units for{" "}
				<span className="capitalize">
					{courseId.replace(/-/g, " ")}
				</span>
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{unitData.map((unit) => (
					<Link
						key={unit.id}
						href={`/${subjectId}/${courseId}/${unit.id}`}
					>
						<Card className="hover:bg-muted/50 transition-colors">
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="capitalize">
									{unit.title.replace(/-/g, " ")}
								</CardTitle>
								{unit.inProgress && (
									<Badge variant="secondary">
										In Progress
									</Badge>
								)}
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
