// src/app/[subjectId]/[courseId]/[unitId]/flashcard/[resourceId]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, ChevronLeft, ChevronRight, FlipVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
	term: string;
	definition: string;
}

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default function FlashcardPage(props: Props) {
	const params = use(props.params);
	const [cards, setCards] = useState<Flashcard[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { subjectId, courseId, unitId, resourceId } = params;

	useEffect(() => {
		const fetchCards = async () => {
			try {
				const response = await fetch(
					`/api/flashcard?path=${encodeURIComponent(
						`${subjectId}/${courseId}/${unitId}/resources/flashcard_${resourceId}.json`,
					)}`,
				);
				const data = await response.json();
				setCards(data.cards);
			} catch (err) {
				console.error("Error loading flashcards:", err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchCards();
	}, [subjectId, courseId, unitId, resourceId]);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowLeft":
					previousCard();
					break;
				case "ArrowRight":
					nextCard();
					break;
				case " ":
					e.preventDefault();
					toggleFlip();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, []);

	const nextCard = () => {
		setCurrentIndex((prev) => (prev + 1) % cards.length);
		setIsFlipped(false);
	};

	const previousCard = () => {
		setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
		setIsFlipped(false);
	};

	const toggleFlip = () => setIsFlipped((prev) => !prev);

	const shuffleCards = () => {
		setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
		setCurrentIndex(0);
		setIsFlipped(false);
	};

	if (isLoading || !cards.length) return null;

	return (
		<div className="max-w-4xl mx-auto space-y-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="capitalize">
						{resourceId.replace(/\b\w/g, (l) => l.toUpperCase())}
					</CardTitle>
					<div className="text-sm text-muted-foreground">
						{currentIndex + 1} / {cards.length}
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<div
						className="relative min-h-[400px] [perspective:1000px]"
						onClick={toggleFlip}
					>
						<div
							className={cn(
								"absolute inset-0 w-full h-full transition-all duration-500",
								"[transform-style:preserve-3d] cursor-pointer",
								isFlipped && "[transform:rotateY(180deg)]",
							)}
						>
							<div className="absolute inset-0 flex items-center justify-center p-6 text-lg text-center [backface-visibility:hidden]">
								{cards[currentIndex].term}
							</div>
							<div className="absolute inset-0 flex items-center justify-center p-6 text-lg text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
								{cards[currentIndex].definition}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-center gap-2">
				<Button onClick={previousCard} variant="outline" size="icon">
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button onClick={toggleFlip} variant="outline" size="icon">
					<FlipVertical className="h-4 w-4" />
				</Button>
				<Button onClick={shuffleCards} variant="outline" size="icon">
					<Shuffle className="h-4 w-4" />
				</Button>
				<Button onClick={nextCard} variant="outline" size="icon">
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
