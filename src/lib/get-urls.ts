import fs from "fs";
import path from "path";

interface Route {
	url: string;
	lastModified: Date;
}

export function getAllUrls(
	baseUrl: string = "https://studysmarter.pages.dev",
): Route[] {
	const contentDir = path.join(process.cwd(), "content");
	const routes: Route[] = [];

	// Add homepage
	routes.push({
		url: baseUrl,
		lastModified: new Date(),
	});

	// Get all subjects
	const subjects = fs.readdirSync(contentDir).filter((file) => {
		const stat = fs.statSync(path.join(contentDir, file));
		return stat.isDirectory();
	});

	// Add subject pages and get their courses
	subjects.forEach((subject) => {
		routes.push({
			url: `${baseUrl}/${subject}`,
			lastModified: new Date(),
		});

		const coursesDir = path.join(contentDir, subject);
		const courses = fs.readdirSync(coursesDir).filter((file) => {
			const stat = fs.statSync(path.join(coursesDir, file));
			return stat.isDirectory();
		});

		// Add course pages and get their units
		courses.forEach((course) => {
			routes.push({
				url: `${baseUrl}/${subject}/${course}`,
				lastModified: new Date(),
			});

			const unitsDir = path.join(coursesDir, course);
			const units = fs.readdirSync(unitsDir).filter((file) => {
				const stat = fs.statSync(path.join(unitsDir, file));
				return stat.isDirectory();
			});

			// Add unit pages and get their resources
			units.forEach((unit) => {
				routes.push({
					url: `${baseUrl}/${subject}/${course}/${unit}`,
					lastModified: new Date(),
				});

				const resourcesDir = path.join(unitsDir, unit, "resources");
				if (fs.existsSync(resourcesDir)) {
					const resources = fs.readdirSync(resourcesDir);

					// Add resource pages
					resources.forEach((resource) => {
						const [type, ...nameParts] = resource.split("_");
						const name = nameParts
							.join("_")
							.replace(/\.[^/.]+$/, "");

						if (!resource.startsWith(".") && type !== "link") {
							routes.push({
								url: `${baseUrl}/${subject}/${course}/${unit}/${type}/${name}`,
								lastModified: new Date(),
							});
						}
					});
				}
			});
		});
	});

	return routes;
}
