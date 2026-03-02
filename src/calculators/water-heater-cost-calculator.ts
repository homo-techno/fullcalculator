import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterHeaterCostCalculator: CalculatorDefinition = {
  slug: "water-heater-cost-calculator",
  title: "Water Heater Cost Calculator",
  description: "Estimate annual water heating energy cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["water heater cost","hot water cost"],
  variants: [{
    id: "standard",
    name: "Water Heater Cost",
    description: "Estimate annual water heating energy cost.",
    fields: [
      { name: "gallonsPerDay", label: "Gallons Per Day", type: "number", min: 10, max: 200, defaultValue: 50 },
      { name: "tempRise", label: "Temperature Rise (F)", type: "number", min: 20, max: 100, defaultValue: 60 },
      { name: "energyCost", label: "Energy Cost ($/kWh)", type: "number", min: 0.01, max: 1, defaultValue: 0.12 },
      { name: "efficiency", label: "Efficiency (%)", type: "number", min: 50, max: 99, defaultValue: 90 },
    ],
    calculate: (inputs) => {
      const gal = inputs.gallonsPerDay as number;
      const rise = inputs.tempRise as number;
      const rate = inputs.energyCost as number;
      const eff = inputs.efficiency as number;
      const btuPerDay = gal * 8.34 * rise;
      const kwhPerDay = btuPerDay / 3412 / (eff / 100);
      const annualCost = kwhPerDay * rate * 365;
      return {
        primary: { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        details: [
          { label: "Daily kWh", value: formatNumber(Math.round(kwhPerDay * 10) / 10) },
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(annualCost / 12)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much hot water does a household use?", answer: "An average household uses 40 to 60 gallons of hot water per day." },
    { question: "What temperature should I set my water heater?", answer: "Set your water heater to 120 degrees F for safety and efficiency." },
  ],
  formula: "Annual Cost = (Gallons x 8.34 x Rise / 3412 / Eff) x Rate x 365",
};
