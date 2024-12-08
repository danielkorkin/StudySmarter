// src/app/[subjectId]/layout.tsx
import Link from "next/link";

export default async function SubjectLayout(props: {
	children: React.ReactNode;
	params: Promise<{ subjectId: string }>;
}) {
	const params = await props.params;

	const { children } = props;

	const { subjectId } = params;
	return (
		<div>
			<nav className="bg-gray-200 p-4">
				<Link href="/">Home</Link> /{" "}
				<span className="font-bold">{subjectId}</span>
			</nav>
			{children}
		</div>
	);
}
