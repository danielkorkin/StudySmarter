// src/app/[subjectId]/[courseId]/[unitId]/podcast/[resourceId]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PodcastLinks {
	apple?: string;
	spotify?: string;
}

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default function PodcastResourcePage(props: Props) {
	const params = use(props.params);
	const [links, setLinks] = useState<PodcastLinks | null>(null);
	const [selectedPlatform, setSelectedPlatform] = useState<string>("");
	const { theme } = useTheme();
	const { subjectId, courseId, unitId, resourceId } = params;

	useEffect(() => {
		const fetchLinks = async () => {
			const response = await fetch(
				`/api/podcast?path=${encodeURIComponent(
					`${subjectId}/${courseId}/${unitId}/resources/podcast_${resourceId}.json`,
				)}`,
			);
			const data = await response.json();
			setLinks(data);
			setSelectedPlatform(data.spotify ? "spotify" : "apple");
		};
		fetchLinks();
	}, [subjectId, courseId, unitId, resourceId]);

	if (!links) return null;

	return (
		<Card className="max-w-4xl mx-auto">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="capitalize">
					{resourceId
						.replace(/-/g, " ")
						.replace(/\b\w/g, (l) => l.toUpperCase())}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{links.spotify && links.apple && (
					<Select
						value={selectedPlatform}
						onValueChange={setSelectedPlatform}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select platform" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="spotify">Spotify</SelectItem>
							<SelectItem value="apple">
								Apple Podcasts
							</SelectItem>
						</SelectContent>
					</Select>
				)}

				{selectedPlatform === "spotify" && links.spotify && (
					<iframe
						style={{ borderRadius: "12px" }}
						src={links.spotify}
						width="100%"
						height="152"
						frameBorder="0"
						allowFullScreen
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						loading="lazy"
					/>
				)}

				{selectedPlatform === "apple" && links.apple && (
					<iframe
						height="175"
						width="100%"
						title="Media player"
						src={`${links.apple}&theme=${
							theme === "dark" ? "dark" : "light"
						}`}
						sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
						allow="autoplay *; encrypted-media *; clipboard-write"
						style={{
							border: 0,
							borderRadius: "12px",
							width: "100%",
							height: "175px",
							maxWidth: "660px",
						}}
					/>
				)}
			</CardContent>
		</Card>
	);
}
