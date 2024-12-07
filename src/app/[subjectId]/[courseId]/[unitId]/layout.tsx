// src/app/[subjectId]/[courseId]/[unitId]/layout.tsx
import Link from "next/link";

export default function UnitLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { subjectId: string; courseId: string; unitId: string };
}) {
	const { subjectId, courseId, unitId } = params;
	return (
		<div>
			<nav className="bg-gray-200 p-4">
				<Link href="/">Home</Link> /{" "}
				<Link href={`/${subjectId}`}>{subjectId}</Link> /{" "}
				<Link href={`/${subjectId}/${courseId}`}>{courseId}</Link> /{" "}
				<span className="font-bold">{unitId}</span>
			</nav>
			{children}
		</div>
	);
}
