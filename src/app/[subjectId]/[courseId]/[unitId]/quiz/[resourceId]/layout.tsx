import { Metadata } from "next";
import { formatTitle } from "@/lib/utils";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { subjectId, courseId, unitId, resourceId } = await params;

	const title = formatTitle(resourceId);
	const description = `Quiz for ${formatTitle(unitId)}`;

	return {
		title: `${title} | StudySmarter`,
		description,
		openGraph: {
			title,
			description,
			type: "article",
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
	};
}

export default function QuizResourceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}