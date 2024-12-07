// app/[subjectId]/[courseId]/[unitId]/excalidraw/[resourceId]/page.tsx
"use client";

import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";

const Excalidraw = dynamic(
	() => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
	{ ssr: false }
);

interface Props {
	params: {
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	};
}

export default function ExcalidrawResourcePage({ params }: Props) {
	const { subjectId, courseId, unitId, resourceId } = params;

	const excalidrawPath = path.join(
		process.cwd(),
		"content",
		subjectId,
		courseId,
		unitId,
		"resources",
		`excalidraw_${resourceId}.excalidraw`
	);
	const excalidrawData = JSON.parse(fs.readFileSync(excalidrawPath, "utf-8"));

	return (
		<div className="w-full h-screen">
			<Excalidraw initialData={excalidrawData} />
		</div>
	);
}
