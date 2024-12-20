"use client";

import { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatTitle } from "@/lib/utils";

interface QuizQuestion {
	question: string;
	type: "text" | "multiple-choice" | "checkboxes";
	options?: string[];
	correctAnswers: string[];
}

interface Quiz {
	questions: QuizQuestion[];
}

interface Props {
	params: Promise<{
		subjectId: string;
		courseId: string;
		unitId: string;
		resourceId: string;
	}>;
}

export default function QuizPage(props: Props) {
	const params = use(props.params);
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState<{
		correct: number;
		total: number;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { subjectId, courseId, unitId, resourceId } = params;

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const response = await fetch(
					`/api/quiz?path=${encodeURIComponent(
						`${subjectId}/${courseId}/${unitId}/resources/quiz_${resourceId}.json`,
					)}`,
				);
				const data = await response.json();
				setQuiz(data);
			} finally {
				setIsLoading(false);
			}
		};
		fetchQuiz();
	}, [subjectId, courseId, unitId, resourceId]);

	const handleSubmit = () => {
		if (!quiz) return;

		let correct = 0;
		const results = quiz.questions.map((q, i) => {
			const userAnswers = answers[i] || [];
			const isCorrect =
				q.correctAnswers.length === userAnswers.length &&
				q.correctAnswers.every((a) => userAnswers.includes(a));
			if (isCorrect) correct++;
			return isCorrect;
		});

		setScore({
			correct,
			total: quiz.questions.length,
		});
		setSubmitted(true);
	};

	if (isLoading || !quiz) return null;

	return (
		<Card className="max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle>{formatTitle(resourceId)}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{quiz.questions.map((question, index) => (
					<div key={index} className="space-y-4">
						<h3 className="font-medium">Question {index + 1}</h3>
						<p>{question.question}</p>

						{question.type === "text" && (
							<input
								type="text"
								className="w-full p-2 border rounded"
								onChange={(e) =>
									setAnswers({
										...answers,
										[index]: [e.target.value],
									})
								}
								disabled={submitted}
							/>
						)}

						{question.type === "multiple-choice" && (
							<RadioGroup
								onValueChange={(value) =>
									setAnswers({ ...answers, [index]: [value] })
								}
								disabled={submitted}
							>
								{question.options?.map((option, i) => (
									<div
										key={i}
										className="flex items-center space-x-2"
									>
										<RadioGroupItem
											value={option}
											id={`q${index}-${i}`}
										/>
										<Label htmlFor={`q${index}-${i}`}>
											{option}
										</Label>
									</div>
								))}
							</RadioGroup>
						)}

						{question.type === "checkboxes" && (
							<div className="space-y-2">
								{question.options?.map((option, i) => (
									<div
										key={i}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={`q${index}-${i}`}
											onCheckedChange={(checked) => {
												const current =
													answers[index] || [];
												setAnswers({
													...answers,
													[index]: checked
														? [...current, option]
														: current.filter(
																(a) =>
																	a !==
																	option,
															),
												});
											}}
											disabled={submitted}
										/>
										<Label htmlFor={`q${index}-${i}`}>
											{option}
										</Label>
									</div>
								))}
							</div>
						)}

						{submitted && (
							<Alert
								variant={
									answers[index]?.every((a) =>
										question.correctAnswers.includes(a),
									)
										? "default"
										: "destructive"
								}
							>
								<AlertDescription>
									{answers[index]?.every((a) =>
										question.correctAnswers.includes(a),
									)
										? "Correct!"
										: `Incorrect. The correct answer(s): ${question.correctAnswers.join(
												", ",
											)}`}
								</AlertDescription>
							</Alert>
						)}
					</div>
				))}

				{!submitted ? (
					<Button onClick={handleSubmit}>Submit Quiz</Button>
				) : (
					<Alert>
						<AlertDescription>
							Score: {score?.correct}/{score?.total} (
							{Math.round(
								((score?.correct || 0) / (score?.total || 1)) *
									100,
							)}
							%)
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
