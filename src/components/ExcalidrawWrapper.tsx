// src/components/ExcalidrawWrapper/index.tsx
"use client";

import dynamic from "next/dynamic";
import type { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";

const Excalidraw = dynamic(
	async () => (await import("@excalidraw/excalidraw")).Excalidraw,
	{
		ssr: false,
		loading: () => <div className="p-4">Loading Excalidraw...</div>,
	}
);

interface Props {
	initialData?: ExcalidrawProps["initialData"];
}

export default function ExcalidrawWrapper({ initialData }: Props) {
	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<Excalidraw initialData={initialData} viewModeEnabled={false} />
		</div>
	);
}
