import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTitle } from "@/lib/utils";

interface SubjectCardProps {
	subject: {
		id: string;
		title: string;
	};
}

export function SubjectCard({ subject }: SubjectCardProps) {
	return (
		<Link href={`/${subject.id}`}>
			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<CardTitle className="capitalize">
						{formatTitle(subject.title)}
					</CardTitle>
				</CardHeader>
			</Card>
		</Link>
	);
}
