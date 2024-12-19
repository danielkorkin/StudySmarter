import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
	title: "StudySmarter",
	description: "A place with notes for studying",
	verification: {
		google: "BqPVn2qZSE5hPv9Delq3GZ5k_y93MN2FItOMFDxTvGc",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
					integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
					crossOrigin="anonymous"
				/>
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					<main className="container mx-auto px-4 py-8">
						{children}
					</main>
				</ThemeProvider>
			</body>
			<Script
				src="https://scripts.simpleanalyticscdn.com/latest.js"
				data-collect-dnt="true"
			/>
		</html>
	);
}
