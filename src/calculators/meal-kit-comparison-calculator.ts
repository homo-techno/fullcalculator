import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealKitComparisonCalculator: CalculatorDefinition = {
  slug: "meal-kit-comparison-calculator",
  title: "Meal Kit Comparison Calculator",
  description: "Compare the cost per serving of meal kit delivery services against grocery shopping for home cooking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["meal kit cost", "meal kit comparison", "meal kit vs grocery cost"],
  variants: [{
    id: "standard",
    name: "Meal Kit Comparison",
    description: "Compare the cost per serving of meal kit delivery services against grocery shopping for home cooking",
    fields: [
      { name: "mealKitPerServing", label: "Meal Kit Cost Per Serving", type: "number", prefix: "$", min: 2, max: 25, step: 0.50, defaultValue: 9.99 },
      { name: "servingsPerWeek", label: "Servings Per Week", type: "number", min: 2, max: 30, defaultValue: 8 },
      { name: "groceryCostPerServing", label: "Grocery Cost Per Serving", type: "number", prefix: "$", min: 1, max: 15, step: 0.50, defaultValue: 4.50 },
      { name: "shippingPerWeek", label: "Weekly Shipping Cost", type: "number", prefix: "$", min: 0, max: 20, step: 1, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const kitCost = inputs.mealKitPerServing as number;
      const servings = inputs.servingsPerWeek as number;
      const groceryCost = inputs.groceryCostPerServing as number;
      const shipping = inputs.shippingPerWeek as number;
      if (!kitCost || !servings || !groceryCost || servings <= 0) return null;
      const weeklyKit = kitCost * servings + (shipping || 0);
      const weeklyGrocery = groceryCost * servings;
      const weeklyDiff = weeklyKit - weeklyGrocery;
      const annualKit = weeklyKit * 52;
      const annualGrocery = weeklyGrocery * 52;
      const annualDiff = annualKit - annualGrocery;
      const premiumPercent = groceryCost > 0 ? ((kitCost - groceryCost) / groceryCost) * 100 : 0;
      return {
        primary: { label: "Annual Cost Difference", value: "$" + formatNumber(Math.round(Math.abs(annualDiff))) + (annualDiff > 0 ? " more for meal kits" : " saved with meal kits") },
        details: [
          { label: "Weekly Meal Kit Cost", value: "$" + formatNumber(Math.round(weeklyKit * 100) / 100) },
          { label: "Weekly Grocery Cost", value: "$" + formatNumber(Math.round(weeklyGrocery * 100) / 100) },
          { label: "Meal Kit Premium", value: formatNumber(Math.round(premiumPercent)) + "% over grocery" },
        ],
      };
    },
  }],
  relatedSlugs: ["streaming-comparison-calculator", "real-hourly-wage-calculator"],
  faq: [
    { question: "Are meal kits cheaper than eating out?", answer: "Meal kits typically cost $8 to $12 per serving, which is less than most restaurant meals at $15 to $25 per person. However, meal kits cost about twice as much as cooking from scratch with grocery ingredients." },
    { question: "What are the hidden costs of meal kits?", answer: "Beyond the per-serving price, consider shipping fees, the cost of supplemental groceries not included in the kit, potential food waste from unused portions, and the environmental cost of excess packaging." },
  ],
  formula: "Annual Difference = (Meal Kit Per Serving x Servings x 52 + Shipping x 52) - (Grocery Per Serving x Servings x 52)",
};
