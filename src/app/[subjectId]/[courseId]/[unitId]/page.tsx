// src/app/[subjectId]/[courseId]/[unitId]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { redirect } from "next/navigation";

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
	}>;
}

interface PathValidationResult {
	path: string;
	redirect?: string;
}

function validatePath(
	subjectId: string,
	courseId?: string,
	unitId?: string
): PathValidationResult | null {
	const basePath = path.join(process.cwd(), "content");
	const subjectPath = path.join(basePath, subjectId);

	// Check if subject exists
	if (!fs.existsSync(subjectPath)) {
		return null;
	}

	// If only validating subject
	if (!courseId) {
		return { path: subjectPath };
	}

	const coursePath = path.join(subjectPath, courseId);
	if (!fs.existsSync(coursePath)) {
		// Try to find correct course
		const courses = fs
			.readdirSync(subjectPath)
			.filter((dir) =>
				fs.statSync(path.join(subjectPath, dir)).isDirectory()
			);
		const correctCourse = courses.find(
			(c) => c.toLowerCase() === courseId.toLowerCase()
		);
		if (correctCourse) {
			return {
				path: coursePath,
				redirect: `/${subjectId}/${correctCourse}${
					unitId ? `/${unitId}` : ""
				}`,
			};
		}
		return null;
	}

	// If only validating up to course
	if (!unitId) {
		return { path: coursePath };
	}

	const unitPath = path.join(coursePath, unitId);
	if (!fs.existsSync(unitPath)) {
		// Try to find correct unit
		const units = fs
			.readdirSync(coursePath)
			.filter((dir) =>
				fs.statSync(path.join(coursePath, dir)).isDirectory()
			);
		const correctUnit = units.find(
			(u) => u.toLowerCase() === unitId.toLowerCase()
		);
		if (correctUnit) {
			return {
				path: unitPath,
				redirect: `/${subjectId}/${courseId}/${correctUnit}`,
			};
		}
		return null;
	}

	return { path: unitPath };
}

export default async function UnitPage(props: Props) {
	const params = await props.params;
	const { subjectId, courseId, unitId } = params;

	const validation = validatePath(subjectId, courseId, unitId);

	if (!validation) {
		redirect("/"); // Redirect to home if path is invalid
	}

	if (validation.redirect) {
		redirect(validation.redirect);
	}

	try {
		const summaryPath = path.join(validation.path, "summary.md");
		const fileContent = fs.readFileSync(summaryPath, "utf-8");
		const { data, content } = matter(fileContent);

		const resourcesPath = path.join(validation.path, "resources");
		const resourceFiles = fs.existsSync(resourcesPath)
			? fs.readdirSync(resourcesPath)
			: [];

		const resources = resourceFiles.map((file) => {
			const [type, id] = file.split("_");
			return { type, id: id.replace(/\.[^/.]+$/, "") };
		});

		return (
			<div className="prose mx-auto p-4">
				<h1>{data.title}</h1>
				<ReactMarkdown>{content}</ReactMarkdown>
				<h2>Resources</h2>
				<ul>
					{resources.map((resource) => (
						<li key={resource.id}>
							<a
								href={`/${subjectId}/${courseId}/${unitId}/${resource.type}/${resource.id}`}
							>
								{resource.type.toUpperCase()} - {resource.id}
							</a>
						</li>
					))}
				</ul>
			</div>
		);
	} catch (error) {
		console.error("Error loading unit:", error);
		redirect("/");
	}
}
