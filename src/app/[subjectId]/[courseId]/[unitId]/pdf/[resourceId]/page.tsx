// src/app/[subjectId]/[courseId]/[unitId]/pdf/[resourceId]/page.tsx
import path from "path";
import fs from "fs";
import { redirect } from "next/navigation";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default async function PDFResourcePage(props: Props) {
	const params = await props.params;
	const { subjectId, courseId, unitId, resourceId } = params;

	// Check if PDF exists in public directory
	const pdfPublicPath = `/resources/${subjectId}/${courseId}/${unitId}/pdf_${resourceId}.pdf`;
	const fullPath = path.join(process.cwd(), "public", pdfPublicPath);

	if (!fs.existsSync(fullPath)) {
		redirect("/");
	}

	return (
		<div className="w-full h-screen">
			<object
				data={pdfPublicPath}
				type="application/pdf"
				width="100%"
				height="100%"
			>
				<p>
					PDF cannot be displayed.{" "}
					<a href={pdfPublicPath}>Download PDF</a>
				</p>
			</object>
		</div>
	);
}
