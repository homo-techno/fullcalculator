import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelInsuranceCostCalculator: CalculatorDefinition = {
  slug: "travel-insurance-cost-calculator",
  title: "Travel Insurance Cost Calculator",
  description: "Free travel insurance cost calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["travel insurance cost calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Travel Insurance Cost",
      description: "Calculate travel insurance cost",
      fields: [
        {
          name: "distance",
          label: "Distance / Duration",
          type: "number",
          placeholder: "e.g. 500",
          min: 0,
        },
        {
          name: "speed",
          label: "Speed / Rate",
          type: "number",
          placeholder: "e.g. 60",
          min: 0,
          step: 0.1,
        },
        {
          name: "cost",
          label: "Cost per Unit",
          type: "number",
          placeholder: "e.g. 3",
          prefix: "$",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const d = inputs.distance as number;
        const s = inputs.speed as number;
        const c = inputs.cost as number || 0;
        if (!d) return null;
        const time = s ? d / s : d;
        const totalCost = d * c;
        return {
          primary: { label: "Result", value: s ? formatNumber(time) + " hours" : formatNumber(d) },
          details: [
            { label: "Distance", value: formatNumber(d) },
            { label: "Speed/Rate", value: formatNumber(s || 0) },
            { label: "Total cost", value: "$" + formatNumber(totalCost) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the travel insurance cost calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
