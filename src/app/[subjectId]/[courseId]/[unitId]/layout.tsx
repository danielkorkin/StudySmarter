import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { formatTitle } from "@/lib/utils";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { subjectId, courseId, unitId } = await params;
	const unitPath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
	);
	const summaryPath = path.join(unitPath, "summary.md");

	let title = formatTitle(unitId);
	let description = `Unit materials for ${formatTitle(unitId)}`;

	if (fs.existsSync(summaryPath)) {
		const fileContent = fs.readFileSync(summaryPath, "utf-8");
		const { data } = matter(fileContent);
		if (data.title) title = data.title;
		if (data.description) description = data.description;
	}

	return {
		title: `${title} | StudySmarter`,
		description,
	};
}

export default async function UnitLayout(props: {
	children: React.ReactNode;
	params: Promise<{ subjectId: string; courseId: string; unitId: string }>;
}) {
	const params = await props.params;
	const { children } = props;
	const { subjectId, courseId, unitId } = params;

	return (
		<div className="space-y-6">
			<main>{children}</main>
		</div>
	);
}
