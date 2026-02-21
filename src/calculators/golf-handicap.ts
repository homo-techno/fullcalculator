import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const golfHandicapCalculator: CalculatorDefinition = {
  slug: "golf-handicap-calculator",
  title: "Golf Handicap Calculator",
  description:
    "Free golf handicap calculator. Enter your recent scores, course rating, and slope rating to estimate your handicap index using differentials.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "golf handicap",
    "handicap index",
    "golf calculator",
    "golf score",
    "slope rating",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Golf Handicap",
      fields: [
        {
          name: "scores",
          label: "Recent Scores (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 85, 90, 88, 92, 87",
        },
        {
          name: "courseRating",
          label: "Course Rating",
          type: "number",
          placeholder: "e.g. 72.1",
        },
        {
          name: "slopeRating",
          label: "Slope Rating",
          type: "number",
          placeholder: "e.g. 125",
        },
      ],
      calculate: (inputs) => {
        const scoresStr = inputs.scores as string;
        const courseRating = inputs.courseRating as number;
        const slopeRating = inputs.slopeRating as number;

        if (!scoresStr || !courseRating || !slopeRating) return null;

        const scores = (scoresStr || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));

        if (scores.length === 0) return null;

        // Calculate differentials
        const differentials = scores.map(
          (score) => ((score - courseRating) * 113) / slopeRating
        );

        // Sort differentials ascending
        const sorted = [...differentials].sort((a, b) => a - b);

        // Use best differentials (roughly half, minimum 1)
        const numBest = Math.max(1, Math.floor(scores.length / 2));
        const bestDiffs = sorted.slice(0, numBest);

        // Average of best differentials
        const avgDiff =
          bestDiffs.reduce((sum, d) => sum + d, 0) / bestDiffs.length;

        // Handicap index (simplified - multiply by 0.96)
        const handicapIndex = avgDiff * 0.96;

        const avgScore =
          scores.reduce((sum, s) => sum + s, 0) / scores.length;
        const bestScore = Math.min(...scores);
        const worstScore = Math.max(...scores);

        return {
          primary: {
            label: "Handicap Index",
            value: formatNumber(handicapIndex, 1),
          },
          details: [
            {
              label: "Scores Entered",
              value: formatNumber(scores.length, 0),
            },
            {
              label: "Best Differentials Used",
              value: formatNumber(numBest, 0),
            },
            {
              label: "Average Differential",
              value: formatNumber(avgDiff, 2),
            },
            {
              label: "Average Score",
              value: formatNumber(avgScore, 1),
            },
            { label: "Best Score", value: formatNumber(bestScore, 0) },
            { label: "Worst Score", value: formatNumber(worstScore, 0) },
            {
              label: "Course Rating",
              value: formatNumber(courseRating, 1),
            },
            {
              label: "Slope Rating",
              value: formatNumber(slopeRating, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bowling-score-calculator"],
  faq: [
    {
      question: "How is a golf handicap calculated?",
      answer:
        "Each score produces a differential: (Score - Course Rating) x 113 / Slope Rating. The best differentials are averaged, then multiplied by 0.96 to get the Handicap Index.",
    },
    {
      question: "How many scores do I need?",
      answer:
        "While an official handicap typically requires a minimum of 5 scores (with 20 being ideal), this calculator will work with any number of scores for an estimate.",
    },
  ],
  formula:
    "Differential = (Score - Course Rating) x 113 / Slope Rating. Handicap Index = Average of best differentials x 0.96.",
};
