import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creditCardRewardsCalculator: CalculatorDefinition = {
  slug: "credit-card-rewards-calculator",
  title: "Credit Card Rewards Calculator",
  description: "Free credit card rewards calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["credit card rewards calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Credit Card Rewards",
      description: "Calculate credit card rewards",
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
    { question: "How does the credit card rewards calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
