import path from "path";
import fs from "fs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
	} else if (fs.existsSync(fullPath)) {
		pdfSource = pdfPublicPath;
	} else {
		console.error("PDF resource not found");
		redirect("/");
	}

    return (
        (<Card className="max-w-4xl mx-auto">
            <CardHeader>
				<CardTitle>{resourceId.replace(/-/g, " ")}</CardTitle>
			</CardHeader>
            <CardContent>
				<div className="w-full h-[600px]">
					<object
						data={pdfSource}
						type="application/pdf"
						width="100%"
						height="100%"
					>
						<p>
							PDF cannot be displayed.{" "}
							<a
								href={pdfSource}
								className="text-primary hover:underline"
							>
								Download PDF
							</a>
						</p>
					</object>
				</div>
			</CardContent>
        </Card>)
    );
}
