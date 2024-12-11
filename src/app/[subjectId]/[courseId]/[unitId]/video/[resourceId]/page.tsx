// src/app/[subjectId]/[courseId]/[unitId]/video/[resourceId]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTitle } from "@/lib/utils";

interface VideoResource {
	youtubeUrl: string;
	startTime?: number; // Start time in seconds
}

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default function VideoResourcePage(props: Props) {
	const params = use(props.params);
	const [videoData, setVideoData] = useState<VideoResource | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { subjectId, courseId, unitId, resourceId } = params;

	useEffect(() => {
		const fetchVideo = async () => {
			try {
				const response = await fetch(
					`/api/video?path=${encodeURIComponent(
						`${subjectId}/${courseId}/${unitId}/resources/video_${resourceId}.json`,
					)}`,
				);
				if (!response.ok) {
					throw new Error("Failed to load video data");
				}
				const data = await response.json();
				setVideoData(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error loading video",
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchVideo();
	}, [subjectId, courseId, unitId, resourceId]);

	const getEmbedUrl = (url: string, startTime?: number) => {
		// Extract video ID from YouTube URL
		const videoId = url.match(
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
		)?.[1];

		if (!videoId) return null;

		const baseUrl = `https://www.youtube.com/embed/${videoId}`;
		const params = new URLSearchParams({
			autoplay: "0",
			rel: "0",
		});

		if (typeof startTime === "number" && startTime > 0) {
			params.append("start", Math.floor(startTime).toString());
		}

		return `${baseUrl}?${params.toString()}`;
	};

	if (isLoading) return null;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!videoData) return null;

	const embedUrl = getEmbedUrl(videoData.youtubeUrl, videoData.startTime);
	if (!embedUrl)
		return <div className="text-red-500">Invalid YouTube URL</div>;

	return (
		<Card className="max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle className="capitalize">
					{formatTitle(resourceId)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="relative pb-[56.25%] h-0">
					<iframe
						className="absolute top-0 left-0 w-full h-full"
						src={embedUrl}
						title="YouTube video player"
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</CardContent>
		</Card>
	);
}
