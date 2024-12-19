import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Route {
	url: string;
	lastModified: Date;
}

interface ModifiedDates {
	[key: string]: Date;
}

export function getAllUrls(
	baseUrl: string = "https://studysmarter-web.vercel.app",
): Route[] {
	const contentDir = path.join(process.cwd(), "content");
	const routes: Route[] = [];

	// Helper to get file modified time
	const getModifiedTime = (filePath: string): Date => {
		if (!fs.existsSync(filePath)) return new Date(0);

		// For summary.md files, check frontmatter first
		if (filePath.endsWith("summary.md")) {
			const fileContent = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContent);
			if (data.lastModified) {
				return new Date(data.lastModified);
			}
		}

		return fs.statSync(filePath).mtime;
	};

	// Get summary.md modified time
	const getSummaryModifiedTime = (dirPath: string): Date => {
		const summaryPath = path.join(dirPath, "summary.md");
		return getModifiedTime(summaryPath);
	};

	// Add homepage with latest modified date from any content
	const homepageDate = getModifiedTime(contentDir);
	routes.push({
		url: baseUrl,
		lastModified: homepageDate,
	});

	// Process subjects, courses, units hierarchically
	const subjects = fs
		.readdirSync(contentDir)
		.filter((file) =>
			fs.statSync(path.join(contentDir, file)).isDirectory(),
		);

	subjects.forEach((subject) => {
		const subjectPath = path.join(contentDir, subject);
		let subjectLastModified = getSummaryModifiedTime(subjectPath);

		// Process courses
		const courses = fs
			.readdirSync(subjectPath)
			.filter((file) =>
				fs.statSync(path.join(subjectPath, file)).isDirectory(),
			);

		courses.forEach((course) => {
			const coursePath = path.join(subjectPath, course);
			let courseLastModified = getSummaryModifiedTime(coursePath);

			// Process units
			const units = fs
				.readdirSync(coursePath)
				.filter((file) =>
					fs.statSync(path.join(coursePath, file)).isDirectory(),
				);

			units.forEach((unit) => {
				const unitPath = path.join(coursePath, unit);
				let unitLastModified = getSummaryModifiedTime(unitPath);

				// Add resources and update unit's last modified date
				const resourcesDir = path.join(unitPath, "resources");
				if (fs.existsSync(resourcesDir)) {
					fs.readdirSync(resourcesDir).forEach((resource) => {
						const resourceDate = getModifiedTime(
							path.join(resourcesDir, resource),
						);
						if (resourceDate > unitLastModified) {
							unitLastModified = resourceDate;
						}

						if (
							!resource.startsWith(".") &&
							!resource.startsWith("link_")
						) {
							const [type, ...nameParts] = resource.split("_");
							const name = nameParts
								.join("_")
								.replace(/\.[^/.]+$/, "");

							routes.push({
								url: `${baseUrl}/${subject}/${course}/${unit}/${type}/${name}`,
								lastModified: resourceDate,
							});
						}
					});
				}

				// Add unit and update course's last modified
				routes.push({
					url: `${baseUrl}/${subject}/${course}/${unit}`,
					lastModified: unitLastModified,
				});
				if (unitLastModified > courseLastModified) {
					courseLastModified = unitLastModified;
				}
			});

			// Add course and update subject's last modified
			routes.push({
				url: `${baseUrl}/${subject}/${course}`,
				lastModified: courseLastModified,
			});
			if (courseLastModified > subjectLastModified) {
				subjectLastModified = courseLastModified;
			}
		});

		// Add subject
		routes.push({
			url: `${baseUrl}/${subject}`,
			lastModified: subjectLastModified,
		});
	});

	return routes;
}
