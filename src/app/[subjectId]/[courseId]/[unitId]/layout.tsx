import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
