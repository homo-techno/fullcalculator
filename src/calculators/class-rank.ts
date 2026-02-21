import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const classRankCalculator: CalculatorDefinition = {
  slug: "class-rank-calculator",
  title: "Class Rank Percentile Calculator",
  description:
    "Free class rank percentile calculator. Find your class rank percentile, determine top percentage, and see how your rank compares.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "class rank calculator",
    "class rank percentile",
    "top percent calculator",
    "class standing calculator",
    "valedictorian calculator",
  ],
  variants: [
    {
      id: "percentile",
      name: "Class Rank to Percentile",
      description: "Convert your class rank to a percentile",
      fields: [
        { name: "rank", label: "Your Class Rank", type: "number", placeholder: "e.g. 15", min: 1 },
        { name: "classSize", label: "Total Students in Class", type: "number", placeholder: "e.g. 350", min: 1 },
      ],
      calculate: (inputs) => {
        const rank = inputs.rank as number;
        const classSize = inputs.classSize as number;
        if (!rank || !classSize || rank > classSize) return null;

        const percentile = ((classSize - rank) / classSize) * 100;
        const topPercent = (rank / classSize) * 100;

        let honors = "None";
        if (topPercent <= 1) honors = "Valedictorian/Salutatorian range";
        else if (topPercent <= 5) honors = "Summa Cum Laude range";
        else if (topPercent <= 10) honors = "Magna Cum Laude range";
        else if (topPercent <= 15) honors = "Cum Laude range";
        else if (topPercent <= 25) honors = "Top Quarter";

        return {
          primary: { label: "Percentile", value: `${formatNumber(percentile, 1)}th` },
          details: [
            { label: "Top percentage", value: `Top ${formatNumber(topPercent, 1)}%` },
            { label: "Rank", value: `${rank} out of ${classSize}` },
            { label: "Students behind you", value: formatNumber(classSize - rank, 0) },
            { label: "Students ahead of you", value: formatNumber(rank - 1, 0) },
            { label: "Honor estimate", value: honors },
          ],
        };
      },
    },
    {
      id: "fromPercentile",
      name: "Percentile to Rank",
      description: "Find what rank corresponds to a given percentile",
      fields: [
        { name: "percentile", label: "Desired Percentile", type: "number", placeholder: "e.g. 90", min: 0, max: 100 },
        { name: "classSize", label: "Total Students in Class", type: "number", placeholder: "e.g. 350", min: 1 },
      ],
      calculate: (inputs) => {
        const percentile = inputs.percentile as number;
        const classSize = inputs.classSize as number;
        if (percentile === undefined || !classSize) return null;

        const rank = Math.round(classSize * (1 - percentile / 100));
        const adjustedRank = Math.max(1, Math.min(rank, classSize));

        return {
          primary: { label: "Approximate Rank", value: `#${adjustedRank}` },
          details: [
            { label: "Target percentile", value: `${formatNumber(percentile, 0)}th` },
            { label: "Class size", value: formatNumber(classSize, 0) },
            { label: "Top percentage", value: `Top ${formatNumber((adjustedRank / classSize) * 100, 1)}%` },
            { label: "Rank required for top 10%", value: `#${Math.max(1, Math.round(classSize * 0.10))}` },
            { label: "Rank required for top 25%", value: `#${Math.max(1, Math.round(classSize * 0.25))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "cumulative-gpa-calculator", "test-score-calculator"],
  faq: [
    {
      question: "How is class rank percentile calculated?",
      answer:
        "Percentile = ((Total Students - Your Rank) / Total Students) x 100. If you are ranked 15th out of 350 students, your percentile is (350-15)/350 x 100 = 95.7th percentile.",
    },
    {
      question: "What class rank do I need for top 10%?",
      answer:
        "To be in the top 10%, your rank must be at or above the 90th percentile. In a class of 350, that means rank 35 or better.",
    },
    {
      question: "Do colleges care about class rank?",
      answer:
        "Many selective colleges consider class rank, especially for students in the top 10-25%. However, many high schools have stopped ranking students, and colleges have adapted their admissions accordingly.",
    },
  ],
  formula: "Percentile = ((Class Size - Rank) / Class Size) x 100",
};
