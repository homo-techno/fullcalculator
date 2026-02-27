import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealPlanningCalculator: CalculatorDefinition = {
  slug: "meal-planning-calculator",
  title: "Meal Planning Calculator",
  description: "Free meal planning calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["meal planning calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Meal Planning",
      description: "Calculate meal planning",
      fields: [
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "rate",
          label: "Rate / Factor",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const a = inputs.amount as number;
        const r = inputs.rate as number || 1;
        if (!a) return null;
        const result = a * r;
        return {
          primary: { label: "Result", value: formatNumber(result) },
          details: [
            { label: "Input", value: formatNumber(a) },
            { label: "Factor", value: "x" + formatNumber(r) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the meal planning calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
