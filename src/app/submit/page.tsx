"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SubmitPage() {
	const [resourceType, setResourceType] = useState<"link" | "markdown">(
		"link",
	);
	const [subject, setSubject] = useState("");
	const [course, setCourse] = useState("");
	const [unit, setUnit] = useState("");
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Normalize names to match existing format
			const normalizedSubject = subject
				.toLowerCase()
				.replace(/\s+/g, "-");
			const normalizedCourse = course.toLowerCase().replace(/\s+/g, "-");
			const normalizedUnit = unit.toLowerCase().replace(/\s+/g, "-");
			const formattedName = name.toLowerCase().replace(/\s+/g, "-");

			// Prepare paths
			const basePath = `content/${normalizedSubject}/${normalizedCourse}/${normalizedUnit}`;
			const subjectSummaryPath = `content/${normalizedSubject}/summary.md`;
			const courseSummaryPath = `content/${normalizedSubject}/${normalizedCourse}/summary.md`;
			const unitSummaryPath = `${basePath}/summary.md`;

			// Create resource file
			const prefix = resourceType === "link" ? "link_" : "text_";
			const extension = resourceType === "link" ? ".txt" : ".md";
			const fileName = `${prefix}${formattedName}${extension}`;
			const filePath = `${basePath}/resources/${fileName}`;

			// Submit resource and create summaries
			const response = await fetch("/api/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					path: filePath,
					content,
					subject: normalizedSubject,
					course: normalizedCourse,
					unit: normalizedUnit,
					resourceType,
					name: formattedName,
					createSummaries: {
						subject: {
							path: subjectSummaryPath,
							content: `---
title: "${subject}"
---`,
						},
						course: {
							path: courseSummaryPath,
							content: `---
title: "${course}"
subjectId: "${normalizedSubject}"
courseId: "${normalizedCourse}"
---`,
						},
						unit: {
							path: unitSummaryPath,
							content: `---
title: "${unit}"
subjectId: "${normalizedSubject}"
courseId: "${normalizedCourse}"
unitId: "${normalizedUnit}"
lastModified: "${new Date().toISOString()}"
---`,
						},
					},
				}),
			});

			if (!response.ok) throw new Error("Submission failed");

			// Reset form
			setName("");
			setContent("");
		} catch (error) {
			console.error("Error submitting resource:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Submit Resource</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Select
						value={resourceType}
						onValueChange={(value: "link" | "markdown") =>
							setResourceType(value)
						}
						disabled={isLoading}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select resource type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="link">Link</SelectItem>
							<SelectItem value="markdown">Markdown</SelectItem>
						</SelectContent>
					</Select>

					<Input
						placeholder="Subject"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						required
						disabled={isLoading}
					/>

					<Input
						placeholder="Course"
						value={course}
						onChange={(e) => setCourse(e.target.value)}
						required
						disabled={isLoading}
					/>

					<Input
						placeholder="Unit"
						value={unit}
						onChange={(e) => setUnit(e.target.value)}
						required
						disabled={isLoading}
					/>

					<Input
						placeholder="Resource Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						disabled={isLoading}
					/>

					{resourceType === "markdown" ? (
						<Textarea
							placeholder="Enter markdown content..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
							className="min-h-[200px]"
							disabled={isLoading}
						/>
					) : (
						<Input
							placeholder="Enter URL..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
							type="url"
							disabled={isLoading}
						/>
					)}

					<Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Submitting...
							</>
						) : (
							"Submit"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
