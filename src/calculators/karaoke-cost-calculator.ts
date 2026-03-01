import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const karaokeCostCalculator: CalculatorDefinition = {
  slug: "karaoke-cost-calculator",
  title: "Karaoke Night Cost Calculator",
  description: "Estimate the total cost of a karaoke night out including room rental, drinks, and food.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["karaoke cost", "karaoke night budget", "karaoke room price"],
  variants: [{
    id: "standard",
    name: "Karaoke Night Cost",
    description: "Estimate the total cost of a karaoke night out including room rental, drinks, and food",
    fields: [
      { name: "people", label: "Number of People", type: "number", suffix: "people", min: 2, max: 20, defaultValue: 6 },
      { name: "hours", label: "Room Hours", type: "number", suffix: "hours", min: 1, max: 6, defaultValue: 2 },
      { name: "roomRate", label: "Room Rate per Hour", type: "number", prefix: "$", min: 20, max: 200, defaultValue: 50 },
      { name: "drinksPerPerson", label: "Drinks and Food per Person", type: "number", prefix: "$", min: 0, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const hours = inputs.hours as number;
      const roomRate = inputs.roomRate as number;
      const drinks = inputs.drinksPerPerson as number;
      if (!people || !hours) return null;
      const roomCost = hours * roomRate;
      const drinksCost = people * drinks;
      const total = roomCost + drinksCost;
      const perPerson = total / people;
      return {
        primary: { label: "Total Karaoke Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Room Rental", value: "$" + formatNumber(Math.round(roomCost * 100) / 100) },
          { label: "Food and Drinks", value: "$" + formatNumber(Math.round(drinksCost * 100) / 100) },
          { label: "Per Person", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["bowling-cost-calculator", "escape-room-cost-calculator"],
  faq: [
    { question: "How much does a karaoke room cost?", answer: "Private karaoke rooms typically cost $30 to $80 per hour depending on location and room size. Many venues offer package deals for 2 or more hours." },
    { question: "How many people fit in a karaoke room?", answer: "Small rooms hold 4 to 8 people, medium rooms fit 8 to 15, and large rooms can accommodate 15 to 30 guests. Larger rooms cost more per hour." },
  ],
  formula: "Total = (Hours x Room Rate) + (People x Drinks per Person)",
};
