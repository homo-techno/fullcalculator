import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flashcardStudyCalculator: CalculatorDefinition = {
  slug: "flashcard-study-calculator",
  title: "Flashcard Study Planner Calculator",
  description:
    "Free flashcard study planner. Calculate how many flashcards to study daily, estimate review sessions using spaced repetition, and plan for exam preparation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "flashcard calculator",
    "study planner calculator",
    "spaced repetition calculator",
    "flashcard study schedule",
    "anki study planner",
  ],
  variants: [
    {
      id: "daily",
      name: "Daily Flashcard Plan",
      description: "Calculate how many flashcards to study each day before your exam",
      fields: [
        { name: "totalCards", label: "Total Flashcards to Learn", type: "number", placeholder: "e.g. 300" },
        { name: "daysUntilExam", label: "Days Until Exam", type: "number", placeholder: "e.g. 14", min: 1 },
        { name: "studyMinutesPerDay", label: "Study Minutes Per Day", type: "number", placeholder: "e.g. 60" },
        { name: "cardsKnown", label: "Cards You Already Know", type: "number", placeholder: "e.g. 50", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const totalCards = inputs.totalCards as number;
        const days = inputs.daysUntilExam as number;
        const minutesPerDay = inputs.studyMinutesPerDay as number;
        const known = (inputs.cardsKnown as number) || 0;
        if (!totalCards || !days || !minutesPerDay) return null;

        const cardsToLearn = Math.max(0, totalCards - known);
        const newCardsPerDay = Math.ceil(cardsToLearn / Math.max(1, days - 2)); // leave 2 days for review
        const reviewDays = Math.min(2, days);

        // Average time per card: ~15 seconds for new, ~8 seconds for review
        const secondsPerNewCard = 15;
        const secondsPerReviewCard = 8;

        // Spaced repetition: each card reviewed ~3 times on average
        const totalReviewSessions = cardsToLearn * 3;
        const dailyReviews = Math.ceil(totalReviewSessions / days);
        const dailyTimeNew = (newCardsPerDay * secondsPerNewCard) / 60;
        const dailyTimeReview = (dailyReviews * secondsPerReviewCard) / 60;
        const totalDailyTime = dailyTimeNew + dailyTimeReview;

        const achievable = totalDailyTime <= minutesPerDay;

        return {
          primary: { label: "New Cards Per Day", value: formatNumber(newCardsPerDay, 0) },
          details: [
            { label: "Cards to learn", value: formatNumber(cardsToLearn, 0) },
            { label: "Daily reviews (spaced repetition)", value: `~${formatNumber(dailyReviews, 0)}` },
            { label: "Est. daily time (new cards)", value: `${formatNumber(dailyTimeNew, 0)} min` },
            { label: "Est. daily time (reviews)", value: `${formatNumber(dailyTimeReview, 0)} min` },
            { label: "Est. total daily time", value: `${formatNumber(totalDailyTime, 0)} min` },
            { label: "Fits in your schedule", value: achievable ? "Yes" : "No - consider more time or fewer cards" },
            { label: "Review-only days before exam", value: `${reviewDays}` },
          ],
          note: !achievable ? "Your study time may not be enough. Consider starting earlier, increasing daily time, or reducing the number of cards." : undefined,
        };
      },
    },
    {
      id: "spacedRepetition",
      name: "Spaced Repetition Schedule",
      description: "Plan optimal review intervals based on spaced repetition science",
      fields: [
        { name: "totalCards", label: "Total Flashcards", type: "number", placeholder: "e.g. 200" },
        { name: "newPerDay", label: "New Cards Per Day", type: "number", placeholder: "e.g. 20" },
        { name: "retentionTarget", label: "Target Retention (%)", type: "number", placeholder: "e.g. 90", min: 50, max: 99, defaultValue: 90 },
      ],
      calculate: (inputs) => {
        const totalCards = inputs.totalCards as number;
        const newPerDay = inputs.newPerDay as number;
        const retention = (inputs.retentionTarget as number) || 90;
        if (!totalCards || !newPerDay) return null;

        const daysToFinish = Math.ceil(totalCards / newPerDay);

        // Spaced repetition intervals (simplified Leitner system)
        // Review after: 1 day, 3 days, 7 days, 14 days, 30 days
        const intervals = [1, 3, 7, 14, 30];

        // At steady state, daily review load = new cards * sum of review probabilities
        // Simplified: each card is reviewed ~5 times total
        const reviewsPerCard = retention >= 95 ? 6 : retention >= 85 ? 5 : 4;
        const totalReviews = totalCards * reviewsPerCard;
        const dailyReviewsSteady = Math.round(newPerDay * reviewsPerCard * 0.6); // 60% daily due to spacing

        const minutesPerNewCard = 0.25; // 15 seconds
        const minutesPerReview = 0.13; // 8 seconds
        const dailyMinutes = newPerDay * minutesPerNewCard + dailyReviewsSteady * minutesPerReview;

        return {
          primary: { label: "Days to Learn All Cards", value: formatNumber(daysToFinish, 0) },
          details: [
            { label: "New cards per day", value: formatNumber(newPerDay, 0) },
            { label: "Review intervals", value: "1d, 3d, 7d, 14d, 30d" },
            { label: "Avg. daily reviews (at steady state)", value: `~${formatNumber(dailyReviewsSteady, 0)}` },
            { label: "Total review sessions", value: formatNumber(totalReviews, 0) },
            { label: "Estimated daily time", value: `${formatNumber(dailyMinutes, 0)} min` },
            { label: "Target retention", value: `${retention}%` },
          ],
          note: `With ${newPerDay} new cards/day, you will finish learning all ${totalCards} cards in ${daysToFinish} days. Continue reviewing for at least 30 more days for long-term retention.`,
        };
      },
    },
  ],
  relatedSlugs: ["study-time-calculator", "homework-planner-calculator", "test-score-calculator"],
  faq: [
    {
      question: "How many flashcards should I study per day?",
      answer:
        "Most students can effectively learn 20-30 new flashcards per day with spaced repetition. However, review cards accumulate, so plan for 15-30 minutes of review time on top of learning new cards. Studying too many new cards leads to a heavy review burden.",
    },
    {
      question: "What is spaced repetition?",
      answer:
        "Spaced repetition is a study technique where you review material at increasing intervals. After learning a card, you review it after 1 day, then 3 days, then 7, 14, and 30 days. This leverages the spacing effect for better long-term memory retention.",
    },
    {
      question: "How long should I study flashcards before an exam?",
      answer:
        "Ideally, start 2-4 weeks before the exam so spaced repetition has time to work. Cramming flashcards the night before is far less effective. For 200 cards, start at least 10 days early studying 20 new cards per day.",
    },
  ],
  formula: "New Cards/Day = (Total Cards - Known Cards) / (Days - Review Days)",
};
