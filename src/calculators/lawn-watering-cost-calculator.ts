import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawnWateringCostCalculator: CalculatorDefinition = {
  slug: "lawn-watering-cost-calculator",
  title: "Lawn Watering Cost Calculator",
  description: "Calculate your lawn irrigation water usage and cost based on lawn size, climate, and watering schedule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lawn watering cost", "irrigation cost", "lawn water usage"],
  variants: [{
    id: "standard",
    name: "Lawn Watering Cost",
    description: "Calculate your lawn irrigation water usage and cost based on lawn size, climate, and watering schedule",
    fields: [
      { name: "lawnSize", label: "Lawn Size", type: "number", suffix: "sq ft", min: 100, max: 100000, defaultValue: 5000 },
      { name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 },
      { name: "weeklyFreq", label: "Watering Days per Week", type: "number", min: 1, max: 7, defaultValue: 3 },
      { name: "climate", label: "Climate", type: "select", options: [{value:"cool",label:"Cool/Humid"},{value:"moderate",label:"Moderate"},{value:"warm",label:"Warm/Dry"},{value:"hot",label:"Hot/Arid"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const size = inputs.lawnSize as number;
      const rate = inputs.waterRate as number;
      const freq = inputs.weeklyFreq as number;
      const climate = inputs.climate as string;
      if (!size || !rate || !freq) return null;
      const inchesPerWeek: Record<string, number> = { cool: 0.75, moderate: 1.0, warm: 1.5, hot: 2.0 };
      const needed = inchesPerWeek[climate] || 1.0;
      const gallonsPerInchPerSqFt = 0.623;
      const weeklyGallons = Math.round(size * needed * gallonsPerInchPerSqFt);
      const monthlyGallons = weeklyGallons * 4.33;
      const monthlyCost = Math.round((monthlyGallons / 1000) * rate);
      const seasonalCost = monthlyCost * 5;
      return {
        primary: { label: "Monthly Water Cost", value: "$" + formatNumber(monthlyCost) },
        details: [
          { label: "Seasonal Cost (5 months)", value: "$" + formatNumber(seasonalCost) },
          { label: "Weekly Water Use", value: formatNumber(weeklyGallons) + " gallons" },
          { label: "Inches per Week Needed", value: needed.toFixed(2) + " inches" },
        ],
      };
    },
  }],
  relatedSlugs: ["summer-cooling-cost-calculator", "frost-date-calculator"],
  faq: [
    { question: "How much does it cost to water a lawn?", answer: "Lawn watering typically costs $20-$100 per month depending on lawn size, water rates, and climate. Hot arid regions cost significantly more." },
    { question: "How often should I water my lawn?", answer: "Most lawns need about 1 inch of water per week. It is better to water deeply 2-3 times per week rather than lightly every day." },
  ],
  formula: "Monthly Cost = (Lawn Size x Inches Needed x 0.623 gal/in/sqft x 4.33 weeks) / 1000 x Water Rate",
};
