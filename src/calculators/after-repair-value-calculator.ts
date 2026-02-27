import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const afterRepairValueCalculator: CalculatorDefinition = {
  slug: "after-repair-value-calculator",
  title: "After Repair Value Calculator",
  description: "Free after repair value calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["after repair value calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "After Repair Value",
      description: "Calculate after repair value",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          min: 0,
        },
        {
          name: "repairCost",
          label: "Repair Cost",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "profitMargin",
          label: "Desired Profit Margin",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "%",
          min: 0,
          max: 100,
          defaultValue: 20,
        }
      ],
      calculate: (inputs) => {
        const pp = inputs.purchasePrice as number;
        const rc = inputs.repairCost as number;
        const margin = (inputs.profitMargin as number) / 100;
        if (!pp || !rc) return null;
        const totalInvested = pp + rc;
        const arv = totalInvested / (1 - margin);
        const profit = arv - totalInvested;
        return {
          primary: { label: "After Repair Value", value: "$" + formatNumber(arv) },
          details: [
            { label: "Total invested", value: "$" + formatNumber(totalInvested) },
            { label: "Expected profit", value: "$" + formatNumber(profit) },
            { label: "ROI", value: formatNumber((profit / totalInvested) * 100) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the after repair value calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
