import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barInventoryCalculator: CalculatorDefinition = {
  slug: "bar-inventory-calculator",
  title: "Bar Inventory Calculator",
  description: "Calculate the value of bar liquor inventory.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bar inventory","liquor inventory calculator"],
  variants: [{
    id: "standard",
    name: "Bar Inventory",
    description: "Calculate the value of bar liquor inventory.",
    fields: [
      { name: "wellBottles", label: "Well/House Bottles", type: "number", min: 0, max: 200, defaultValue: 20 },
      { name: "wellCost", label: "Avg Well Bottle Cost ($)", type: "number", min: 5, max: 50, defaultValue: 15 },
      { name: "premiumBottles", label: "Premium Bottles", type: "number", min: 0, max: 200, defaultValue: 30 },
      { name: "premiumCost", label: "Avg Premium Bottle Cost ($)", type: "number", min: 15, max: 200, defaultValue: 35 },
      { name: "beerKegs", label: "Beer Kegs", type: "number", min: 0, max: 50, defaultValue: 6 },
      { name: "kegCost", label: "Avg Keg Cost ($)", type: "number", min: 50, max: 400, defaultValue: 150 },
    ],
    calculate: (inputs) => {
      const wb = inputs.wellBottles as number;
      const wc = inputs.wellCost as number;
      const pb = inputs.premiumBottles as number;
      const pc = inputs.premiumCost as number;
      const kegs = inputs.beerKegs as number;
      const kc = inputs.kegCost as number;
      const wellVal = wb * wc;
      const premVal = pb * pc;
      const kegVal = kegs * kc;
      const total = wellVal + premVal + kegVal;
      const pourCostTarget = Math.round(total * 4);
      return {
        primary: { label: "Total Inventory Value", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Well Liquor Value", value: "$" + formatNumber(Math.round(wellVal)) },
          { label: "Premium Liquor Value", value: "$" + formatNumber(Math.round(premVal)) },
          { label: "Beer Keg Value", value: "$" + formatNumber(Math.round(kegVal)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a good pour cost percentage?", answer: "A well-managed bar targets 18 to 24 percent pour cost for spirits." },
    { question: "How often should I count bar inventory?", answer: "Count inventory weekly for high-volume bars and biweekly for lower volume." },
  ],
  formula: "Total = (Well x Cost) + (Premium x Cost) + (Kegs x Cost)",
};
