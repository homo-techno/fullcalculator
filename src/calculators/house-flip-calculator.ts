import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const houseFlipCalculator: CalculatorDefinition = {
  slug: "house-flip-calculator",
  title: "House Flip Calculator",
  description: "Free house flip calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["house flip calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "House Flip",
      description: "Calculate house flip",
      fields: [
        {
          name: "purchase",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rehab",
          label: "Rehab Cost",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
          min: 0,
        },
        {
          name: "holding",
          label: "Holding Costs",
          type: "number",
          placeholder: "e.g. 8000",
          prefix: "$",
          min: 0,
        },
        {
          name: "selling",
          label: "Selling Costs (%)",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "%",
          min: 0,
          max: 20,
          defaultValue: 8,
        },
        {
          name: "arv",
          label: "After Repair Value",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const pp = inputs.purchase as number;
        const rehab = inputs.rehab as number;
        const hold = inputs.holding as number || 0;
        const sellPct = (inputs.selling as number) / 100;
        const arv = inputs.arv as number;
        if (!pp || !rehab || !arv) return null;
        const sellCosts = arv * sellPct;
        const totalCost = pp + rehab + hold + sellCosts;
        const profit = arv - totalCost;
        const roi = (profit / (pp + rehab + hold)) * 100;
        return {
          primary: { label: "Net Profit", value: "$" + formatNumber(profit) },
          details: [
            { label: "Total costs", value: "$" + formatNumber(totalCost) },
            { label: "Selling costs", value: "$" + formatNumber(sellCosts) },
            { label: "ROI", value: formatNumber(roi) + "%" },
            { label: "Profit margin", value: formatNumber((profit/arv)*100) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the house flip calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
