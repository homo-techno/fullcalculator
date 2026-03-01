import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogFoodCostCalculator: CalculatorDefinition = {
  slug: "dog-food-cost-calculator",
  title: "Dog Food Cost Calculator",
  description: "Estimate monthly and yearly dog food expenses based on dog size, food quality, and feeding schedule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dog food cost", "pet food budget", "dog feeding cost"],
  variants: [{
    id: "standard",
    name: "Dog Food Cost",
    description: "Estimate monthly and yearly dog food expenses based on dog size, food quality, and feeding schedule",
    fields: [
      { name: "dogWeight", label: "Dog Weight", type: "number", suffix: "lbs", min: 2, max: 250, defaultValue: 50 },
      { name: "foodQuality", label: "Food Quality", type: "select", options: [{value:"budget",label:"Budget"},{value:"midrange",label:"Mid-Range"},{value:"premium",label:"Premium"},{value:"raw",label:"Raw Diet"}], defaultValue: "midrange" },
      { name: "treatsPerDay", label: "Treats per Day", type: "number", min: 0, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const weight = inputs.dogWeight as number;
      const quality = inputs.foodQuality as string;
      const treats = inputs.treatsPerDay as number;
      if (!weight || weight <= 0) return null;
      const cupsPerDay = weight <= 20 ? 1 : weight <= 50 ? 2 : weight <= 80 ? 3 : 4;
      const costPerCup: Record<string, number> = { budget: 0.30, midrange: 0.60, premium: 1.10, raw: 2.00 };
      const dailyFood = cupsPerDay * (costPerCup[quality] || 0.60);
      const dailyTreats = treats * 0.25;
      const dailyTotal = dailyFood + dailyTreats;
      const monthly = dailyTotal * 30;
      const yearly = dailyTotal * 365;
      return {
        primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Daily Cost", value: "$" + dailyTotal.toFixed(2) },
          { label: "Yearly Cost", value: "$" + formatNumber(Math.round(yearly)) },
          { label: "Cups per Day", value: String(cupsPerDay) },
        ],
      };
    },
  }],
  relatedSlugs: ["cat-food-cost-calculator", "dog-exercise-calculator"],
  faq: [
    { question: "How much does it cost to feed a dog per month?", answer: "Monthly dog food costs range from $20-$60 for budget food to $80-$200 or more for premium or raw diets." },
    { question: "How much should I feed my dog?", answer: "Most dogs need about 1 cup per 20 lbs of body weight per day, but this varies by food brand and activity level." },
  ],
  formula: "Monthly Cost = (Cups per Day x Cost per Cup + Daily Treat Cost) x 30",
};
