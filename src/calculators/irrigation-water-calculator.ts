import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irrigationWaterCalculator: CalculatorDefinition = {
  slug: "irrigation-water-calculator",
  title: "Irrigation Water Calculator",
  description: "Estimate irrigation water needs for crops per acre.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["irrigation water","crop water calculator"],
  variants: [{
    id: "standard",
    name: "Irrigation Water",
    description: "Estimate irrigation water needs for crops per acre.",
    fields: [
      { name: "etRate", label: "ET Rate (inches/day)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.2 },
      { name: "rainfall", label: "Weekly Rainfall (inches)", type: "number", min: 0, max: 10, defaultValue: 0.5 },
      { name: "efficiency", label: "System Efficiency (%)", type: "number", min: 30, max: 100, defaultValue: 75 },
      { name: "acres", label: "Irrigated Acres", type: "number", min: 0.1, max: 10000, defaultValue: 80 },
    ],
    calculate: (inputs) => {
      const et = inputs.etRate as number;
      const rain = inputs.rainfall as number;
      const eff = inputs.efficiency as number;
      const ac = inputs.acres as number;
      if (!et || !eff || !ac) return null;
      const weeklyET = et * 7;
      const netNeed = Math.max(0, weeklyET - rain);
      const grossNeed = Math.round((netNeed / (eff / 100)) * 100) / 100;
      var gallonsPerAcre = Math.round(grossNeed * 27154);
      var totalGallons = Math.round(gallonsPerAcre * ac);
      return {
        primary: { label: "Weekly Irrigation Need", value: formatNumber(grossNeed) + " in/acre" },
        details: [
          { label: "Gallons Per Acre Per Week", value: formatNumber(gallonsPerAcre) },
          { label: "Total Gallons Per Week", value: formatNumber(totalGallons) },
          { label: "Net Crop Need", value: formatNumber(Math.round(netNeed * 100) / 100) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is ET rate?", answer: "ET is evapotranspiration, the rate at which a crop uses water through evaporation and transpiration." },
    { question: "What irrigation efficiency should I use?", answer: "Use 75% for sprinkler, 85% for center pivot, and 90% for drip irrigation." },
  ],
  formula: "Irrigation = (ET x 7 - Rainfall) / Efficiency",
};
