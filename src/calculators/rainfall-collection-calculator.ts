import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainfallCollectionCalculator: CalculatorDefinition = {
  slug: "rainfall-collection-calculator",
  title: "Rainfall Collection Calculator",
  description: "Estimate how much rainwater you can collect from your roof based on catchment area, local rainfall, and collection efficiency.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rainfall collection","rainwater collection","roof catchment","water harvesting","rain barrel"],
  variants: [{
    id: "standard",
    name: "Rainfall Collection",
    description: "Estimate how much rainwater you can collect from your roof based on catchment area, local rainfall, and collection efficiency.",
    fields: [
      { name: "roofArea", label: "Roof Catchment Area (sq ft)", type: "number", min: 50, max: 10000, defaultValue: 1500 },
      { name: "annualRainfall", label: "Annual Rainfall (inches)", type: "number", min: 1, max: 120, defaultValue: 36 },
      { name: "efficiency", label: "Collection Efficiency (%)", type: "number", min: 50, max: 95, defaultValue: 80 },
    ],
    calculate: (inputs) => {
    const roofArea = inputs.roofArea as number;
    const annualRainfall = inputs.annualRainfall as number;
    const efficiency = inputs.efficiency as number;
    const gallonsPerInchPerSqFt = 0.623;
    const totalGallons = roofArea * annualRainfall * gallonsPerInchPerSqFt * (efficiency / 100);
    const monthlyGallons = totalGallons / 12;
    const liters = totalGallons * 3.785;
    const avgHouseholdDaily = 80;
    const daysSupply = totalGallons / avgHouseholdDaily;
    return {
      primary: { label: "Annual Collection", value: formatNumber(Math.round(totalGallons)) + " gallons" },
      details: [
        { label: "Monthly Average", value: formatNumber(Math.round(monthlyGallons)) + " gallons" },
        { label: "Annual Collection (Liters)", value: formatNumber(Math.round(liters)) + " L" },
        { label: "Days of Household Supply", value: formatNumber(Math.round(daysSupply)) + " days" },
        { label: "Efficiency Loss", value: formatNumber(Math.round(totalGallons / (efficiency / 100) - totalGallons)) + " gallons" }
      ]
    };
  },
  }],
  relatedSlugs: ["rainwater-harvesting-calculator","solar-panel-savings-calculator","carbon-footprint-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Annual Gallons = Roof Area x Annual Rainfall x 0.623 x (Efficiency / 100)
Monthly = Annual / 12",
};
