import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventBarCalculator: CalculatorDefinition = {
  slug: "event-bar-calculator",
  title: "Event Bar Calculator",
  description: "Estimate bar drink quantities per guest.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event bar","drinks per guest","bar estimate"],
  variants: [{
    id: "standard",
    name: "Event Bar",
    description: "Estimate bar drink quantities per guest.",
    fields: [
      { name: "guests", label: "Guest Count", type: "number", min: 10, max: 1000, defaultValue: 100 },
      { name: "hours", label: "Event Duration (hours)", type: "number", min: 1, max: 8, defaultValue: 4 },
      { name: "drinksPerHour", label: "Drinks per Guest per Hour", type: "number", min: 1, max: 3, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const guests = inputs.guests as number;
      const hours = inputs.hours as number;
      const dph = inputs.drinksPerHour as number;
      if (!guests || !hours || !dph) return null;
      const totalDrinks = guests * hours * dph;
      const wine = Math.ceil(totalDrinks * 0.4 / 5);
      const beer = Math.ceil(totalDrinks * 0.4);
      const liquor = Math.ceil(totalDrinks * 0.2 / 16);
      return {
        primary: { label: "Total Drinks", value: formatNumber(totalDrinks) },
        details: [
          { label: "Wine Bottles", value: formatNumber(wine) },
          { label: "Beer Units", value: formatNumber(beer) },
          { label: "Liquor Bottles", value: formatNumber(liquor) },
        ],
      };
  },
  }],
  relatedSlugs: ["event-catering-calculator","wedding-budget-calculator"],
  faq: [
    { question: "How many drinks per guest should I plan?", answer: "Plan about 2 drinks per guest for the first hour and 1 after." },
    { question: "How many bottles of wine for 100 guests?", answer: "About 30 to 40 bottles of wine for 100 guests over 4 hours." },
  ],
  formula: "Total Drinks = Guests x Hours x Drinks per Hour",
};
