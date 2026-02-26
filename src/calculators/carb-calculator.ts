import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carbCalculator: CalculatorDefinition = {
  slug: "carb-calculator",
  title: "Carbohydrate Calculator",
  description: "Free online daily carbohydrate needs calculator. Determine how many grams of carbs you should eat per day based on your calorie needs and diet goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["carb calculator", "carbohydrate intake", "daily carbs", "carb needs", "carb grams", "carbohydrate needs"],
  variants: [
    {
      id: "carb-needs",
      name: "Calculate Daily Carb Needs",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 160" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 67" },
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 30" },
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
          name: "carbPercent",
          label: "Carb Percentage of Calories",
          type: "select",
          options: [
            { label: "Low Carb (20%)", value: "20" },
            { label: "Moderate Low (30%)", value: "30" },
            { label: "Moderate (40%)", value: "40" },
            { label: "Standard (50%)", value: "50" },
            { label: "High Carb (60%)", value: "60" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const activity = parseFloat(inputs.activity as string) || 1.2;
        const carbPercent = parseFloat(inputs.carbPercent as string) || 50;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        let bmr: number;
        if (gender === "female") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        }

        const tdee = bmr * activity;
        const carbCalories = tdee * (carbPercent / 100);
        const carbGrams = carbCalories / 4;
        const carbPerKg = carbGrams / weightKg;
        const carbPerLb = carbGrams / weight;

        return {
          primary: { label: "Daily Carbs (grams)", value: formatNumber(Math.round(carbGrams)) },
          details: [
            { label: "Carb Calories", value: formatNumber(Math.round(carbCalories)) },
            { label: "TDEE", value: formatNumber(Math.round(tdee)) },
            { label: "Carb % of Diet", value: `${formatNumber(carbPercent)}%` },
            { label: "Grams per kg Body Weight", value: formatNumber(carbPerKg) },
            { label: "Grams per lb Body Weight", value: formatNumber(carbPerLb) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["iifym-calculator", "keto-macro", "fat-intake-calc", "fiber-calculator"],
  faq: [
    {
      question: "How many carbs should I eat per day?",
      answer: "The Dietary Guidelines recommend 45-65% of total calories from carbohydrates. For a 2,000-calorie diet, this is 225-325 grams. Athletes may need more, while those on low-carb diets may consume 20-150 grams.",
    },
    {
      question: "What is the difference between total carbs and net carbs?",
      answer: "Total carbs include all carbohydrates in food, including fiber. Net carbs equal total carbs minus fiber (and sugar alcohols). Net carbs are what affect blood sugar levels.",
    },
    {
      question: "Do I need carbs to build muscle?",
      answer: "Carbs are not strictly necessary for muscle building, but they provide energy for intense workouts and help with recovery. Most athletes and bodybuilders consume moderate to high carbs to fuel performance.",
    },
  ],
  formula: "TDEE = BMR x Activity Factor; Carb Calories = TDEE x (Carb% / 100); Carb Grams = Carb Calories / 4",
};
