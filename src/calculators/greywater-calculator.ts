import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greywaterCalculator: CalculatorDefinition = {
  slug: "greywater-calculator",
  title: "Greywater Calculator",
  description: "Free greywater calculator. Get instant results with our easy-to-use calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["greywater calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Greywater",
      description: "Calculate greywater",
      fields: [
        {
          name: "input1",
          label: "Primary Input",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.01,
        },
        {
          name: "input2",
          label: "Secondary Input",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v1 = inputs.input1 as number;
        const v2 = inputs.input2 as number;
        if (!v1) return null;
        const result = v1 * (v2 || 1);
        const log10 = v1 > 0 ? Math.log10(v1) : 0;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Log scale", value: formatNumber(log10) },
            { label: "Squared", value: formatNumber(v1 * v1) },
            { label: "Square root", value: formatNumber(Math.sqrt(v1)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the greywater calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
