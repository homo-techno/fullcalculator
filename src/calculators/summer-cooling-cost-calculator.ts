import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const summerCoolingCostCalculator: CalculatorDefinition = {
  slug: "summer-cooling-cost-calculator",
  title: "Summer Cooling Cost Calculator",
  description: "Estimate your seasonal air conditioning expenses based on home size, efficiency, and climate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["summer cooling cost", "AC cost estimate", "air conditioning bill"],
  variants: [{
    id: "standard",
    name: "Summer Cooling Cost",
    description: "Estimate your seasonal air conditioning expenses based on home size, efficiency, and climate",
    fields: [
      { name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 },
      { name: "acType", label: "AC Type", type: "select", options: [{value:"central",label:"Central AC"},{value:"window",label:"Window Unit"},{value:"mini-split",label:"Mini-Split"},{value:"evaporative",label:"Evaporative Cooler"}], defaultValue: "central" },
      { name: "climate", label: "Climate Zone", type: "select", options: [{value:"mild",label:"Mild (500-1000 CDD)"},{value:"moderate",label:"Moderate (1500-2000 CDD)"},{value:"hot",label:"Hot (2500-3000 CDD)"},{value:"extreme",label:"Extreme (3500+ CDD)"}], defaultValue: "moderate" },
      { name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 },
    ],
    calculate: (inputs) => {
      const size = inputs.homeSize as number;
      const acType = inputs.acType as string;
      const climate = inputs.climate as string;
      const rate = inputs.electricRate as number;
      if (!size || !rate) return null;
      const kwhPerSqFt: Record<string, number> = { central: 1.5, window: 2.0, "mini-split": 1.2, evaporative: 0.5 };
      const climateMult: Record<string, number> = { mild: 0.5, moderate: 1.0, hot: 1.8, extreme: 2.5 };
      const kwh = size * (kwhPerSqFt[acType] || 1.5) * (climateMult[climate] || 1.0);
      const seasonal = Math.round(kwh * (rate / 100));
      const monthly = Math.round(seasonal / 4);
      const daily = (seasonal / 120).toFixed(2);
      return {
        primary: { label: "Seasonal Cooling Cost", value: "$" + formatNumber(seasonal) },
        details: [
          { label: "Average Monthly Cost", value: "$" + formatNumber(monthly) },
          { label: "Average Daily Cost", value: "$" + daily },
          { label: "Estimated kWh Used", value: formatNumber(Math.round(kwh)) },
        ],
      };
    },
  }],
  relatedSlugs: ["winter-heating-cost-calculator", "lawn-watering-cost-calculator"],
  faq: [
    { question: "How much does air conditioning cost per month?", answer: "Average AC costs range from $60-$200 per month depending on climate, home size, and system efficiency. Hot climates can see bills over $300." },
    { question: "Which AC type is most efficient?", answer: "Mini-split systems and modern central AC units with high SEER ratings are the most efficient. Evaporative coolers use less electricity but only work in dry climates." },
  ],
  formula: "Seasonal Cost = Home Size x kWh per Sq Ft x Climate Factor x Electric Rate",
};
