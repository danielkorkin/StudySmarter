// src/components/ExcalidrawWrapper.tsx
"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

interface Props {
	initialData?: any;
}

export default function ExcalidrawWrapper({ initialData }: Props) {
	return (
		<div className="w-full h-screen">
			<Excalidraw initialData={initialData} />
		</div>
	);
}
