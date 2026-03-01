import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const markupVsMarginCalculator: CalculatorDefinition = {
  slug: "markup-vs-margin-calculator",
  title: "Markup vs Margin Calculator",
  description: "Convert between markup percentage and profit margin to understand the true profitability of products or services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["markup to margin","margin vs markup","markup calculator"],
  variants: [{
    id: "standard",
    name: "Markup vs Margin",
    description: "Convert between markup percentage and profit margin to understand the true profitability of products or services.",
    fields: [
      { name: "cost", label: "Cost Price", type: "number", prefix: "$", min: 0.01, max: 1000000, defaultValue: 60 },
      { name: "sellingPrice", label: "Selling Price", type: "number", prefix: "$", min: 0.01, max: 10000000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const cost = inputs.cost as number;
      const selling = inputs.sellingPrice as number;
      if (!cost || !selling || cost <= 0 || selling <= 0) return null;
      const profit = selling - cost;
      const markupPercent = (profit / cost) * 100;
      const marginPercent = (profit / selling) * 100;
      return {
        primary: { label: "Profit Margin", value: formatNumber(Math.round(marginPercent * 100) / 100) + "%" },
        details: [
          { label: "Markup Percentage", value: formatNumber(Math.round(markupPercent * 100) / 100) + "%" },
          { label: "Profit Per Unit", value: "$" + formatNumber(Math.round(profit * 100) / 100) },
          { label: "Cost Price", value: "$" + formatNumber(Math.round(cost * 100) / 100) },
          { label: "Selling Price", value: "$" + formatNumber(Math.round(selling * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["break-even-analysis-calculator","freelance-rate-calculator"],
  faq: [
    { question: "What is the difference between markup and margin?", answer: "Markup is the percentage added to cost to get the selling price (based on cost). Margin is the percentage of the selling price that is profit (based on revenue). A 100% markup equals a 50% margin." },
    { question: "Which should I use for pricing decisions?", answer: "Margin is more commonly used in financial analysis because it shows what portion of revenue is profit. Markup is more intuitive when setting prices from a known cost basis." },
  ],
  formula: "Markup = (Selling Price - Cost) / Cost x 100; Margin = (Selling Price - Cost) / Selling Price x 100",
};
