import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const profitMarginPerUnitCalculator: CalculatorDefinition = {
  slug: "profit-margin-per-unit-calculator",
  title: "Profit Margin Per Unit Calculator",
  description: "Calculate per-unit profit margin from price and cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["per unit profit","unit profit margin"],
  variants: [{
    id: "standard",
    name: "Profit Margin Per Unit",
    description: "Calculate per-unit profit margin from price and cost.",
    fields: [
      { name: "sellingPrice", label: "Selling Price ($)", type: "number", min: 0.01, max: 1000000, defaultValue: 25 },
      { name: "costPrice", label: "Cost Price ($)", type: "number", min: 0.01, max: 1000000, defaultValue: 10 },
      { name: "quantity", label: "Quantity", type: "number", min: 1, max: 10000000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const sell = inputs.sellingPrice as number;
      const cost = inputs.costPrice as number;
      const qty = inputs.quantity as number;
      if (!sell || !cost || !qty) return null;
      const profitPerUnit = sell - cost;
      const marginPct = (profitPerUnit / sell) * 100;
      const totalProfit = profitPerUnit * qty;
      return {
        primary: { label: "Profit Per Unit", value: "$" + formatNumber(Math.round(profitPerUnit * 100) / 100) },
        details: [
          { label: "Margin", value: marginPct.toFixed(1) + "%" },
          { label: "Total Profit", value: "$" + formatNumber(Math.round(totalProfit * 100) / 100) },
          { label: "Total Revenue", value: "$" + formatNumber(Math.round(sell * qty * 100) / 100) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a good profit margin?", answer: "It varies by industry but 10-20% net margin is generally healthy." },
    { question: "Is markup the same as margin?", answer: "No. Markup is based on cost, margin is based on selling price." },
  ],
  formula: "Profit Per Unit = Selling Price - Cost Price",
};
