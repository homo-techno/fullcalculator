import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealPrepCostCalculator: CalculatorDefinition = {
  slug: "meal-prep-cost-calculator",
  title: "Meal Prep Cost Per Serving Calculator",
  description:
    "Free meal prep cost calculator. Calculate the cost per serving for your meal prep recipes, compare with eating out, and plan your weekly budget.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "meal prep cost",
    "cost per serving",
    "meal prep calculator",
    "food cost calculator",
    "meal prep budget",
    "weekly meal cost",
  ],
  variants: [
    {
      id: "single-recipe",
      name: "Single Recipe Cost",
      description:
        "Calculate cost per serving for a single meal prep recipe",
      fields: [
        {
          name: "totalCost",
          label: "Total Ingredient Cost ($)",
          type: "number",
          placeholder: "e.g. 25.00",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          step: 1,
        },
        {
          name: "mealOutCost",
          label: "Comparable Restaurant Meal ($)",
          type: "number",
          placeholder: "e.g. 12.00",
          prefix: "$",
          min: 0,
          step: 0.01,
          defaultValue: 12,
        },
      ],
      calculate: (inputs) => {
        const totalCost = parseFloat(inputs.totalCost as string);
        const servings = parseFloat(inputs.servings as string);
        const mealOutCost = parseFloat(inputs.mealOutCost as string);
        if (!totalCost || totalCost < 0 || !servings || servings <= 0) return null;

        const costPerServing = totalCost / servings;
        const savingsPerMeal = (mealOutCost || 12) - costPerServing;
        const savingsPercent = mealOutCost > 0 ? (savingsPerMeal / mealOutCost) * 100 : 0;
        const totalSavings = savingsPerMeal * servings;

        return {
          primary: {
            label: "Cost Per Serving",
            value: `$${formatNumber(costPerServing, 2)}`,
          },
          details: [
            { label: "Total Recipe Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Number of Servings", value: formatNumber(servings) },
            { label: "Cost Per Serving", value: `$${formatNumber(costPerServing, 2)}` },
            { label: "Savings vs Eating Out", value: `$${formatNumber(savingsPerMeal, 2)} per meal (${formatNumber(savingsPercent, 0)}%)` },
            { label: "Total Savings (all servings)", value: `$${formatNumber(totalSavings, 2)}` },
          ],
        };
      },
    },
    {
      id: "weekly",
      name: "Weekly Meal Prep Budget",
      description: "Calculate your weekly meal prep cost and savings",
      fields: [
        {
          name: "mealsPerDay",
          label: "Meals Prepped Per Day",
          type: "select",
          options: [
            { label: "1 meal/day (lunch only)", value: "1" },
            { label: "2 meals/day (lunch + dinner)", value: "2" },
            { label: "3 meals/day (all meals)", value: "3" },
          ],
          defaultValue: "2",
        },
        {
          name: "days",
          label: "Days Per Week",
          type: "select",
          options: [
            { label: "5 days (weekdays)", value: "5" },
            { label: "6 days", value: "6" },
            { label: "7 days", value: "7" },
          ],
          defaultValue: "5",
        },
        {
          name: "avgCostPerServing",
          label: "Avg Cost Per Serving ($)",
          type: "number",
          placeholder: "e.g. 3.50",
          prefix: "$",
          min: 0,
          step: 0.25,
          defaultValue: 3.5,
        },
        {
          name: "avgRestaurantCost",
          label: "Avg Restaurant/Takeout Meal ($)",
          type: "number",
          placeholder: "e.g. 14.00",
          prefix: "$",
          min: 0,
          step: 0.5,
          defaultValue: 14,
        },
      ],
      calculate: (inputs) => {
        const mealsPerDay = parseFloat(inputs.mealsPerDay as string);
        const days = parseFloat(inputs.days as string);
        const avgCost = parseFloat(inputs.avgCostPerServing as string);
        const avgRestaurant = parseFloat(inputs.avgRestaurantCost as string);
        if (!mealsPerDay || !days || !avgCost) return null;

        const totalMeals = mealsPerDay * days;
        const weeklyCost = totalMeals * avgCost;
        const weeklyEatOut = totalMeals * (avgRestaurant || 14);
        const weeklySavings = weeklyEatOut - weeklyCost;
        const monthlySavings = weeklySavings * 4.33;
        const yearlySavings = weeklySavings * 52;

        return {
          primary: {
            label: "Weekly Meal Prep Cost",
            value: `$${formatNumber(weeklyCost, 2)}`,
          },
          details: [
            { label: "Total Meals/Week", value: formatNumber(totalMeals) },
            { label: "Weekly Prep Cost", value: `$${formatNumber(weeklyCost, 2)}` },
            { label: "Weekly Eating Out Cost", value: `$${formatNumber(weeklyEatOut, 2)}` },
            { label: "Weekly Savings", value: `$${formatNumber(weeklySavings, 2)}` },
            { label: "Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "Yearly Savings", value: `$${formatNumber(yearlySavings, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "food-cost-per-serving-calculator",
    "freezer-meal-calculator",
    "cooking-converter",
  ],
  faq: [
    {
      question: "How much does meal prepping save compared to eating out?",
      answer:
        "On average, meal prepping costs $3-5 per serving compared to $12-18 for a restaurant meal. That translates to $50-100+ per week in savings, or $2,600-5,200+ per year for someone who meal preps lunch and dinner five days a week.",
    },
    {
      question: "How do I reduce my meal prep cost per serving?",
      answer:
        "Buy proteins in bulk when on sale, use seasonal produce, buy store brands, batch cook grains and beans, and use cheaper protein sources like chicken thighs, eggs, and legumes. Planning meals around weekly sales can cut costs by 20-30%.",
    },
  ],
  formula:
    "Cost Per Serving = Total Ingredient Cost / Number of Servings | Savings = Restaurant Cost - Prep Cost",
};
