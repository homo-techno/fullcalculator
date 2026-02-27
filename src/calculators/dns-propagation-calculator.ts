import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dnsPropagationCalculator: CalculatorDefinition = {
  slug: "dns-propagation-calculator",
  title: "Dns Propagation Calculator",
  description: "Free dns propagation calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dns propagation calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Dns Propagation",
      description: "Calculate dns propagation",
      fields: [
        {
          name: "value",
          label: "Primary Value",
          type: "number",
          placeholder: "Enter value",
          min: 0,
        },
        {
          name: "factor",
          label: "Factor / Rate",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          step: 0.01,
          defaultValue: 1,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        const f = inputs.factor as number || 1;
        if (!v) return null;
        const result = v * f;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input", value: formatNumber(v) },
            { label: "Factor", value: "x" + formatNumber(f) },
            { label: "Hourly", value: formatNumber(result / 24) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the dns propagation calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
