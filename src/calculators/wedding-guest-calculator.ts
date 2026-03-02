import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingGuestCalculator: CalculatorDefinition = {
  slug: "wedding-guest-calculator",
  title: "Wedding Guest Calculator",
  description: "Estimate catering and seating needs from guest count.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding guests","wedding seating","wedding catering"],
  variants: [{
    id: "standard",
    name: "Wedding Guest",
    description: "Estimate catering and seating needs from guest count.",
    fields: [
      { name: "guests", label: "Guest Count", type: "number", min: 10, max: 1000, defaultValue: 150 },
      { name: "costPerHead", label: "Cost per Head ($)", type: "number", min: 10, max: 500, defaultValue: 75 },
      { name: "tables", label: "Seats per Table", type: "number", min: 4, max: 12, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const guests = inputs.guests as number;
      const cost = inputs.costPerHead as number;
      const seats = inputs.tables as number;
      if (!guests || !cost || !seats) return null;
      const totalCost = guests * cost;
      const tableCount = Math.ceil(guests / seats);
      return {
        primary: { label: "Total Catering Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Guest Count", value: formatNumber(guests) },
          { label: "Tables Needed", value: formatNumber(tableCount) },
          { label: "Cost per Head", value: "$" + formatNumber(cost) },
        ],
      };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","event-catering-calculator"],
  faq: [
    { question: "How many guests should I plan for?", answer: "Plan for about 80 percent of invited guests to attend." },
    { question: "How many seats per table at a wedding?", answer: "Round tables typically seat 8 to 10 guests each." },
  ],
  formula: "Total Cost = Guest Count x Cost per Head",
};
