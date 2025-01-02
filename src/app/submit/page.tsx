"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExistingPaths {
	subjects: string[];
	courses: { [subject: string]: string[] };
	units: { [course: string]: string[] };
}

export default function SubmitPage() {
	const [resourceType, setResourceType] = useState<
		"link" | "markdown" | "video"
	>("link");
	const [subject, setSubject] = useState("");
	const [course, setCourse] = useState("");
	const [unit, setUnit] = useState("");
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [startTime, setStartTime] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [existingPaths, setExistingPaths] = useState<ExistingPaths>({
		subjects: [],
		courses: {},
		units: {},
	});
	const [openSubject, setOpenSubject] = useState(false);
	const [openCourse, setOpenCourse] = useState(false);
	const [openUnit, setOpenUnit] = useState(false);
	const [customSubject, setCustomSubject] = useState("");
	const [customCourse, setCustomCourse] = useState("");
	const [customUnit, setCustomUnit] = useState("");

	useEffect(() => {
		const fetchExistingPaths = async () => {
			const response = await fetch("/api/paths");
			const data = await response.json();
			setExistingPaths(data);
		};
		fetchExistingPaths();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const normalizedSubject = subject
				.toLowerCase()
				.replace(/\s+/g, "-");
			const normalizedCourse = course.toLowerCase().replace(/\s+/g, "-");
			const normalizedUnit = unit.toLowerCase().replace(/\s+/g, "-");
			const formattedName = name.toLowerCase().replace(/\s+/g, "-");

			const basePath = `content/${normalizedSubject}/${normalizedCourse}/${normalizedUnit}`;
			const unitSummaryPath = `${basePath}/summary.md`;

			const prefix =
				resourceType === "link"
					? "link_"
					: resourceType === "video"
						? "video_"
						: "text_";
			const extension =
				resourceType === "video"
					? ".json"
					: resourceType === "link"
						? ".txt"
						: ".md";
			const fileName = `${prefix}${formattedName}${extension}`;
			const filePath = `${basePath}/resources/${fileName}`;

			const fileContent =
				resourceType === "video"
					? JSON.stringify(
							{
								youtubeUrl: content,
								startTime: startTime || 0,
							},
							null,
							2,
						)
					: content;

			const response = await fetch("/api/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					path: filePath,
					content: fileContent,
					subject: normalizedSubject,
					course: normalizedCourse,
					unit: normalizedUnit,
					resourceType,
					name: formattedName,
					createSummaries: {
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
			setName("");
			setContent("");
			setStartTime(0);
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
						onValueChange={(value: "link" | "markdown" | "video") =>
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
							<SelectItem value="video">Video</SelectItem>
						</SelectContent>
					</Select>

					<Popover open={openSubject} onOpenChange={setOpenSubject}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={openSubject}
								className="w-full justify-between"
								disabled={isLoading}
							>
								{subject || "Select subject..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0">
							<Command>
								<CommandInput
									placeholder="Search subject..."
									value={customSubject}
									onValueChange={setCustomSubject}
								/>
								<CommandList>
									<CommandEmpty>
										{customSubject && (
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => {
													setSubject(customSubject);
													setExistingPaths(
														(prev) => ({
															...prev,
															subjects: [
																...prev.subjects,
																customSubject,
															],
														}),
													);
													setOpenSubject(false);
													setCustomSubject("");
												}}
											>
												Create &quot;{customSubject}
												&quot;
											</Button>
										)}
									</CommandEmpty>
									<CommandGroup>
										{existingPaths.subjects.map((item) => (
											<CommandItem
												key={item}
												value={item}
												onSelect={(value) => {
													setSubject(value);
													setOpenSubject(false);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														subject === item
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												{item}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					<Popover open={openCourse} onOpenChange={setOpenCourse}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={openCourse}
								className="w-full justify-between"
								disabled={isLoading || !subject}
							>
								{course || "Select course..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0">
							<Command>
								<CommandInput
									placeholder="Search course..."
									value={customCourse}
									onValueChange={setCustomCourse}
								/>
								<CommandList>
									<CommandEmpty>
										{customCourse && (
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => {
													setCourse(customCourse);
													setExistingPaths(
														(prev) => ({
															...prev,
															courses: {
																...prev.courses,
																[subject]: [
																	...(prev
																		.courses[
																		subject
																	] || []),
																	customCourse,
																],
															},
														}),
													);
													setOpenCourse(false);
													setCustomCourse("");
												}}
											>
												Create &quot;{customCourse}
												&quot;
											</Button>
										)}
									</CommandEmpty>
									<CommandGroup>
										{existingPaths.courses[subject]?.map(
											(item) => (
												<CommandItem
													key={item}
													value={item}
													onSelect={(value) => {
														setCourse(value);
														setOpenCourse(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															course === item
																? "opacity-100"
																: "opacity-0",
														)}
													/>
													{item}
												</CommandItem>
											),
										)}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					<Popover open={openUnit} onOpenChange={setOpenUnit}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={openUnit}
								className="w-full justify-between"
								disabled={isLoading || !subject || !course}
							>
								{unit || "Select unit..."}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0">
							<Command>
								<CommandInput
									placeholder="Search unit..."
									value={customUnit}
									onValueChange={setCustomUnit}
								/>
								<CommandList>
									<CommandEmpty>
										{customUnit && (
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => {
													setUnit(customUnit);
													setExistingPaths(
														(prev) => ({
															...prev,
															units: {
																...prev.units,
																[`${subject}/${course}`]:
																	[
																		...(prev
																			.units[
																			`${subject}/${course}`
																		] ||
																			[]),
																		customUnit,
																	],
															},
														}),
													);
													setOpenUnit(false);
													setCustomUnit("");
												}}
											>
												Create &quot;{customUnit}&quot;
											</Button>
										)}
									</CommandEmpty>
									<CommandGroup>
										{existingPaths.units[
											`${subject}/${course}`
										]?.map((item) => (
											<CommandItem
												key={item}
												value={item}
												onSelect={(value) => {
													setUnit(value);
													setOpenUnit(false);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														unit === item
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												{item}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					<Input
						placeholder="Resource Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						disabled={isLoading}
					/>

					{resourceType === "video" ? (
						<>
							<Input
								placeholder="YouTube URL"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
								type="url"
								pattern="^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}.*$"
								title="Please enter a valid YouTube URL"
								disabled={isLoading}
							/>
							<Input
								placeholder="Start Time (seconds)"
								type="number"
								min="0"
								value={startTime}
								onChange={(e) =>
									setStartTime(parseInt(e.target.value) || 0)
								}
								disabled={isLoading}
							/>
						</>
					) : resourceType === "markdown" ? (
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
