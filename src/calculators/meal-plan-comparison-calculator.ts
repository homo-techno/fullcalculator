import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealPlanComparisonCalculator: CalculatorDefinition = {
  slug: "meal-plan-comparison-calculator",
  title: "Meal Plan Comparison Calculator",
  description: "Compare the value of college meal plans versus cooking on your own.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["meal plan","college","comparison","food","dining"],
  variants: [{
    id: "standard",
    name: "Meal Plan Comparison",
    description: "Compare the value of college meal plans versus cooking on your own.",
    fields: [
      { name: "mealPlanCost", label: "Semester Meal Plan Cost ($)", type: "number", min: 1000, max: 8000, step: 100, defaultValue: 3500 },
      { name: "mealsPerWeek", label: "Meals Per Week Included", type: "number", min: 7, max: 21, step: 1, defaultValue: 14 },
      { name: "semesterWeeks", label: "Semester Length (weeks)", type: "number", min: 12, max: 20, step: 1, defaultValue: 16 },
      { name: "groceryCostWeekly", label: "Weekly Grocery Cost ($)", type: "number", min: 30, max: 200, step: 10, defaultValue: 70 },
    ],
    calculate: (inputs) => {
    const mealPlanCost = inputs.mealPlanCost as number;
    const mealsPerWeek = inputs.mealsPerWeek as number;
    const semesterWeeks = inputs.semesterWeeks as number;
    const groceryCostWeekly = inputs.groceryCostWeekly as number;
    const totalMeals = mealsPerWeek * semesterWeeks;
    const costPerMeal = mealPlanCost / totalMeals;
    const groceryTotal = groceryCostWeekly * semesterWeeks;
    const groceryCostPerMeal = groceryTotal / (21 * semesterWeeks);
    const savings = mealPlanCost - groceryTotal;
    return {
      primary: { label: "Meal Plan Cost Per Meal", value: "$" + formatNumber(costPerMeal) },
      details: [
        { label: "Total Meals Included", value: formatNumber(totalMeals) },
        { label: "Meal Plan Total", value: "$" + formatNumber(mealPlanCost) },
        { label: "Grocery Total (semester)", value: "$" + formatNumber(groceryTotal) },
        { label: "Difference", value: "$" + formatNumber(Math.abs(savings)) + (savings > 0 ? " more for plan" : " less for plan") }
      ]
    };
  },
  }],
  relatedSlugs: ["school-lunch-cost-calculator","dorm-room-essentials-calculator","college-application-cost-calculator"],
  faq: [
    { question: "Is a college meal plan worth it?", answer: "Meal plans offer convenience but cooking can save $500 to $1,500 per semester." },
    { question: "How much does a college student spend on food?", answer: "The average college student spends $250 to $500 per month on food and dining." },
  ],
  formula: "Cost Per Meal = Semester Meal Plan Cost / (Meals Per Week x Semester Weeks)",
};
