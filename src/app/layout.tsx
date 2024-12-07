// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "@excalidraw/excalidraw/index.css";

export const metadata: Metadata = {
	title: "Study Notes App",
	description: "An app to display study notes",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<header className="bg-gray-800 text-white p-4">
					<Link href="/">
						<h1 className="text-2xl font-bold">Study Notes App</h1>
					</Link>
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}
