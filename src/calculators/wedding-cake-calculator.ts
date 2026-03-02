import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingCakeCalculator: CalculatorDefinition = {
  slug: "wedding-cake-calculator",
  title: "Wedding Cake Calculator",
  description: "Calculate cake servings and cost by number of tiers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding cake","cake servings","cake tiers"],
  variants: [{
    id: "standard",
    name: "Wedding Cake",
    description: "Calculate cake servings and cost by number of tiers.",
    fields: [
      { name: "tiers", label: "Number of Tiers", type: "select", options: [{ value: "2", label: "2 Tiers" }, { value: "3", label: "3 Tiers" }, { value: "4", label: "4 Tiers" }, { value: "5", label: "5 Tiers" }], defaultValue: "3" },
      { name: "costPerSlice", label: "Cost per Slice ($)", type: "number", min: 2, max: 30, defaultValue: 8 },
      { name: "guests", label: "Guest Count", type: "number", min: 10, max: 500, defaultValue: 150 },
    ],
    calculate: (inputs) => {
      const tiers = parseInt(inputs.tiers as string);
      const costSlice = inputs.costPerSlice as number;
      const guests = inputs.guests as number;
      if (!tiers || !costSlice || !guests) return null;
      const servingsMap: Record<number, number> = { 2: 60, 3: 100, 4: 150, 5: 200 };
      const servings = servingsMap[tiers] || 100;
      const needed = Math.max(servings, guests);
      const total = needed * costSlice;
      return {
        primary: { label: "Cake Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Tiers", value: formatNumber(tiers) },
          { label: "Servings", value: formatNumber(needed) },
          { label: "Cost per Slice", value: "$" + formatNumber(costSlice) },
        ],
      };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","wedding-guest-calculator"],
  faq: [
    { question: "How many tiers for 150 guests?", answer: "A 3-tier cake typically serves 100 to 150 guests." },
    { question: "How much does a wedding cake cost?", answer: "Wedding cakes cost about $3 to $12 per slice on average." },
  ],
  formula: "Total Cost = Servings x Cost per Slice",
};
