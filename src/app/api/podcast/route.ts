// src/app/api/podcast/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const filePath = searchParams.get("path");

	if (!filePath) {
		return new NextResponse("Missing path parameter", { status: 400 });
	}

	const fullPath = path.join(process.cwd(), "content", filePath);

	try {
		const content = fs.readFileSync(fullPath, "utf8");
		return new NextResponse(content);
	} catch (error) {
		return new NextResponse("Resource not found", { status: 404 });
	}
}
