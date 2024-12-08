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

// src/app/[subjectId]/[courseId]/[unitId]/pdf/[resourceId]/page.tsx
export default async function PDFResourcePage(props: Props) {
	const params = await props.params;
	const { subjectId, courseId, unitId, resourceId } = params;

	// Get the resource path
	const resourcesDir = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"resources"
	);

	const txtFile = path.join(resourcesDir, `pdf_${resourceId}.txt`);
	const pdfPublicPath = `/resources/${subjectId}/${courseId}/${unitId}/pdf_${resourceId}.pdf`;
	const fullPath = path.join(process.cwd(), "public", pdfPublicPath);

	let pdfSource = "";

	// First check if we have a URL in a txt file
	if (fs.existsSync(txtFile)) {
		try {
			pdfSource = fs.readFileSync(txtFile, "utf-8").trim();
			if (
				!pdfSource.startsWith("http://") &&
				!pdfSource.startsWith("https://")
			) {
				console.error("Invalid PDF URL in txt file");
				redirect("/");
			}
		} catch (error) {
			console.error("Error reading PDF URL file:", error);
			redirect("/");
		}
	}
	// Then check if we have a local PDF file
	else if (fs.existsSync(fullPath)) {
		pdfSource = pdfPublicPath;
	}
	// If neither exists, redirect
	else {
		console.error("PDF resource not found");
		redirect("/");
	}

	return (
		<div className="w-full h-screen">
			<object
				data={pdfSource}
				type="application/pdf"
				width="100%"
				height="100%"
			>
				<p>
					PDF cannot be displayed.{" "}
					<a href={pdfSource}>Download PDF</a>
				</p>
			</object>
		</div>
	);
}
