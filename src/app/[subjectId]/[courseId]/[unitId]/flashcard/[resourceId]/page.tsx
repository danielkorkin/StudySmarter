// src/app/[subjectId]/[courseId]/[unitId]/flashcard/[resourceId]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Shuffle,
	ChevronLeft,
	ChevronRight,
	FlipVertical,
	ExternalLink,
} from "lucide-react";
import { cn, formatTitle } from "@/lib/utils";
import { KnowtIcon, QuizletIcon } from "@/components/Icons";

export interface Flashcard {
	term: string;
	definition: string;
}

export interface FlashcardData {
	cards: Flashcard[];
	quizletUrl?: string;
	knowtUrl?: string;
}

export interface Props {
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
	const [quizletUrl, setQuizletUrl] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isAnimating, setIsAnimating] = useState(false);
	const [slideDirection, setSlideDirection] = useState<
		"left" | "right" | null
	>(null);
	const [knowtUrl, setKnowtUrl] = useState<string | null>(null);

	const { subjectId, courseId, unitId, resourceId } = params;

	useEffect(() => {
		const fetchCards = async () => {
			try {
				const response = await fetch(
					`/api/flashcard?path=${encodeURIComponent(
						`${subjectId}/${courseId}/${unitId}/resources/flashcard_${resourceId}.json`,
					)}`,
				);
				const data: FlashcardData = await response.json();
				setCards(data.cards);
				setCurrentCard(data.cards[0]);
				setQuizletUrl(data.quizletUrl || null);
				setKnowtUrl(data.knowtUrl || null);
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
			if (isAnimating) return;

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
	}, [isAnimating]);

	const nextCard = () => {
		if (isAnimating || !currentCard) return;
		setIsAnimating(true);
		setSlideDirection("left");
		setIsFlipped(false);

		const nextIndex = (currentIndex + 1) % cards.length;

		setTimeout(() => {
			setCurrentCard(cards[nextIndex]);
			setCurrentIndex(nextIndex);
			setSlideDirection(null);
			setIsAnimating(false);
		}, 200);
	};

	const previousCard = () => {
		if (isAnimating || !currentCard) return;
		setIsAnimating(true);
		setSlideDirection("right");
		setIsFlipped(false);

		const prevIndex = (currentIndex - 1 + cards.length) % cards.length;

		setTimeout(() => {
			setCurrentCard(cards[prevIndex]);
			setCurrentIndex(prevIndex);
			setSlideDirection(null);
			setIsAnimating(false);
		}, 200);
	};

	const toggleFlip = () => {
		if (isAnimating) return;
		setIsFlipped((prev) => !prev);
	};

	const shuffleCards = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		const shuffled = [...cards].sort(() => Math.random() - 0.5);
		setCards(shuffled);
		setCurrentCard(shuffled[0]);
		setCurrentIndex(0);
		setIsFlipped(false);
		setTimeout(() => {
			setIsAnimating(false);
		}, 200);
	};

	if (isLoading || !currentCard) return null;

	return (
		<div className="max-w-4xl mx-auto space-y-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="flex items-center gap-4">
						<CardTitle>{formatTitle(resourceId)}</CardTitle>
						<div className="flex gap-2">
							{quizletUrl && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2 text-[#4453FF] hover:text-[#4453FF]/90"
									onClick={() =>
										window.open(quizletUrl, "_blank")
									}
								>
									<QuizletIcon className="h-4 w-4" />
									Open in Quizlet
								</Button>
							)}
							{knowtUrl && (
								<Button
									variant="outline"
									size="sm"
									className="gap-2 text-[#50D2C2] hover:text-[#50D2C2]/90"
									onClick={() =>
										window.open(knowtUrl, "_blank")
									}
								>
									<KnowtIcon className="h-4 w-4" />
									Open in Knowt
								</Button>
							)}
						</div>
					</div>
					<div className="text-sm text-muted-foreground">
						{currentIndex + 1} / {cards.length}
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="relative min-h-[400px] [perspective:1000px]">
						<div
							className={cn(
								"relative w-full h-[400px] cursor-pointer transition-all duration-200",
								slideDirection === "left" &&
									"animate-slide-left",
								slideDirection === "right" &&
									"animate-slide-right",
							)}
							onClick={toggleFlip}
						>
							<div
								className={cn(
									"absolute inset-0 w-full h-full bg-card rounded-xl border shadow",
									"[transform-style:preserve-3d] transition-transform duration-500",
									isFlipped && "[transform:rotateX(180deg)]",
								)}
							>
								<div className="absolute inset-0 flex items-center justify-center p-6 text-lg text-center [backface-visibility:hidden]">
									{currentCard.term}
								</div>
								<div className="absolute inset-0 flex items-center justify-center p-6 text-lg text-center [backface-visibility:hidden] [transform:rotateX(180deg)]">
									{currentCard.definition}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-center gap-2">
				<Button
					onClick={previousCard}
					variant="outline"
					size="icon"
					disabled={isAnimating}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button
					onClick={toggleFlip}
					variant="outline"
					size="icon"
					disabled={isAnimating}
				>
					<FlipVertical className="h-4 w-4" />
				</Button>
				<Button
					onClick={shuffleCards}
					variant="outline"
					size="icon"
					disabled={isAnimating}
				>
					<Shuffle className="h-4 w-4" />
				</Button>
				<Button
					onClick={nextCard}
					variant="outline"
					size="icon"
					disabled={isAnimating}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
