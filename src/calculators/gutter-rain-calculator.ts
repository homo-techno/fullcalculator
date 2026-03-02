import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterRainCalculator: CalculatorDefinition = {
  slug: "gutter-rain-calculator",
  title: "Gutter Rain Calculator",
  description: "Estimate rainwater volume collected from your roof gutters.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gutter rainwater","roof runoff","rain collection"],
  variants: [{
    id: "standard",
    name: "Gutter Rain",
    description: "Estimate rainwater volume collected from your roof gutters.",
    fields: [
      { name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 2000 },
      { name: "rainfall", label: "Rainfall (inches)", type: "number", min: 0.1, max: 20, defaultValue: 1 },
      { name: "efficiency", label: "Collection Efficiency (%)", type: "number", min: 50, max: 100, defaultValue: 85 },
    ],
    calculate: (inputs) => {
      const area = inputs.roofArea as number;
      const rain = inputs.rainfall as number;
      const eff = inputs.efficiency as number;
      if (!area || !rain || !eff) return null;
      const totalGallons = area * rain * 0.623;
      const collected = totalGallons * (eff / 100);
      const liters = collected * 3.785;
      return {
        primary: { label: "Water Collected", value: formatNumber(Math.round(collected)) + " gallons" },
        details: [
          { label: "Total Runoff", value: formatNumber(Math.round(totalGallons)) + " gallons" },
          { label: "Liters", value: formatNumber(Math.round(liters)) },
          { label: "Cubic Feet", value: formatNumber(Math.round(collected / 7.48)) },
        ],
      };
  },
  }],
  relatedSlugs: ["rain-barrel-savings-calculator","french-drain-gravel-calculator"],
  faq: [
    { question: "How much rain can a roof collect?", answer: "A 2,000 sq ft roof collects about 1,246 gallons per inch of rain." },
    { question: "What affects rainwater collection efficiency?", answer: "Roof material, slope, gutter condition, and debris all affect efficiency." },
  ],
  formula: "Gallons = Roof Area x Rainfall x 0.623 x Efficiency",
};
