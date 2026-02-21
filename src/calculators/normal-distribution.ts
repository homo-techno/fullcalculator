import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const normalDistributionCalculator: CalculatorDefinition = {
  slug: "normal-distribution-calculator",
  title: "Normal Distribution Calculator",
  description:
    "Free normal distribution calculator. Approximate cumulative probability P(Z ≤ z) for the standard normal distribution.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "normal distribution",
    "cumulative probability",
    "bell curve",
    "standard normal",
    "Gaussian",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Cumulative Probability P(Z ≤ z)",
      fields: [
        {
          name: "z",
          label: "Z-score",
          type: "number",
          placeholder: "e.g. 1.96",
        },
      ],
      calculate: (inputs) => {
        const z = inputs.z as number;
        if (z === undefined) return null;

        // Rational approximation for the cumulative standard normal
        const absZ = Math.abs(z);
        const t = 1 / (1 + 0.2316419 * absZ);
        const d = 0.3989422804014327; // 1/sqrt(2*pi)
        const poly =
          t *
          (0.3193815 +
            t *
              (-0.3565638 +
                t * (1.781478 + t * (-1.8212560 + t * 1.3302744))));
        const tail = d * Math.exp((-z * z) / 2) * poly;
        const prob = z >= 0 ? 1 - tail : tail;

        const complement = 1 - prob;

        return {
          primary: {
            label: "P(Z ≤ z)",
            value: formatNumber(prob, 6),
          },
          details: [
            { label: "Z-score", value: formatNumber(z, 4) },
            { label: "P(Z > z)", value: formatNumber(complement, 6) },
            { label: "Percentile", value: `${formatNumber(prob * 100, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "z-score-calculator",
    "confidence-interval-calculator",
    "chi-square-calculator",
  ],
  faq: [
    {
      question: "What is the standard normal distribution?",
      answer:
        "The standard normal distribution is a bell-shaped curve with a mean of 0 and standard deviation of 1. About 68% of values fall within ±1 SD, 95% within ±2 SD, and 99.7% within ±3 SD.",
    },
  ],
  formula: "P(Z ≤ z) using Abramowitz & Stegun rational approximation",
};
