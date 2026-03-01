import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clothDiaperSavingsCalculator: CalculatorDefinition = {
  slug: "cloth-diaper-savings-calculator",
  title: "Cloth Diaper Savings Calculator",
  description: "Compare the total cost of cloth diapers versus disposable diapers over your diapering period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cloth diaper savings", "cloth vs disposable diapers", "reusable diaper cost"],
  variants: [{
    id: "standard",
    name: "Cloth Diaper Savings",
    description: "Compare the total cost of cloth diapers versus disposable diapers over your diapering period",
    fields: [
      { name: "months", label: "Months of Diapering", type: "number", suffix: "months", min: 6, max: 48, defaultValue: 30 },
      { name: "changesPerDay", label: "Diaper Changes per Day", type: "number", suffix: "changes", min: 4, max: 15, defaultValue: 8 },
      { name: "disposableCost", label: "Cost per Disposable Diaper", type: "number", prefix: "$", min: 0.05, max: 1, step: 0.01, defaultValue: 0.25 },
      { name: "clothSetCost", label: "Cloth Diaper Set Cost", type: "number", prefix: "$", min: 100, max: 2000, defaultValue: 400 },
    ],
    calculate: (inputs) => {
      const months = inputs.months as number;
      const changes = inputs.changesPerDay as number;
      const dispCost = inputs.disposableCost as number;
      const clothCost = inputs.clothSetCost as number;
      if (!months || !changes) return null;
      const totalDays = months * 30;
      const disposableTotal = totalDays * changes * dispCost;
      const laundryPerMonth = 20;
      const clothTotal = clothCost + (months * laundryPerMonth);
      const savings = disposableTotal - clothTotal;
      const diapersSaved = totalDays * changes;
      return {
        primary: { label: "Total Savings with Cloth", value: "$" + formatNumber(Math.round(savings * 100) / 100) },
        details: [
          { label: "Disposable Diaper Total Cost", value: "$" + formatNumber(Math.round(disposableTotal * 100) / 100) },
          { label: "Cloth Diaper Total Cost", value: "$" + formatNumber(Math.round(clothTotal * 100) / 100) },
          { label: "Disposable Diapers Avoided", value: formatNumber(diapersSaved) },
        ],
      };
    },
  }],
  relatedSlugs: ["zero-waste-savings-calculator", "led-conversion-savings-calculator"],
  faq: [
    { question: "How much do cloth diapers really save?", answer: "Most families save between $1,000 and $2,000 over the diapering period by switching to cloth, with even greater savings when reusing for additional children." },
    { question: "How many cloth diapers do I need?", answer: "A typical set of 24 to 36 cloth diapers is enough for one child, allowing you to wash every 2 to 3 days without running out." },
  ],
  formula: "Savings = (Days x Changes x Disposable Cost) - (Cloth Set Cost + Months x Laundry Cost)",
};
