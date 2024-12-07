// src/app/[subjectId]/[courseId]/layout.tsx
import Link from "next/link";

export default async function CourseLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{ subjectId: string; courseId: string }>;
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

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
