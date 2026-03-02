import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingFlowerCalculator: CalculatorDefinition = {
  slug: "wedding-flower-calculator",
  title: "Wedding Flower Calculator",
  description: "Estimate floral arrangement costs for a wedding.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding flowers","floral cost","wedding bouquet"],
  variants: [{
    id: "standard",
    name: "Wedding Flower",
    description: "Estimate floral arrangement costs for a wedding.",
    fields: [
      { name: "bouquets", label: "Bouquets", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "bouquetCost", label: "Cost per Bouquet ($)", type: "number", min: 20, max: 500, defaultValue: 150 },
      { name: "centerpieces", label: "Centerpieces", type: "number", min: 0, max: 50, defaultValue: 15 },
      { name: "centerpieceCost", label: "Cost per Centerpiece ($)", type: "number", min: 20, max: 300, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const bq = inputs.bouquets as number;
      const bqCost = inputs.bouquetCost as number;
      const cp = inputs.centerpieces as number;
      const cpCost = inputs.centerpieceCost as number;
      const bouquetTotal = bq * bqCost;
      const cpTotal = cp * cpCost;
      const total = bouquetTotal + cpTotal;
      return {
        primary: { label: "Total Floral Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Bouquets Cost", value: "$" + formatNumber(bouquetTotal) },
          { label: "Centerpieces Cost", value: "$" + formatNumber(cpTotal) },
          { label: "Total Arrangements", value: formatNumber(bq + cp) },
        ],
      };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","wedding-cake-calculator"],
  faq: [
    { question: "How much do wedding flowers cost?", answer: "Wedding flowers typically cost $1,500 to $5,000 total." },
    { question: "How many centerpieces do I need?", answer: "You need one centerpiece per guest table." },
  ],
  formula: "Total = (Bouquets x Cost) + (Centerpieces x Cost)",
};
