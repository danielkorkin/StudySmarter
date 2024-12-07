// app/[subjectId]/[courseId]/[unitId]/pdf/[resourceId]/page.tsx
import path from "path";
import fs from "fs";

interface Props {
	params: {
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	};
}

export default function PDFResourcePage({ params }: Props) {
	const { subjectId, courseId, unitId, resourceId } = params;

	const pdfPath = path.join(
		"/resources",
		subjectId,
		courseId,
		unitId,
		`pdf_${resourceId}.pdf`
	);

	return (
		<div className="w-full h-screen">
			<object
				data={pdfPath}
				type="application/pdf"
				width="100%"
				height="100%"
			>
				<p>PDF cannot be displayed.</p>
			</object>
		</div>
	);
}
