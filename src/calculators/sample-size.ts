import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sampleSizeCalculator: CalculatorDefinition = {
  slug: "sample-size-calculator",
  title: "Sample Size Calculator",
  description:
    "Free sample size calculator. Determine the required sample size for surveys given a confidence level, margin of error, and estimated proportion.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "sample size",
    "survey calculator",
    "margin of error",
    "confidence level",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Sample Size",
      fields: [
        {
          name: "confidence",
          label: "Confidence Level (90, 95, or 99)",
          type: "number",
          placeholder: "e.g. 95",
        },
        {
          name: "margin",
          label: "Margin of Error (as decimal, e.g. 0.05)",
          type: "number",
          placeholder: "e.g. 0.05",
        },
        {
          name: "proportion",
          label: "Estimated Proportion (0–1)",
          type: "number",
          placeholder: "e.g. 0.5",
        },
      ],
      calculate: (inputs) => {
        const confidence = inputs.confidence as number;
        const margin = inputs.margin as number;
        const proportion = inputs.proportion as number;
        if (!confidence || !margin || proportion === undefined) return null;
        if (margin <= 0 || proportion < 0 || proportion > 1) return null;

        const zMap: Record<number, number> = {
          90: 1.645,
          95: 1.96,
          99: 2.576,
        };
        const z = zMap[confidence];
        if (!z) return null;

        const n = (z * z * proportion * (1 - proportion)) / (margin * margin);
        const rounded = Math.ceil(n);

        return {
          primary: { label: "Required Sample Size", value: String(rounded) },
          details: [
            { label: "Exact value", value: formatNumber(n, 2) },
            { label: "Z-value", value: String(z) },
            { label: "Margin of error", value: `${formatNumber(margin * 100, 2)}%` },
            { label: "Proportion", value: formatNumber(proportion, 4) },
            { label: "Confidence Level", value: `${confidence}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "confidence-interval-calculator",
    "z-score-calculator",
    "normal-distribution-calculator",
  ],
  faq: [
    {
      question: "Why is sample size important?",
      answer:
        "A sufficient sample size ensures your survey results are statistically meaningful. Too small a sample increases the margin of error and decreases the reliability of conclusions. The formula balances precision (smaller margin of error) with practicality (cost of gathering data).",
    },
  ],
  formula: "n = (z² × p × (1 - p)) / E²",
};
