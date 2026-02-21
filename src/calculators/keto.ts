import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ketoCalculator: CalculatorDefinition = {
  slug: "keto-calculator",
  title: "Keto Calculator",
  description:
    "Free keto macro calculator. Calculate your ideal ketogenic diet macros based on weight, height, age, sex, and activity level. Get personalized fat, protein, and carb targets for ketosis.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "keto calculator",
    "keto macro calculator",
    "ketogenic diet calculator",
    "keto diet macros",
    "low carb calculator",
    "keto calories",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Keto Macros",
      description: "Get your personalized keto macronutrient targets",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 170", suffix: "lbs" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 68", suffix: "inches" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "male",
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (little/no exercise)", value: "1.2" },
            { label: "Lightly Active (1-3 days/week)", value: "1.375" },
            { label: "Moderately Active (3-5 days/week)", value: "1.55" },
            { label: "Very Active (6-7 days/week)", value: "1.725" },
            { label: "Extra Active (athlete/physical job)", value: "1.9" },
          ],
          defaultValue: "1.2",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const activity = parseFloat(inputs.activity as string);
        if (!weight || !height || !age) return null;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        let bmr: number;
        if (sex === "female") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        }

        const tdee = bmr * activity;

        const fatCals = tdee * 0.7;
        const proteinCals = tdee * 0.25;
        const carbCals = tdee * 0.05;

        const fatG = fatCals / 9;
        const proteinG = proteinCals / 4;
        const carbG = carbCals / 4;

        return {
          primary: { label: "Daily Calories (TDEE)", value: formatNumber(tdee, 0) },
          details: [
            { label: "Fat (70%)", value: `${formatNumber(fatG, 0)}g (${formatNumber(fatCals, 0)} cal)` },
            { label: "Protein (25%)", value: `${formatNumber(proteinG, 0)}g (${formatNumber(proteinCals, 0)} cal)` },
            { label: "Net Carbs (5%)", value: `${formatNumber(carbG, 0)}g (${formatNumber(carbCals, 0)} cal)` },
            { label: "BMR", value: `${formatNumber(bmr, 0)} cal` },
          ],
          note: "Keep net carbs under 20-50g daily to maintain ketosis. Adjust fat intake up or down based on weight goals.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "macro-calculator", "tdee-calculator", "calorie-calculator"],
  faq: [
    {
      question: "What is the keto diet?",
      answer:
        "The ketogenic (keto) diet is a high-fat, moderate-protein, very-low-carb diet. By drastically reducing carbs (typically under 20-50g/day), your body enters ketosis and burns fat for fuel instead of glucose.",
    },
    {
      question: "Why is fat so high on keto?",
      answer:
        "On keto, fat replaces carbohydrates as your primary energy source. The 70% fat target ensures you have enough energy while keeping carbs low enough for ketosis.",
    },
    {
      question: "How many carbs can I eat on keto?",
      answer:
        "Most people need to stay under 20-50g of net carbs per day to maintain ketosis. Net carbs = total carbs minus fiber. Start at 20g and adjust based on your results.",
    },
  ],
  formula:
    "TDEE = BMR × Activity Factor | Mifflin-St Jeor BMR: Male = 10×weight(kg) + 6.25×height(cm) - 5×age + 5; Female = 10×weight(kg) + 6.25×height(cm) - 5×age - 161 | Keto split: 70% fat, 25% protein, 5% carbs",
};
