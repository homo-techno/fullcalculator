import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petFoodCostCalculator: CalculatorDefinition = {
  slug: "pet-food-cost-calculator",
  title: "Pet Food Cost Calculator",
  description: "Estimate monthly pet food expenses based on weight and feeding.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pet food cost","dog food budget"],
  variants: [{
    id: "standard",
    name: "Pet Food Cost",
    description: "Estimate monthly pet food expenses based on weight and feeding.",
    fields: [
      { name: "weight", label: "Pet Weight (lbs)", type: "number", min: 1, max: 200, defaultValue: 40 },
      { name: "foodPricePerBag", label: "Price Per Bag ($)", type: "number", min: 1, max: 200, defaultValue: 45 },
      { name: "bagSize", label: "Bag Size (lbs)", type: "number", min: 1, max: 50, defaultValue: 30 },
      { name: "dailyFeeding", label: "Daily Feeding (cups)", type: "number", min: 0.25, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const weight = inputs.weight as number;
      const price = inputs.foodPricePerBag as number;
      const bagSize = inputs.bagSize as number;
      const cups = inputs.dailyFeeding as number;
      if (!weight || !price || !bagSize || !cups) return null;
      const lbsPerCup = 0.25;
      const dailyLbs = cups * lbsPerCup;
      const daysPerBag = bagSize / dailyLbs;
      const monthlyCost = (30 / daysPerBag) * price;
      const yearlyCost = monthlyCost * 12;
      return {
        primary: { label: "Monthly Food Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Days Per Bag", value: formatNumber(Math.round(daysPerBag)) },
          { label: "Daily Cost", value: "$" + formatNumber(Math.round((monthlyCost / 30) * 100) / 100) },
          { label: "Yearly Cost", value: "$" + formatNumber(Math.round(yearlyCost)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much food does a dog need daily?", answer: "Most dogs need about 1 cup per 20 lbs of body weight per day." },
    { question: "Is expensive dog food worth it?", answer: "Higher quality food can reduce vet bills and improve health long term." },
  ],
  formula: "Monthly Cost = (30 / Days Per Bag) x Price Per Bag",
};
