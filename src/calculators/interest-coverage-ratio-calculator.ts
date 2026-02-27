import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const interestCoverageRatioCalculator: CalculatorDefinition = {
  slug: "interest-coverage-ratio-calculator",
  title: "Interest Coverage Ratio Calculator",
  description: "Free interest coverage ratio calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["interest coverage ratio calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Interest Coverage Ratio",
      description: "Calculate interest coverage ratio",
      fields: [
        {
          name: "value1",
          label: "Primary Value",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "value2",
          label: "Secondary Value",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        if (!v1 || !v2) return null;
        const ratio = v1 / v2;
        const diff = v1 - v2;
        const pct = (diff / v2) * 100;
        return {
          primary: { label: "Result", value: formatNumber(ratio) + "x" },
          details: [
            { label: "Difference", value: "$" + formatNumber(diff) },
            { label: "Percentage", value: formatNumber(pct) + "%" },
            { label: "Inverse ratio", value: formatNumber(1/ratio) + "x" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the interest coverage ratio calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
