import { Metadata } from "next";
import { formatTitle } from "@/lib/utils";
import "@excalidraw/excalidraw/index.css";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		type: string;
		resourceId: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { subjectId, courseId, unitId, resourceId } = await params;

	const title = formatTitle(resourceId);
	const description = `Interactive diagram for ${formatTitle(unitId)}`;

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

export default function ExcalidrawResourceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
