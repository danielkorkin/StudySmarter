import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
	const contentDir = path.join(process.cwd(), "content");
	const subjects = fs.readdirSync(contentDir).filter((file) => {
		const stat = fs.statSync(path.join(contentDir, file));
		return stat.isDirectory();
	});

	const courses: { [subject: string]: string[] } = {};
	const units: { [course: string]: string[] } = {};

	subjects.forEach((subject) => {
		const subjectPath = path.join(contentDir, subject);
		const courseDirs = fs.readdirSync(subjectPath).filter((file) => {
			const stat = fs.statSync(path.join(subjectPath, file));
			return stat.isDirectory();
		});

		courses[subject] = courseDirs;

		courseDirs.forEach((course) => {
			const coursePath = path.join(subjectPath, course);
			const unitDirs = fs.readdirSync(coursePath).filter((file) => {
				const stat = fs.statSync(path.join(coursePath, file));
				return stat.isDirectory();
			});

			units[`${subject}/${course}`] = unitDirs;
		});
	});

	return NextResponse.json({
		subjects,
		courses,
		units,
	});
}
