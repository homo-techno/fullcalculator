import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const youngsModulusCalculator: CalculatorDefinition = {
  slug: "youngs-modulus-calculator",
  title: "Youngs Modulus Calculator",
  description: "Free youngs modulus calculator. Get instant results with our easy-to-use calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["youngs modulus calculator", "physics calculator", "science tool"],
  variants: [
    {
      id: "standard",
      name: "Youngs Modulus",
      description: "Calculate youngs modulus",
      fields: [
        {
          name: "v1",
          label: "Value 1",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.001,
        },
        {
          name: "v2",
          label: "Value 2",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.001,
        },
        {
          name: "v3",
          label: "Value 3 (optional)",
          type: "number",
          placeholder: "Enter value",
          step: 0.001,
        }
      ],
      calculate: (inputs) => {
        const a = inputs.v1 as number;
        const b = inputs.v2 as number;
        const c = inputs.v3 as number || 1;
        if (!a || !b) return null;
        const result = a * b / c;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "V1 x V2", value: formatNumber(a * b) },
            { label: "V1 / V2", value: formatNumber(a / b) },
            { label: "sqrt(V1^2 + V2^2)", value: formatNumber(Math.sqrt(a*a + b*b)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "acceleration-calculator"],
  faq: [
    { question: "How does the youngs modulus calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
