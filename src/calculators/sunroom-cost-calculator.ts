import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sunroomCostCalculator: CalculatorDefinition = {
  slug: "sunroom-cost-calculator",
  title: "Sunroom Cost Calculator",
  description: "Estimate the cost of adding a sunroom to your home based on size, type, and materials.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sunroom cost", "sunroom addition cost", "four season room cost"],
  variants: [{
    id: "standard",
    name: "Sunroom Cost",
    description: "Estimate the cost of adding a sunroom to your home based on size, type, and materials",
    fields: [
      { name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 50, max: 1000, defaultValue: 200 },
      { name: "type", label: "Sunroom Type", type: "select", options: [{value:"3season",label:"3-Season"},{value:"4season",label:"4-Season"},{value:"solarium",label:"Solarium"}], defaultValue: "3season" },
      { name: "foundation", label: "Foundation Type", type: "select", options: [{value:"slab",label:"Concrete Slab"},{value:"pier",label:"Pier & Beam"},{value:"deck",label:"Existing Deck"}], defaultValue: "slab" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const type = inputs.type as string;
      const found = inputs.foundation as string;
      if (!sqft || sqft <= 0) return null;
      const rates: Record<string, number> = { "3season": 150, "4season": 250, "solarium": 350 };
      const foundCost: Record<string, number> = { slab: 15, pier: 20, deck: 5 };
      const base = sqft * (rates[type] || 200);
      const fCost = sqft * (foundCost[found] || 15);
      const permits = 1500;
      const total = base + fCost + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction", value: "$" + formatNumber(base) },
          { label: "Foundation", value: "$" + formatNumber(fCost) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Cost per sq ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    },
  }],
  relatedSlugs: ["screened-porch-calculator", "pergola-cost-calculator"],
  faq: [
    { question: "How much does a sunroom cost?", answer: "A 3-season sunroom costs $100-200 per sq ft, while a 4-season room costs $200-400 per sq ft." },
    { question: "Does a sunroom add home value?", answer: "Yes, sunrooms typically return 50-80% of their cost in added home value." },
  ],
  formula: "Total = (Sq Ft x Rate per Type) + Foundation Cost + Permits",
};
