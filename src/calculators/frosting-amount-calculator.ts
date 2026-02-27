import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frostingAmountCalculator: CalculatorDefinition = {
  slug: "frosting-amount-calculator",
  title: "Frosting Amount Calculator",
  description: "Free frosting amount calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["frosting amount calculator", "cooking calculator", "recipe calculator"],
  variants: [
    {
      id: "standard",
      name: "Frosting Amount",
      description: "Calculate frosting amount",
      fields: [
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          max: 500,
        },
        {
          name: "size",
          label: "Size per Serving",
          type: "number",
          placeholder: "e.g. 250",
          suffix: "g",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const servings = inputs.servings as number;
        const size = inputs.size as number;
        if (!servings || !size) return null;
        const total = servings * size;
        return {
          primary: { label: "Total Amount", value: formatNumber(total) + " g" },
          details: [
            { label: "Per serving", value: formatNumber(size) + " g" },
            { label: "In kg", value: formatNumber(total / 1000) + " kg" },
            { label: "In oz", value: formatNumber(total * 0.03527) + " oz" },
            { label: "In lbs", value: formatNumber(total * 0.002205) + " lbs" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tip-calculator", "percentage-calculator"],
  faq: [
    { question: "How does the frosting amount calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
