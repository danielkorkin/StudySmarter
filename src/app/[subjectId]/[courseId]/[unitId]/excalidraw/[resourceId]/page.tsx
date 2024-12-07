// src/app/[subjectId]/[courseId]/[unitId]/excalidraw/[resourceId]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const ExcalidrawWrapper = dynamic(
	() => import("@/components/ExcalidrawWrapper"),
	{
		ssr: false,
		loading: () => <div className="p-4">Loading Excalidraw...</div>,
	}
);

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default function ExcalidrawResourcePage(props: Props) {
    const params = use(props.params);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { subjectId, courseId, unitId, resourceId } = params;

    useEffect(() => {
		const fetchData = async () => {
			try {
				const filePath = `${subjectId}/${courseId}/${unitId}/resources/excalidraw_${resourceId}.excalidraw`;
				const response = await fetch(
					`/api/excalidraw?path=${encodeURIComponent(filePath)}`
				);
				if (!response.ok) {
					throw new Error("Failed to load Excalidraw data");
				}
				const json = await response.json();
				setData(json);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [subjectId, courseId, unitId, resourceId]);

    if (isLoading) {
		return <div className="p-4">Loading data...</div>;
	}

    if (error) {
		return <div className="p-4 text-red-500">Error: {error}</div>;
	}

    return data ? <ExcalidrawWrapper initialData={data} /> : null;
}
