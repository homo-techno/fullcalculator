import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodWasteCostCalculator: CalculatorDefinition = {
  slug: "food-waste-cost-calculator",
  title: "Food Waste Cost Calculator",
  description: "Estimate the cost of food waste in a restaurant.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["food waste cost","restaurant waste calculator"],
  variants: [{
    id: "standard",
    name: "Food Waste Cost",
    description: "Estimate the cost of food waste in a restaurant.",
    fields: [
      { name: "dailyCovers", label: "Daily Covers (Meals)", type: "number", min: 10, max: 2000, defaultValue: 150 },
      { name: "avgFoodCost", label: "Avg Food Cost Per Meal ($)", type: "number", min: 2, max: 50, defaultValue: 8 },
      { name: "wastePct", label: "Waste Percentage (%)", type: "number", min: 1, max: 30, defaultValue: 8 },
      { name: "daysOpen", label: "Days Open Per Year", type: "number", min: 100, max: 365, defaultValue: 312 },
    ],
    calculate: (inputs) => {
      const covers = inputs.dailyCovers as number;
      const foodCost = inputs.avgFoodCost as number;
      const waste = inputs.wastePct as number;
      const days = inputs.daysOpen as number;
      if (!covers || !foodCost || !waste || !days) return null;
      const dailyFoodSpend = covers * foodCost;
      const dailyWaste = Math.round(dailyFoodSpend * (waste / 100) * 100) / 100;
      const annualWaste = Math.round(dailyWaste * days);
      const monthlyWaste = Math.round(annualWaste / 12);
      return {
        primary: { label: "Annual Waste Cost", value: "$" + formatNumber(annualWaste) },
        details: [
          { label: "Daily Waste Cost", value: "$" + formatNumber(dailyWaste) },
          { label: "Monthly Waste Cost", value: "$" + formatNumber(monthlyWaste) },
          { label: "Daily Food Spend", value: "$" + formatNumber(Math.round(dailyFoodSpend)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the average food waste percentage in restaurants?", answer: "Restaurants waste 4 to 10 percent of purchased food on average." },
    { question: "How can I reduce food waste?", answer: "Track waste daily, use FIFO rotation, adjust portion sizes, and cross-use ingredients." },
  ],
  formula: "Annual Waste = Daily Covers x Food Cost x Waste% x Days",
};
