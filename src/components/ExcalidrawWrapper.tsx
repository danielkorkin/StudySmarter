// src/components/ExcalidrawWrapper/index.tsx
"use client";

import dynamic from "next/dynamic";
// @ts-expect-error - Types are not properly exposed in @excalidraw/excalidraw package.
// This is a known issue with the package's type definitions. The types exist at runtime
// but TypeScript cannot find them at compile time.
import { ExcalidrawProps } from "@excalidraw/excalidraw/dist/excalidraw/types";
import type { ComponentType } from "react";

const Excalidraw = dynamic(
	() =>
		import("@excalidraw/excalidraw").then(
			(mod) => mod.Excalidraw as ComponentType<ExcalidrawProps>,
		),
	{
		ssr: false,
		loading: () => <div className="p-4">Loading Excalidraw...</div>,
	},
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
