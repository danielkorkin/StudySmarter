// src/app/api/excalidraw/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const filePathParam = searchParams.get("path");

	if (!filePathParam) {
		return NextResponse.json(
			{ error: "Path is required" },
			{ status: 400 },
		);
	}

	const filePath = path.join(process.cwd(), "content", filePathParam);

	try {
		const fileContents = fs.readFileSync(filePath, "utf8");
		const data = JSON.parse(fileContents);
		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to read file" },
			{ status: 500 },
		);
	}
}
