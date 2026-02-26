import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fatIntakeCalcCalculator: CalculatorDefinition = {
  slug: "fat-intake-calc",
  title: "Daily Fat Intake Calculator",
  description: "Free online daily fat intake calculator. Determine how many grams of fat you should eat per day based on your calorie needs and dietary goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fat intake", "daily fat", "fat grams", "dietary fat", "fat calculator", "healthy fat intake"],
  variants: [
    {
      id: "fat-intake",
      name: "Calculate Daily Fat Intake",
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
          ],
        },
        {
          name: "fatPercent",
          label: "Fat Percentage of Calories",
          type: "select",
          options: [
            { label: "Low Fat (20%)", value: "20" },
            { label: "Standard (25%)", value: "25" },
            { label: "Moderate (30%)", value: "30" },
            { label: "Higher Fat (35%)", value: "35" },
            { label: "High Fat / Keto (70%)", value: "70" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const activity = parseFloat(inputs.activity as string) || 1.2;
        const fatPercent = parseFloat(inputs.fatPercent as string) || 30;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        let bmr: number;
        if (gender === "female") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        }

        const tdee = bmr * activity;
        const fatCalories = tdee * (fatPercent / 100);
        const fatGrams = fatCalories / 9;
        const satFatMax = fatGrams * 0.33;
        const fatPerKg = fatGrams / weightKg;

        return {
          primary: { label: "Daily Fat (grams)", value: formatNumber(Math.round(fatGrams)) },
          details: [
            { label: "Fat Calories", value: formatNumber(Math.round(fatCalories)) },
            { label: "TDEE", value: formatNumber(Math.round(tdee)) },
            { label: "Fat % of Diet", value: `${formatNumber(fatPercent)}%` },
            { label: "Max Saturated Fat (g)", value: formatNumber(Math.round(satFatMax)) },
            { label: "Grams per kg Body Weight", value: formatNumber(fatPerKg) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["iifym-calculator", "keto-macro", "carb-calculator", "maintenance-calories"],
  faq: [
    {
      question: "How much fat should I eat per day?",
      answer: "The Dietary Guidelines recommend 20-35% of total calories from fat. For a 2,000-calorie diet, this is about 44-78 grams of fat per day. Athletes and those on ketogenic diets may eat more.",
    },
    {
      question: "What types of fat should I eat?",
      answer: "Focus on unsaturated fats from sources like olive oil, nuts, avocados, and fatty fish. Limit saturated fat to less than 10% of total calories. Avoid trans fats entirely.",
    },
    {
      question: "Is eating fat bad for you?",
      answer: "No. Dietary fat is essential for hormone production, nutrient absorption, and brain function. The type of fat matters more than the total amount. Healthy fats are an important part of a balanced diet.",
    },
  ],
  formula: "TDEE = BMR x Activity Factor; Fat Calories = TDEE x (Fat% / 100); Fat Grams = Fat Calories / 9",
};
