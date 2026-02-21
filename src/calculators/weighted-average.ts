import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weightedAverageCalculator: CalculatorDefinition = {
  slug: "weighted-average-calculator",
  title: "Weighted Average Calculator",
  description:
    "Free weighted average calculator. Calculate the weighted mean given values and their corresponding weights.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "weighted average",
    "weighted mean",
    "GPA calculator",
    "weighted score",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Weighted Average",
      fields: [
        {
          name: "values",
          label: "Values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 90, 80, 70",
        },
        {
          name: "weights",
          label: "Weights (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 3, 2, 1",
        },
      ],
      calculate: (inputs) => {
        const vals = (inputs.values as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        const wts = (inputs.weights as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (vals.length === 0 || wts.length === 0 || vals.length !== wts.length)
          return null;
        if (wts.some((w) => w < 0)) return null;

        const sumWeights = wts.reduce((a, b) => a + b, 0);
        if (sumWeights === 0) return null;

        const weightedSum = vals.reduce((acc, v, i) => acc + v * wts[i], 0);
        const weightedAvg = weightedSum / sumWeights;

        // Unweighted mean for comparison
        const unweightedAvg = vals.reduce((a, b) => a + b, 0) / vals.length;

        return {
          primary: { label: "Weighted Average", value: formatNumber(weightedAvg, 4) },
          details: [
            { label: "Unweighted Average", value: formatNumber(unweightedAvg, 4) },
            { label: "Weighted Sum", value: formatNumber(weightedSum, 4) },
            { label: "Sum of Weights", value: formatNumber(sumWeights, 4) },
            { label: "Data points", value: String(vals.length) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "mean-median-mode-calculator",
    "geometric-mean-calculator",
    "harmonic-mean-calculator",
  ],
  faq: [
    {
      question: "What is a weighted average?",
      answer:
        "A weighted average is an average where each value contributes differently based on its weight. For example, in a class where exams count 60% and homework 40%, the final grade is a weighted average of exam and homework scores.",
    },
  ],
  formula: "Weighted Average = Σ(wᵢ × xᵢ) / Σwᵢ",
};
