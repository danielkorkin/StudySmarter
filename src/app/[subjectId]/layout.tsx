import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { Metadata } from "next";
import { formatTitle } from "@/lib/utils";

interface Props {
	params: Promise<{
		subjectId: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { subjectId } = await params;
	const subjectPath = path.join(process.cwd(), "content", subjectId);
	const summaryPath = path.join(subjectPath, "summary.md");

	let title = formatTitle(subjectId);
	let description = `Study materials for ${formatTitle(subjectId)}`;

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

export default async function SubjectLayout(props: {
	children: React.ReactNode;
	params: Promise<{ subjectId: string }>;
}) {
	const { children } = props;
	return (
		<div className="space-y-6">
			<main>{children}</main>
		</div>
	);
}
