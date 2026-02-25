import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealPlanCostCalculator: CalculatorDefinition = {
  slug: "meal-plan-cost-calculator",
  title: "Meal Plan Cost Calculator",
  description:
    "Free meal plan cost calculator. Compare college meal plans versus cooking your own meals and find the most cost-effective option.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "meal plan cost calculator",
    "college meal plan",
    "dining plan calculator",
    "meal plan vs cooking",
    "cost per meal college",
  ],
  variants: [
    {
      id: "cost-per-meal",
      name: "Meal Plan Cost Analysis",
      description: "Calculate the actual cost per meal of your dining plan",
      fields: [
        { name: "planCost", label: "Semester Meal Plan Cost ($)", type: "number", placeholder: "e.g. 3500", min: 0 },
        { name: "mealsPerWeek", label: "Meals Included per Week", type: "number", placeholder: "e.g. 14", min: 1, max: 21 },
        { name: "semesterWeeks", label: "Weeks in Semester", type: "number", placeholder: "e.g. 15", min: 1, max: 20, defaultValue: 15 },
        { name: "flexDollars", label: "Flex Dollars Included ($)", type: "number", placeholder: "e.g. 200", min: 0, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const cost = inputs.planCost as number;
        const mealsPerWeek = inputs.mealsPerWeek as number;
        const weeks = (inputs.semesterWeeks as number) || 15;
        const flex = (inputs.flexDollars as number) || 0;
        if (!cost || !mealsPerWeek) return null;

        const totalMeals = mealsPerWeek * weeks;
        const effectiveCost = cost - flex;
        const costPerMeal = effectiveCost / totalMeals;
        const dailyCost = costPerMeal * (mealsPerWeek / 7);
        const monthlyCost = cost / (weeks / 4.33);

        return {
          primary: { label: "Cost per Meal", value: `$${formatNumber(costPerMeal, 2)}` },
          details: [
            { label: "Total meals in semester", value: formatNumber(totalMeals, 0) },
            { label: "Daily dining cost", value: `$${formatNumber(dailyCost, 2)}` },
            { label: "Monthly equivalent", value: `$${formatNumber(monthlyCost, 2)}` },
            { label: "Effective cost (minus flex)", value: `$${formatNumber(effectiveCost, 2)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Meal Plan vs Cooking",
      description: "Compare the cost of a meal plan versus cooking your own food",
      fields: [
        { name: "mealPlanSemester", label: "Semester Meal Plan Cost ($)", type: "number", placeholder: "e.g. 3500", min: 0 },
        { name: "groceryWeekly", label: "Weekly Grocery Cost if Cooking ($)", type: "number", placeholder: "e.g. 60", min: 0 },
        { name: "eatingOutWeekly", label: "Weekly Eating Out Budget ($)", type: "number", placeholder: "e.g. 20", min: 0 },
        { name: "weeks", label: "Weeks in Semester", type: "number", placeholder: "e.g. 15", min: 1, max: 20, defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const mealPlan = inputs.mealPlanSemester as number;
        const grocery = (inputs.groceryWeekly as number) || 0;
        const eatingOut = (inputs.eatingOutWeekly as number) || 0;
        const weeks = (inputs.weeks as number) || 15;
        if (mealPlan === undefined) return null;

        const cookingTotal = (grocery + eatingOut) * weeks;
        const difference = mealPlan - cookingTotal;
        const weeklyMealPlan = mealPlan / weeks;

        let recommendation: string;
        if (difference > 200) recommendation = "Cooking saves significantly";
        else if (difference > 0) recommendation = "Cooking saves a little";
        else if (difference > -200) recommendation = "Meal plan saves a little";
        else recommendation = "Meal plan saves significantly";

        return {
          primary: { label: "Savings", value: `$${formatNumber(Math.abs(difference), 2)} (${difference > 0 ? "cooking" : "meal plan"})` },
          details: [
            { label: "Recommendation", value: recommendation },
            { label: "Meal plan total", value: `$${formatNumber(mealPlan, 2)}` },
            { label: "Cooking total", value: `$${formatNumber(cookingTotal, 2)}` },
            { label: "Weekly: meal plan vs cooking", value: `$${formatNumber(weeklyMealPlan, 2)} vs $${formatNumber(grocery + eatingOut, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-budget-calculator", "student-monthly-budget-calculator"],
  faq: [
    {
      question: "Are college meal plans worth it?",
      answer:
        "It depends on your eating habits and location. Meal plans offer convenience and typically cost $8-$15 per meal. Cooking can be cheaper at $3-$7 per meal but requires time and kitchen access.",
    },
    {
      question: "How much should a college student spend on food?",
      answer:
        "The average college student spends $200-$500 per month on food. Budget-conscious students who cook can spend $150-$250, while those relying on dining halls and restaurants may spend $300-$500+.",
    },
  ],
  formula: "Cost per Meal = (Plan Cost - Flex Dollars) / (Meals per Week x Weeks)",
};
