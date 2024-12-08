import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTitle(text: string): string {
	return text
		.replace(/-/g, " ") // Replace hyphens with spaces
		.replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
}
