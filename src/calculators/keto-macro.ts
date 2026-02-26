import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ketoMacroCalculator: CalculatorDefinition = {
  slug: "keto-macro",
  title: "Keto Macro Calculator",
  description: "Free online keto diet macro calculator. Calculate your ideal fat, protein, and carb intake for a ketogenic diet based on your goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["keto macros", "ketogenic diet", "keto calculator", "low carb", "keto diet plan", "fat protein carbs"],
  variants: [
    {
      id: "keto-macros",
      name: "Calculate Keto Macros",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 68" },
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
          name: "goal",
          label: "Goal",
          type: "select",
          options: [
            { label: "Lose Weight (20% deficit)", value: "0.8" },
            { label: "Maintain Weight", value: "1.0" },
            { label: "Gain Muscle (10% surplus)", value: "1.1" },
          ],
        },
        { name: "netCarbs", label: "Daily Net Carbs (g)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const activity = parseFloat(inputs.activity as string) || 1.2;
        const goal = parseFloat(inputs.goal as string) || 1.0;
        const netCarbs = parseFloat(inputs.netCarbs as string) || 20;

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

        const carbCalories = netCarbs * 4;
        const proteinGrams = weightKg * 1.6;
        const proteinCalories = proteinGrams * 4;
        const fatCalories = targetCalories - carbCalories - proteinCalories;
        const fatGrams = fatCalories / 9;

        const carbPercent = (carbCalories / targetCalories) * 100;
        const proteinPercent = (proteinCalories / targetCalories) * 100;
        const fatPercent = (fatCalories / targetCalories) * 100;

        return {
          primary: { label: "Daily Calories", value: formatNumber(Math.round(targetCalories)) },
          details: [
            { label: "Fat", value: `${formatNumber(Math.round(fatGrams))}g (${formatNumber(Math.round(fatPercent))}%)` },
            { label: "Protein", value: `${formatNumber(Math.round(proteinGrams))}g (${formatNumber(Math.round(proteinPercent))}%)` },
            { label: "Net Carbs", value: `${formatNumber(Math.round(netCarbs))}g (${formatNumber(Math.round(carbPercent))}%)` },
            { label: "TDEE", value: formatNumber(Math.round(tdee)) },
            { label: "BMR", value: formatNumber(Math.round(bmr)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["iifym-calculator", "carb-calculator", "fat-intake-calc", "maintenance-calories"],
  faq: [
    {
      question: "What are standard keto macro ratios?",
      answer: "A standard ketogenic diet typically consists of 70-75% fat, 20-25% protein, and 5-10% carbohydrates. Most people aim for 20-50 grams of net carbs per day to stay in ketosis.",
    },
    {
      question: "How much protein should I eat on keto?",
      answer: "On keto, aim for about 0.7-1.0 grams of protein per pound of lean body mass (approximately 1.6 g/kg total body weight). Too much protein can potentially interfere with ketosis through gluconeogenesis.",
    },
    {
      question: "What are net carbs?",
      answer: "Net carbs equal total carbohydrates minus fiber and sugar alcohols. On keto, you track net carbs because fiber and most sugar alcohols do not significantly affect blood sugar or ketosis.",
    },
  ],
  formula: "Target Calories = TDEE x Goal Factor; Carb Cal = Net Carbs x 4; Protein = Weight(kg) x 1.6; Fat Cal = Target - Carb Cal - Protein Cal",
};
