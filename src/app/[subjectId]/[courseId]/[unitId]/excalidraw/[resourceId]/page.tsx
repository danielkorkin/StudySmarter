"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ExcalidrawWrapper = dynamic(
	() => import("@/components/ExcalidrawWrapper"),
	{
		ssr: false,
		loading: () => <Skeleton className="w-full h-[600px]" />,
	},
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
					`/api/excalidraw?path=${encodeURIComponent(filePath)}`,
				);
				if (!response.ok) {
					throw new Error("Failed to load Excalidraw data");
				}
				const json = await response.json();
				setData(json);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An error occurred",
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [subjectId, courseId, unitId, resourceId]);

	return (
		<Card className="max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle>{resourceId.replace(/-/g, " ")}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className="w-full h-[600px]" />
				) : error ? (
					<div className="p-4 text-red-500">Error: {error}</div>
				) : (
					data && <ExcalidrawWrapper initialData={data} />
				)}
			</CardContent>
		</Card>
	);
}
