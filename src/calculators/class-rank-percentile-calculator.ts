import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const classRankPercentileCalculator: CalculatorDefinition = {
  slug: "class-rank-percentile-calculator",
  title: "Class Rank Percentile Calculator",
  description: "Calculate your class rank percentile from rank and class size.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["class rank","percentile","standing","school","ranking"],
  variants: [{
    id: "standard",
    name: "Class Rank Percentile",
    description: "Calculate your class rank percentile from rank and class size.",
    fields: [
      { name: "classRank", label: "Your Class Rank", type: "number", min: 1, max: 2000, step: 1, defaultValue: 25 },
      { name: "classSize", label: "Total Class Size", type: "number", min: 10, max: 2000, step: 1, defaultValue: 300 },
      { name: "method", label: "Calculation Method", type: "select", options: [{ value: "1", label: "Standard (rank/size)" }, { value: "2", label: "Adjusted ((size-rank)/size)" }] },
    ],
    calculate: (inputs) => {
    const classRank = inputs.classRank as number;
    const classSize = inputs.classSize as number;
    const method = inputs.method as number;
    if (classRank > classSize) return null;
    const percentile = method === 1 ? ((classSize - classRank) / classSize) * 100 : ((classSize - classRank + 1) / classSize) * 100;
    const topPercent = (classRank / classSize) * 100;
    const quartile = topPercent <= 25 ? "1st" : topPercent <= 50 ? "2nd" : topPercent <= 75 ? "3rd" : "4th";
    return {
      primary: { label: "Percentile", value: formatNumber(percentile) + "th" },
      details: [
        { label: "Top Percentage", value: "Top " + formatNumber(topPercent) + "%" },
        { label: "Quartile", value: quartile + " Quartile" },
        { label: "Students Ranked Below", value: formatNumber(classSize - classRank) },
        { label: "Class Rank", value: classRank + " of " + classSize }
      ]
    };
  },
  }],
  relatedSlugs: ["gpa-calculator","sat-score-calculator","act-to-sat-converter-calculator"],
  faq: [
    { question: "How is class rank percentile calculated?", answer: "Percentile equals (class size minus rank) divided by class size, multiplied by 100." },
    { question: "What class rank is considered good?", answer: "Being in the top 10% to 25% of your class is generally considered strong for college admissions." },
  ],
  formula: "Percentile = ((Class Size - Rank) / Class Size) x 100",
};
