import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

export const metadata: Metadata = {
	title: "StudySmarter",
	description: "A place with notes for studying",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
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
			<Script src="https://scripts.simpleanalyticscdn.com/latest.js" data-collect-dnt="true" />
		</html>
	);
}
