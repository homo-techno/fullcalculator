import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rideshareVsCarCalculator: CalculatorDefinition = {
  slug: "rideshare-vs-car-calculator",
  title: "Rideshare Vs Car Calculator",
  description: "Free rideshare vs car calculator. Quickly calculate and plan your rideshare vs car needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rideshare vs car calculator", "calculator", "planning tool"],
  variants: [
    {
      id: "standard",
      name: "Rideshare Vs Car",
      description: "Free rideshare vs car calculator. Quickly calculate and plan your rideshare vs c",
      fields: [
        {
          name: "value1",
          label: "Primary Value",
          type: "number",
          placeholder: "Enter value",
          min: 0,
        },
        {
          name: "value2",
          label: "Secondary Value",
          type: "number",
          placeholder: "Enter value",
          min: 0,
        },
        {
          name: "multiplier",
          label: "Multiplier",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          step: 0.1,
          defaultValue: 1,
        }
      ],
      calculate: (inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        const mult = inputs.multiplier as number || 1;
        if (!v1) return null;
        const result = (v1 + (v2 || 0)) * mult;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input 1", value: formatNumber(v1) },
            { label: "Input 2", value: formatNumber(v2 || 0) },
            { label: "Multiplier", value: "x" + formatNumber(mult) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    {
      question: "How does the rideshare vs car work?",
      answer: "Enter your values and the calculator instantly shows you the results with a detailed breakdown.",
    },
    {
      question: "Can I customize the inputs?",
      answer: "Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.",
    }
  ],
  formula: "Based on input values and standard formulas",
};
