import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyWaterSupplyCalculator: CalculatorDefinition = {
  slug: "emergency-water-supply-calculator",
  title: "Emergency Water Supply Calculator",
  description: "Calculate water storage needed for emergency preparedness.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["emergency water","water storage calculator"],
  variants: [{
    id: "standard",
    name: "Emergency Water Supply",
    description: "Calculate water storage needed for emergency preparedness.",
    fields: [
      { name: "people", label: "Number of People", type: "number", min: 1, max: 50, defaultValue: 4 },
      { name: "days", label: "Days of Supply", type: "number", min: 1, max: 90, defaultValue: 14 },
      { name: "gallonsPerDay", label: "Gallons Per Person Per Day", type: "number", min: 0.5, max: 5, defaultValue: 1 },
      { name: "pets", label: "Number of Pets", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const days = inputs.days as number;
      const gpd = inputs.gallonsPerDay as number;
      const pets = inputs.pets as number;
      if (!people || !days || !gpd) return null;
      const humanWater = people * days * gpd;
      const petWater = pets * days * 0.5;
      const total = Math.round((humanWater + petWater) * 100) / 100;
      const liters = Math.round(total * 3.785 * 100) / 100;
      return {
        primary: { label: "Total Water Needed", value: formatNumber(total) + " gallons" },
        details: [
          { label: "Human Water", value: formatNumber(humanWater) + " gallons" },
          { label: "Pet Water", value: formatNumber(petWater) + " gallons" },
          { label: "In Liters", value: formatNumber(liters) + " L" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much water should I store per person?", answer: "Store at least one gallon per person per day for drinking and sanitation." },
    { question: "How long does stored water last?", answer: "Commercially bottled water lasts up to two years; rotate home-stored water every 6 months." },
  ],
  formula: "Total = (People x Days x Gal/Day) + (Pets x Days x 0.5)",
};
