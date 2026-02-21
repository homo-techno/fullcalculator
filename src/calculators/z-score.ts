import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const zScoreCalculator: CalculatorDefinition = {
  slug: "z-score-calculator",
  title: "Z-Score Calculator",
  description:
    "Free Z-score calculator. Calculate z-scores, find probabilities, and convert between raw scores and standard scores.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "z-score calculator",
    "standard score",
    "z value",
    "normal distribution",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Z-Score",
      fields: [
        { name: "x", label: "Value (x)", type: "number", placeholder: "e.g. 85" },
        { name: "mean", label: "Mean (μ)", type: "number", placeholder: "e.g. 100" },
        {
          name: "stddev",
          label: "Standard Deviation (σ)",
          type: "number",
          placeholder: "e.g. 15",
        },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const mean = inputs.mean as number;
        const stddev = inputs.stddev as number;
        if (x === undefined || mean === undefined || !stddev) return null;

        const z = (x - mean) / stddev;

        // Approximate percentile using rational approximation of Φ(z)
        const absZ = Math.abs(z);
        const t = 1 / (1 + 0.2316419 * absZ);
        const d = 0.3989422804014327;
        const p =
          d *
          Math.exp((-z * z) / 2) *
          (t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744)))));
        const percentile = z >= 0 ? (1 - p) * 100 : p * 100;

        return {
          primary: { label: "Z-Score", value: formatNumber(z, 4) },
          details: [
            { label: "Value", value: String(x) },
            { label: "Mean", value: String(mean) },
            { label: "Std deviation", value: String(stddev) },
            { label: "Approx. percentile", value: `${formatNumber(percentile, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "normal-distribution-calculator",
    "confidence-interval-calculator",
    "variance-calculator",
  ],
  faq: [
    {
      question: "What is a z-score?",
      answer:
        "A z-score measures how many standard deviations a data point is from the mean. Z=0 is the mean, Z=1 is one SD above, Z=-1 is one SD below.",
    },
  ],
  formula: "z = (x - μ) / σ",
};
