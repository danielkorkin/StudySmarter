// src/app/[subjectId]/[courseId]/[unitId]/layout.tsx
import Link from "next/link";

export default async function UnitLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{ subjectId: string; courseId: string; unitId: string }>;
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

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
