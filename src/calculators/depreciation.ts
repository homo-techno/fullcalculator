import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const depreciationCalculator: CalculatorDefinition = {
  slug: "depreciation-calculator",
  title: "Depreciation Calculator",
  description:
    "Free depreciation calculator. Calculate straight-line and double-declining balance depreciation for assets and tax purposes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["depreciation", "straight-line", "double-declining", "asset", "accounting"],
  variants: [
    {
      id: "straightLine",
      name: "Straight-Line",
      fields: [
        { name: "cost", label: "Asset Cost ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "salvageValue", label: "Salvage Value ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "usefulLife", label: "Useful Life (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number;
        const salvageValue = inputs.salvageValue as number || 0;
        const usefulLife = inputs.usefulLife as number;

        if (!cost || !usefulLife) return null;

        const depreciableBase = cost - salvageValue;
        const annualDepreciation = depreciableBase / usefulLife;
        const monthlyDepreciation = annualDepreciation / 12;
        const depreciationRate = (annualDepreciation / cost) * 100;

        return {
          primary: { label: "Annual Depreciation", value: `$${formatNumber(annualDepreciation, 2)}` },
          details: [
            { label: "Monthly Depreciation", value: `$${formatNumber(monthlyDepreciation, 2)}` },
            { label: "Depreciable Base", value: `$${formatNumber(depreciableBase, 2)}` },
            { label: "Depreciation Rate", value: `${formatNumber(depreciationRate, 2)}%` },
            { label: "Total Depreciation", value: `$${formatNumber(depreciableBase, 2)}` },
            { label: "Book Value After Year 1", value: `$${formatNumber(cost - annualDepreciation, 2)}` },
            { label: "Book Value at End of Life", value: `$${formatNumber(salvageValue, 2)}` },
          ],
        };
      },
    },
    {
      id: "doubleDeclining",
      name: "Double-Declining Balance",
      fields: [
        { name: "cost", label: "Asset Cost ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "salvageValue", label: "Salvage Value ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "usefulLife", label: "Useful Life (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number;
        const salvageValue = inputs.salvageValue as number || 0;
        const usefulLife = inputs.usefulLife as number;

        if (!cost || !usefulLife) return null;

        const ddbRate = (2 / usefulLife);
        let bookValue = cost;
        const yearOneDepreciation = bookValue * ddbRate;

        // Calculate full schedule
        let totalDepreciation = 0;
        const schedule: number[] = [];
        for (let i = 0; i < usefulLife; i++) {
          let dep = bookValue * ddbRate;
          if (bookValue - dep < salvageValue) {
            dep = bookValue - salvageValue;
          }
          if (dep < 0) dep = 0;
          schedule.push(dep);
          totalDepreciation += dep;
          bookValue -= dep;
        }

        return {
          primary: { label: "Year 1 Depreciation", value: `$${formatNumber(schedule[0], 2)}` },
          details: [
            { label: "DDB Rate", value: `${formatNumber(ddbRate * 100, 2)}%` },
            { label: "Year 2 Depreciation", value: `$${formatNumber(schedule[1] || 0, 2)}` },
            { label: "Year 3 Depreciation", value: `$${formatNumber(schedule[2] || 0, 2)}` },
            { label: "Total Depreciation", value: `$${formatNumber(totalDepreciation, 2)}` },
            { label: "Final Book Value", value: `$${formatNumber(bookValue, 2)}` },
            { label: "Straight-Line Equivalent", value: `$${formatNumber((cost - salvageValue) / usefulLife, 2)}/yr` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cost-basis-calculator", "business-loan-calculator", "tax-bracket-calculator"],
  faq: [
    { question: "What is straight-line depreciation?", answer: "Straight-line depreciation spreads the cost of an asset evenly over its useful life. Annual depreciation = (Cost - Salvage Value) / Useful Life." },
    { question: "What is double-declining balance?", answer: "Double-declining balance is an accelerated depreciation method that applies twice the straight-line rate to the declining book value each year, resulting in higher depreciation in early years." },
  ],
  formula: "Straight-Line: (Cost - Salvage) / Life; Double-Declining: Book Value × (2 / Life)",
};
