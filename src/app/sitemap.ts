import { MetadataRoute } from "next";
import { getAllUrls } from "@/lib/get-urls";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = getAllUrls();

	return routes.map((route) => {
		const urlParts = route.url.split("/").filter(Boolean);
		const depth = urlParts.length;

		// Set priority based on depth
		let priority = 1.0; // Default for homepage
		if (depth === 1)
			priority = 0.9; // Subject pages
		else if (depth === 2)
			priority = 0.8; // Course pages
		else if (depth === 3)
			priority = 0.7; // Unit pages
		else if (depth > 3) priority = 0.6; // Resource pages

		return {
			url: route.url,
			lastModified: route.lastModified,
			changeFrequency: "daily" as const,
			priority,
		};
	});
}
