import { MetadataRoute } from "next";
import { getAllUrls } from "@/lib/get-urls";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = getAllUrls();

	return routes.map((route) => {
		const urlParts = route.url.split("/").filter(Boolean);
		const depth = urlParts.length;

		// Higher priorities for top-level pages
		let priority: number;
		switch (depth) {
			case 0: // Homepage
				priority = 1.0;
				break;
			case 1: // Subject pages (e.g. /computer-science)
				priority = 0.9;
				break;
			case 2: // Course pages (e.g. /computer-science/ecs-1)
				priority = 0.8;
				break;
			case 3: // Unit pages (e.g. /computer-science/ecs-1/unit-4)
				priority = 0.7;
				break;
			default: // Resource pages
				priority = 0.6;
		}

		return {
			url: route.url,
			lastModified: route.lastModified,
			changeFrequency: "daily" as const,
			priority,
		};
	});
}
