import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gayLussacLawCalculator: CalculatorDefinition = {
  slug: "gay-lussac-law-calculator",
  title: "Gay Lussac Law Calculator",
  description: "Free gay lussac law calculator. Calculate gay lussac law values for research and education.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gay lussac law calculator", "science calculator", "physics calculator", "chemistry calculator"],
  variants: [
    {
      id: "standard",
      name: "Gay Lussac Law",
      description: "Free gay lussac law calculator. Calculate gay lussac law values for research and",
      fields: [
        {
          name: "input1",
          label: "Input Value 1",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.001,
        },
        {
          name: "input2",
          label: "Input Value 2",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.001,
        },
        {
          name: "input3",
          label: "Input Value 3 (optional)",
          type: "number",
          placeholder: "Enter value",
          step: 0.001,
        }
      ],
      calculate: (inputs) => {
        const v1 = inputs.input1 as number;
        const v2 = inputs.input2 as number;
        const v3 = inputs.input3 as number || 1;
        if (!v1 || !v2) return null;
        const result = v1 * v2 * v3;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input 1", value: formatNumber(v1) },
            { label: "Input 2", value: formatNumber(v2) },
            { label: "Product", value: formatNumber(result) },
            { label: "Ratio (V1/V2)", value: formatNumber(v1 / v2) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "What is Gay Lussac Law?",
      answer: "Gay Lussac Law is a scientific concept. This calculator helps you compute related values for research, homework, or professional use.",
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator uses standard scientific formulas. For professional or research applications, verify results with appropriate scientific tools.",
    }
  ],
  formula: "Based on standard scientific formulas",
};
