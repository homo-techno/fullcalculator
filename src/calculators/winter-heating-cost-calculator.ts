import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const winterHeatingCostCalculator: CalculatorDefinition = {
  slug: "winter-heating-cost-calculator",
  title: "Winter Heating Cost Calculator",
  description: "Estimate your seasonal heating expenses based on home size, fuel type, and climate zone.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["winter heating cost", "heating bill estimate", "seasonal heating expense"],
  variants: [{
    id: "standard",
    name: "Winter Heating Cost",
    description: "Estimate your seasonal heating expenses based on home size, fuel type, and climate zone",
    fields: [
      { name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 },
      { name: "fuelType", label: "Fuel Type", type: "select", options: [{value:"gas",label:"Natural Gas"},{value:"electric",label:"Electric"},{value:"oil",label:"Heating Oil"},{value:"propane",label:"Propane"}], defaultValue: "gas" },
      { name: "climate", label: "Climate Zone", type: "select", options: [{value:"mild",label:"Mild (3000-4000 HDD)"},{value:"moderate",label:"Moderate (5000-6000 HDD)"},{value:"cold",label:"Cold (7000-8000 HDD)"},{value:"severe",label:"Severe (9000+ HDD)"}], defaultValue: "moderate" },
      { name: "insulation", label: "Insulation Quality", type: "select", options: [{value:"poor",label:"Poor/Old"},{value:"average",label:"Average"},{value:"good",label:"Good/New"},{value:"excellent",label:"Excellent/Upgraded"}], defaultValue: "average" },
    ],
    calculate: (inputs) => {
      const size = inputs.homeSize as number;
      const fuel = inputs.fuelType as string;
      const climate = inputs.climate as string;
      const insulation = inputs.insulation as string;
      if (!size || size <= 0) return null;
      const baseCostPerSqFt: Record<string, number> = { gas: 0.45, electric: 0.65, oil: 0.55, propane: 0.60 };
      const climateMult: Record<string, number> = { mild: 0.6, moderate: 1.0, cold: 1.5, severe: 2.0 };
      const insulationMult: Record<string, number> = { poor: 1.4, average: 1.0, good: 0.75, excellent: 0.55 };
      const base = size * (baseCostPerSqFt[fuel] || 0.45);
      const seasonal = Math.round(base * (climateMult[climate] || 1.0) * (insulationMult[insulation] || 1.0));
      const monthly = Math.round(seasonal / 5);
      const daily = (seasonal / 150).toFixed(2);
      return {
        primary: { label: "Seasonal Heating Cost", value: "$" + formatNumber(seasonal) },
        details: [
          { label: "Average Monthly Cost", value: "$" + formatNumber(monthly) },
          { label: "Average Daily Cost", value: "$" + daily },
          { label: "Cost per Sq Ft", value: "$" + (seasonal / size).toFixed(2) },
        ],
      };
    },
  }],
  relatedSlugs: ["summer-cooling-cost-calculator", "snow-load-roof-calculator"],
  faq: [
    { question: "How much does it cost to heat a home in winter?", answer: "The average US household spends $500-$1,500 on winter heating. Costs vary greatly by climate zone, fuel type, and home insulation." },
    { question: "Which heating fuel is cheapest?", answer: "Natural gas is typically the least expensive heating fuel, followed by electric heat pumps. Heating oil and propane tend to cost more per BTU." },
  ],
  formula: "Seasonal Cost = Home Size x Fuel Rate x Climate Factor x Insulation Factor",
};
