import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainBarrelSavingsCalculator: CalculatorDefinition = {
  slug: "rain-barrel-savings-calculator",
  title: "Rain Barrel Savings Calculator",
  description: "Estimate water savings and cost reduction from rain barrels.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rain barrel savings","rainwater harvesting","water cost savings"],
  variants: [{
    id: "standard",
    name: "Rain Barrel Savings",
    description: "Estimate water savings and cost reduction from rain barrels.",
    fields: [
      { name: "roofSqFt", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 1500 },
      { name: "annualRainfall", label: "Annual Rainfall (in)", type: "number", min: 1, max: 100, defaultValue: 40 },
      { name: "barrels", label: "Number of Barrels", type: "number", min: 1, max: 20, defaultValue: 2 },
      { name: "waterRate", label: "Water Rate ($/1000 gal)", type: "number", min: 1, max: 30, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const roof = inputs.roofSqFt as number;
      const rain = inputs.annualRainfall as number;
      const barrels = inputs.barrels as number;
      const rate = inputs.waterRate as number;
      if (!roof || !rain || !barrels || !rate) return null;
      const gallonsPerYear = roof * rain * 0.623;
      const barrelCapacity = barrels * 55 * 52;
      const usable = Math.min(gallonsPerYear, barrelCapacity);
      const savings = (usable / 1000) * rate;
      return {
        primary: { label: "Annual Water Savings", value: formatNumber(Math.round(usable)) + " gallons" },
        details: [
          { label: "Annual Cost Savings", value: "$" + formatNumber(Math.round(savings)) },
          { label: "Total Roof Capture", value: formatNumber(Math.round(gallonsPerYear)) + " gal" },
          { label: "Barrel Capacity per Year", value: formatNumber(Math.round(barrelCapacity)) + " gal" },
        ],
      };
  },
  }],
  relatedSlugs: ["gutter-rain-calculator","water-usage-calculator"],
  faq: [
    { question: "How much water can a rain barrel collect?", answer: "A 55 gallon barrel can fill up in a single moderate rainstorm." },
    { question: "Are rain barrels worth the investment?", answer: "Yes, they can save $50 to $200 per year depending on water rates." },
  ],
  formula: "Gallons = Roof Area x Rainfall x 0.623",
};
