import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iifymCalculator: CalculatorDefinition = {
  slug: "iifym-calculator",
  title: "IIFYM Calculator",
  description: "Free online IIFYM (If It Fits Your Macros) calculator. Calculate your ideal protein, carb, and fat intake based on your calorie goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["iifym", "if it fits your macros", "macro calculator", "flexible dieting", "macronutrients", "macro split"],
  variants: [
    {
      id: "iifym",
      name: "Calculate IIFYM Macros",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 68" },
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 28" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary", value: "1.2" },
            { label: "Lightly Active", value: "1.375" },
            { label: "Moderately Active", value: "1.55" },
            { label: "Very Active", value: "1.725" },
            { label: "Extra Active", value: "1.9" },
          ],
        },
        {
          name: "goal",
          label: "Goal",
          type: "select",
          options: [
            { label: "Lose Fat (20% deficit)", value: "0.8" },
            { label: "Maintain", value: "1.0" },
            { label: "Build Muscle (10% surplus)", value: "1.1" },
          ],
        },
        {
          name: "split",
          label: "Macro Split",
          type: "select",
          options: [
            { label: "Balanced (40/30/30 C/P/F)", value: "40-30-30" },
            { label: "High Protein (35/40/25)", value: "35-40-25" },
            { label: "Low Carb (25/35/40)", value: "25-35-40" },
            { label: "High Carb (50/25/25)", value: "50-25-25" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const activity = parseFloat(inputs.activity as string) || 1.2;
        const goal = parseFloat(inputs.goal as string) || 1.0;
        const split = inputs.split as string;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        let bmr: number;
        if (gender === "female") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        }

        const tdee = bmr * activity;
        const targetCalories = tdee * goal;

        const parts = split.split("-").map(Number);
        const carbPct = parts[0] / 100;
        const proteinPct = parts[1] / 100;
        const fatPct = parts[2] / 100;

        const carbGrams = (targetCalories * carbPct) / 4;
        const proteinGrams = (targetCalories * proteinPct) / 4;
        const fatGrams = (targetCalories * fatPct) / 9;

        return {
          primary: { label: "Daily Calories", value: formatNumber(Math.round(targetCalories)) },
          details: [
            { label: "Carbs", value: `${formatNumber(Math.round(carbGrams))}g (${parts[0]}%)` },
            { label: "Protein", value: `${formatNumber(Math.round(proteinGrams))}g (${parts[1]}%)` },
            { label: "Fat", value: `${formatNumber(Math.round(fatGrams))}g (${parts[2]}%)` },
            { label: "TDEE", value: formatNumber(Math.round(tdee)) },
            { label: "Protein per lb", value: `${formatNumber(proteinGrams / weight)}g` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["keto-macro", "calorie-deficit", "maintenance-calories", "carb-calculator"],
  faq: [
    {
      question: "What is IIFYM?",
      answer: "IIFYM stands for 'If It Fits Your Macros.' It is a flexible dieting approach where you can eat any foods as long as you hit your daily macronutrient targets for protein, carbs, and fat.",
    },
    {
      question: "What macro split should I use?",
      answer: "A balanced 40/30/30 split works well for most people. If you are focused on muscle building, try a higher protein split (35/40/25). For fat loss with satiety, a lower carb approach (25/35/40) can help.",
    },
    {
      question: "How much protein do I need per pound of body weight?",
      answer: "For muscle building or maintenance, aim for 0.7-1.0 grams of protein per pound of body weight. Active individuals and those in a calorie deficit benefit from the higher end of this range.",
    },
  ],
  formula: "TDEE = BMR x Activity; Target Cal = TDEE x Goal; Macros (g) = (Target Cal x Percentage) / calories per gram (4 for carbs/protein, 9 for fat)",
};
