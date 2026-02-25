import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flashcardRetentionCalculator: CalculatorDefinition = {
  slug: "flashcard-retention-calculator",
  title: "Flashcard Retention Calculator",
  description:
    "Free flashcard retention calculator. Estimate memorization progress using spaced repetition principles and the Ebbinghaus forgetting curve.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "flashcard retention calculator",
    "spaced repetition calculator",
    "memory retention",
    "forgetting curve calculator",
    "flashcard study planner",
  ],
  variants: [
    {
      id: "retention",
      name: "Retention Estimate",
      description: "Estimate how much you'll remember based on study sessions and time elapsed (Ebbinghaus model)",
      fields: [
        { name: "totalCards", label: "Total Flashcards", type: "number", placeholder: "e.g. 100", min: 1 },
        { name: "reviewSessions", label: "Number of Review Sessions", type: "number", placeholder: "e.g. 3", min: 1, max: 20 },
        { name: "daysSinceFirst", label: "Days Since First Study", type: "number", placeholder: "e.g. 7", min: 0 },
        { name: "avgAccuracy", label: "Average Accuracy (%)", type: "number", placeholder: "e.g. 80", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const cards = inputs.totalCards as number;
        const sessions = inputs.reviewSessions as number;
        const days = inputs.daysSinceFirst as number;
        const accuracy = inputs.avgAccuracy as number;
        if (!cards || !sessions || days === undefined || accuracy === undefined) return null;

        // Simplified Ebbinghaus-inspired retention model
        // Each review session strengthens memory; time degrades it
        const stabilityFactor = Math.min(1, 0.3 + sessions * 0.15);
        const decayRate = Math.max(0.1, 1 - stabilityFactor);
        const retentionRate = Math.max(0.1, Math.min(1, Math.exp(-decayRate * days / 10))) * (accuracy / 100);
        const cardsRetained = Math.round(cards * retentionRate);
        const cardsToReview = cards - cardsRetained;

        const nextReviewDays = Math.round(Math.pow(2, sessions - 1));

        return {
          primary: { label: "Estimated Retention", value: `${formatNumber(retentionRate * 100, 0)}%` },
          details: [
            { label: "Cards likely remembered", value: formatNumber(cardsRetained, 0) },
            { label: "Cards needing review", value: formatNumber(cardsToReview, 0) },
            { label: "Memory stability", value: `${formatNumber(stabilityFactor * 100, 0)}%` },
            { label: "Suggested next review", value: `In ${nextReviewDays} day${nextReviewDays > 1 ? "s" : ""}` },
          ],
        };
      },
    },
    {
      id: "study-plan",
      name: "Flashcard Study Plan",
      description: "Calculate how many cards to study per day to learn a set by a deadline",
      fields: [
        { name: "totalCards", label: "Total Cards to Learn", type: "number", placeholder: "e.g. 500", min: 1 },
        { name: "daysAvailable", label: "Days Until Exam", type: "number", placeholder: "e.g. 30", min: 1 },
        { name: "minutesPerDay", label: "Study Minutes per Day", type: "number", placeholder: "e.g. 30", min: 5 },
        { name: "secondsPerCard", label: "Seconds per Card Review", type: "number", placeholder: "e.g. 10", min: 3, max: 60, defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const cards = inputs.totalCards as number;
        const days = inputs.daysAvailable as number;
        const minutes = inputs.minutesPerDay as number;
        const secPerCard = (inputs.secondsPerCard as number) || 10;
        if (!cards || !days || !minutes) return null;

        const cardsPerSession = Math.floor((minutes * 60) / secPerCard);
        const newCardsPerDay = Math.ceil(cards / days);
        const reviewRounds = 3; // Recommended review rounds
        const totalReviews = cards * reviewRounds;
        const totalDaysNeeded = Math.ceil(totalReviews / cardsPerSession);

        const feasible = newCardsPerDay <= cardsPerSession;

        return {
          primary: { label: "New Cards per Day", value: formatNumber(newCardsPerDay, 0) },
          details: [
            { label: "Cards per session capacity", value: formatNumber(cardsPerSession, 0) },
            { label: "Feasible?", value: feasible ? "Yes" : "No - increase daily time" },
            { label: "Total reviews needed (3 rounds)", value: formatNumber(totalReviews, 0) },
            { label: "Days for all reviews", value: formatNumber(totalDaysNeeded, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["study-time-calculator", "reading-time-calculator"],
  faq: [
    {
      question: "What is spaced repetition?",
      answer:
        "Spaced repetition is a study technique where you review information at increasing intervals. Cards you know well are shown less frequently, while difficult cards appear more often, optimizing memory retention.",
    },
    {
      question: "How many flashcards should I study per day?",
      answer:
        "Most experts recommend learning 10-30 new cards per day while reviewing older cards. The exact number depends on card complexity and your available study time.",
    },
  ],
  formula: "Retention = e^(-decay x days/10) x (accuracy/100)",
};
