This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Study Smarter Content Creation Guide

## Writing Unit Summaries

Unit summaries are created as `summary.md` files in the unit folder:
`content/[subject]/[course]/[unit]/summary.md`

Example unit summary:

```md
---
title: "Unit 1: Introduction to Algebra"
subjectId: "math"
courseId: "algebra"
unitId: "unit1"
---

Welcome to Unit 1! This unit covers:

-   Basic algebraic expressions
-   Solving linear equations
-   Working with variables and constants

Key concepts you'll learn:

1. Terms and coefficients
2. Like terms
3. Distributive property
```

### Unit In Progress Status

Add `inProgress: true` to unit summary frontmatter to mark as in progress:

```md
---
title: "Unit 1: Introduction"
subjectId: "math"
courseId: "algebra"
unitId: "unit1"
inProgress: true
---

Unit content...
```

## Creating Resources

### Text Resources

Create Markdown files in the unit's resources folder:

`content/[subject]/[course]/[unit]/resources/text_[name].md`

Example text resource:

```md
# Study Guide: Linear Equations

## Key Points

-   An equation is an expression with an equals sign
-   Variables represent unknown values
-   Solve by isolating the variable

## Examples

1. x + 5 = 10
2. 2y - 3 = 7
```

### PDF Resources

1. Two ways to add PDFs:
   `public/resources/[subject]/[course]/[unit]/pdf_[name].pdf`

2. URL-based PDFs - create a text file:
   `content/[subject]/[course]/[unit]/resources/pdf_[name].txt`
   containing just the URL:
   `https://example.com/sample.pdf`

### Link Resources

Create a text file:
`content/[subject]/[course]/[unit]/resources/link_[name].txt`
containing just the URL:
`https://www.example.com`

### Ecalidraw Resources

Create an Excalidraw file:
`content/[subject]/[course]/[unit]/resources/excalidraw_[name].excalidraw`

Example structure:

```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor",
	"elements": [
		{
			"type": "text",
			"text": "Hello World!"
			// ... other properties
		}
	]
}
```

### Podcast Resources

Create a JSON file:
`content/[subject]/[course]/[unit]/resources/podcast_[name].json`

Example structure:

```json
{
	"apple": "https://embed.podcasts.apple.com/us/podcast/example?theme=light",
	"spotify": "https://open.spotify.com/embed/episode/example"
}
```

You can include either or both platform links.

### Flashcard Resources

Create a JSON file:
`content/[subject]/[course]/[unit]/resources/flashcard_[name].json`

Example structure:

```json
{
	"cards": [
		{
			"term": "Binary",
			"definition": "A base-2 number system using only 0 and 1"
		},
		{
			"term": "Bit",
			"definition": "The smallest unit of data, representing 0 or 1"
		}
	],
	"quizletUrl": "https://quizlet.com/your-flashcard-set" // Optional: Link to Quizlet set
}
```

### Video Resources

Create a JSON file:
`content/[subject]/[course]/[unit]/resources/video_[name].json`

Example structure:

```json
{
	"youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
	"startTime": 0 // Optional: Start time in seconds
}
```

Only YouTube URLs are supported. The `startTime` field is optional and specifies where the video should start playing from in seconds.

### Quiz Resources

Create a JSON file:
`content/[subject]/[course]/[unit]/resources/quiz_[name].json`

Example structure:

```json
{
  "questions": [
    {
      "question": "What is a bit?",
      "type": "text",
      "correctAnswers": ["The smallest unit of data"]
    },
    {
      "question": "What number system is used in computers?",
      "type": "multiple-choice",
      "options": ["Binary", "Decimal", "Hexadecimal"],
      "correctAnswers": ["Binary"]
    },
    {
      "question": "Select all valid logic gates:",
      "type": "checkboxes",
      "options": ["AND", "OR", "XOR", "MAYBE", "NOT"],
      "correctAnswers": ["AND", "OR", "XOR", "NOT"]
    }
  ]
}

## File Naming Conventions

-   Use lowercase letters
-   Use hyphens for spaces in names
-   Prefix files with resource types
    -   `text_`
    -   `pdf_`
    -   `link_`
    -   `excalidraw_`
	-	`flashcard_`
	-	`podcast_`
	-	`quiz_`
	-	`video_`

## Example Directory Structure

```

content/
math/
algebra/
unit1/
summary.md
resources/
text_study-guide.md
pdf_worksheet.txt
link_khan-academy.txt
excalidraw_graphs.excalidraw
public/
resources/
math/
algebra/
unit1/
pdf_practice.pdf

```

```

```

```
