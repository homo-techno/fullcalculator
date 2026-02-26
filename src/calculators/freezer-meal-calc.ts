import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freezerMealCalculator: CalculatorDefinition = {
  slug: "freezer-meal-calculator",
  title: "Freezer Meal Prep Quantity Planner",
  description:
    "Free freezer meal prep calculator. Plan the number of freezer meals to prepare, container sizes needed, and grocery quantities for batch freezer cooking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "freezer meal calculator",
    "freezer cooking planner",
    "batch cooking calculator",
    "freezer meal prep",
    "make ahead meals",
    "freezer meal quantities",
  ],
  variants: [
    {
      id: "by-weeks",
      name: "Plan by Weeks",
      description:
        "Calculate how many freezer meals to prep for a given number of weeks",
      fields: [
        {
          name: "weeks",
          label: "Weeks to Cover",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 12,
          step: 1,
        },
        {
          name: "mealsPerWeek",
          label: "Freezer Meals Per Week",
          type: "select",
          options: [
            { label: "2 meals/week", value: "2" },
            { label: "3 meals/week", value: "3" },
            { label: "4 meals/week", value: "4" },
            { label: "5 meals/week (weeknights)", value: "5" },
            { label: "7 meals/week (all dinners)", value: "7" },
          ],
          defaultValue: "3",
        },
        {
          name: "familySize",
          label: "Family Size",
          type: "select",
          options: [
            { label: "1 person", value: "1" },
            { label: "2 people", value: "2" },
            { label: "3-4 people", value: "4" },
            { label: "5-6 people", value: "6" },
          ],
          defaultValue: "4",
        },
      ],
      calculate: (inputs) => {
        const weeks = parseFloat(inputs.weeks as string);
        const mealsPerWeek = parseFloat(inputs.mealsPerWeek as string);
        const familySize = parseFloat(inputs.familySize as string);
        if (!weeks || weeks <= 0 || !mealsPerWeek) return null;

        const totalMeals = weeks * mealsPerWeek;
        const totalServings = totalMeals * familySize;

        // Protein estimate: ~6 oz raw per person per meal
        const proteinLbs = (totalServings * 6) / 16;
        // Container sizes: gallon bags for family of 4+, quart bags for 1-2
        const containerSize = familySize >= 4 ? "gallon" : "quart";
        const containers = totalMeals;

        // Rough estimates for common freezer meals
        const chickenLbs = proteinLbs * 0.4; // assume 40% chicken meals
        const beefLbs = proteinLbs * 0.3;
        const otherProteinLbs = proteinLbs * 0.3;

        return {
          primary: {
            label: `${formatNumber(weeks)} weeks of freezer meals`,
            value: `${formatNumber(totalMeals)} meals to prep`,
          },
          details: [
            { label: "Total Meals", value: formatNumber(totalMeals) },
            { label: "Total Servings", value: formatNumber(totalServings) },
            { label: "Total Protein Needed", value: `~${formatNumber(proteinLbs, 1)} lbs` },
            { label: "Chicken (est. 40%)", value: `~${formatNumber(chickenLbs, 1)} lbs` },
            { label: "Beef/Pork (est. 30%)", value: `~${formatNumber(beefLbs, 1)} lbs` },
            { label: "Other Protein (est. 30%)", value: `~${formatNumber(otherProteinLbs, 1)} lbs` },
            { label: "Freezer Bags/Containers", value: `${formatNumber(containers)} ${containerSize}-size` },
          ],
          note: "Label each container with the recipe name, date frozen, and reheating instructions. Most freezer meals last 2-3 months in a standard freezer.",
        };
      },
    },
    {
      id: "single-recipe",
      name: "Scale Single Recipe",
      description:
        "Scale a single recipe to make multiple batches for the freezer",
      fields: [
        {
          name: "recipeServings",
          label: "Recipe Makes (servings)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          step: 1,
        },
        {
          name: "batches",
          label: "Number of Batches",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          step: 1,
        },
        {
          name: "familyServings",
          label: "Servings per Meal",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          step: 1,
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const recipeServings = parseFloat(inputs.recipeServings as string);
        const batches = parseFloat(inputs.batches as string);
        const familyServings = parseFloat(inputs.familyServings as string);
        if (!recipeServings || !batches || !familyServings) return null;

        const totalServings = recipeServings * batches;
        const totalMeals = totalServings / familyServings;
        const multiplier = batches;

        return {
          primary: {
            label: `${formatNumber(batches)} batches`,
            value: `${formatNumber(totalMeals, 1)} family meals`,
          },
          details: [
            { label: "Recipe Multiplier", value: `${formatNumber(multiplier)}x` },
            { label: "Total Servings", value: formatNumber(totalServings) },
            { label: "Family Meals Produced", value: formatNumber(totalMeals, 1) },
            { label: "Containers Needed", value: formatNumber(Math.ceil(totalMeals)) },
          ],
          note: "Multiply each ingredient in your recipe by the multiplier. For best results, prepare one large batch rather than multiple sequential batches.",
        };
      },
    },
  ],
  relatedSlugs: [
    "meal-prep-cost-calculator",
    "food-cost-per-serving-calculator",
    "cooking-converter",
  ],
  faq: [
    {
      question: "How long do freezer meals last?",
      answer:
        "Most freezer meals stay safe indefinitely when frozen at 0\u00b0F, but for best quality: cooked meats last 2-3 months, casseroles 2-3 months, soups and stews 2-3 months, and uncooked marinated meats 4-6 months. Always label with the date frozen.",
    },
    {
      question: "What are the best meals to freeze?",
      answer:
        "Soups, stews, chili, casseroles, marinated raw meats, meatballs, enchiladas, and pasta bakes freeze exceptionally well. Avoid freezing foods with high water content (lettuce, cucumbers), dairy-based sauces (they separate), and fried foods (they get soggy).",
    },
  ],
  formula:
    "Total Meals = Weeks x Meals per Week | Total Servings = Total Meals x Family Size | Protein (lbs) = Servings x 6 oz / 16",
};
