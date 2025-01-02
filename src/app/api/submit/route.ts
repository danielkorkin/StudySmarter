import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({
	auth: process.env.GITHUB_APP_TOKEN,
});

export async function POST(req: Request) {
	try {
		const {
			path: filePath,
			content,
			subject,
			course,
			unit,
			resourceType,
			name,
			createSummaries,
		} = await req.json();

		// Ensure directory exists
		const dir = path.dirname(filePath);
		await mkdir(dir, { recursive: true });

		// Create resource file locally
		fs.writeFileSync(filePath, content);

		// Create missing summary files locally
		for (const [type, summary] of Object.entries(createSummaries)) {
			const summaryPath = summary.path;
			if (!fs.existsSync(summaryPath)) {
				await mkdir(path.dirname(summaryPath), { recursive: true });
				fs.writeFileSync(summaryPath, summary.content);
			}
		}

		// Create GitHub PR
		const timestamp = Date.now();
		const branchName = `resource/${subject}-${course}-${unit}-${name}-${timestamp}`;

		// Get latest commit SHA from main
		const { data: ref } = await octokit.git.getRef({
			owner: "danielkorkin",
			repo: "StudySmarter",
			ref: "heads/main",
		});

		// Create new branch
		await octokit.git.createRef({
			owner: "danielkorkin",
			repo: "StudySmarter",
			ref: `refs/heads/${branchName}`,
			sha: ref.object.sha,
		});

		// Create/update resource file in new branch
		await octokit.repos.createOrUpdateFileContents({
			owner: "danielkorkin",
			repo: "StudySmarter",
			path: filePath,
			message: `Add ${resourceType} resource: ${name}`,
			content: Buffer.from(content).toString("base64"),
			branch: branchName,
		});

		// Create/update summary files in new branch
		for (const [type, summary] of Object.entries(createSummaries)) {
			await octokit.repos.createOrUpdateFileContents({
				owner: "danielkorkin",
				repo: "StudySmarter",
				path: summary.path,
				message: `Add ${type} summary for ${name}`,
				content: Buffer.from(summary.content).toString("base64"),
				branch: branchName,
			});
		}

		// Create pull request
		await octokit.pulls.create({
			owner: "danielkorkin",
			repo: "StudySmarter",
			title: `Add ${resourceType} resource: ${name}`,
			head: branchName,
			base: "main",
			body: `Added new ${resourceType} resource:\n- Subject: ${subject}\n- Course: ${course}\n- Unit: ${unit}\n- Name: ${name}`,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error creating PR:", error);
		return NextResponse.json(
			{ error: "Failed to create PR" },
			{ status: 500 },
		);
	}
}
