import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landValueCalculator: CalculatorDefinition = {
  slug: "land-value-calculator",
  title: "Land Value Calculator",
  description: "Free land value calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["land value calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Land Value",
      description: "Calculate land value",
      fields: [
        {
          name: "acres",
          label: "Acreage",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "acres",
          min: 0.01,
          step: 0.01,
        },
        {
          name: "pricePerAcre",
          label: "Price per Acre",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "$",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const a = inputs.acres as number;
        const p = inputs.pricePerAcre as number;
        if (!a || !p) return null;
        const total = a * p;
        return {
          primary: { label: "Land Value", value: "$" + formatNumber(total) },
          details: [
            { label: "Per acre", value: "$" + formatNumber(p) },
            { label: "Per sq ft", value: "$" + formatNumber(p / 43560) },
            { label: "Total sq ft", value: formatNumber(a * 43560) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the land value calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
