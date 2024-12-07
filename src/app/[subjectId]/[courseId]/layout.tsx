// src/app/[subjectId]/[courseId]/layout.tsx
import Link from "next/link";

export default function CourseLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { subjectId: string; courseId: string };
}) {
	const { subjectId, courseId } = params;
	return (
		<div>
			<nav className="bg-gray-200 p-4">
				<Link href="/">Home</Link> /{" "}
				<Link href={`/${subjectId}`}>{subjectId}</Link> /{" "}
				<span className="font-bold">{courseId}</span>
			</nav>
			{children}
		</div>
	);
}
