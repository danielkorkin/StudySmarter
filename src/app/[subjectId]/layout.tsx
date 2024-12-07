// src/app/[subjectId]/layout.tsx
import Link from "next/link";

export default function SubjectLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { subjectId: string };
}) {
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
