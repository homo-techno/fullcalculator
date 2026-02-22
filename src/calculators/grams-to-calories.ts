import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToCaloriesConverter: CalculatorDefinition = {
  slug: "grams-to-calories-converter",
  title: "Grams to Calories Converter",
  description: "Free grams to calories converter. Convert grams of fat, protein, and carbohydrates to calories. Essential for nutrition tracking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grams to calories", "g to cal", "fat calories", "protein calories", "carb calories", "macronutrient calories"],
  variants: [
    {
      id: "convert",
      name: "Convert Grams to Calories",
      fields: [
        { name: "value", label: "Grams", type: "number", placeholder: "e.g. 50" },
        { name: "nutrient", label: "Nutrient Type", type: "select", options: [
          { label: "Fat (9 cal/g)", value: "fat" },
          { label: "Protein (4 cal/g)", value: "protein" },
          { label: "Carbohydrates (4 cal/g)", value: "carbs" },
          { label: "Alcohol (7 cal/g)", value: "alcohol" },
          { label: "Sugar (4 cal/g)", value: "sugar" },
          { label: "Fiber (2 cal/g)", value: "fiber" },
        ], defaultValue: "fat" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const nutrient = inputs.nutrient as string;
        if (value === undefined) return null;
        const calPerGram: Record<string, number> = { fat: 9, protein: 4, carbs: 4, alcohol: 7, sugar: 4, fiber: 2 };
        const factor = calPerGram[nutrient] || 4;
        const calories = value * factor;
        return {
          primary: { label: `${formatNumber(value)} g of ${nutrient}`, value: `${formatNumber(calories, 1)} calories` },
          details: [
            { label: "Calories (kcal)", value: formatNumber(calories, 1) },
            { label: "Kilojoules (kJ)", value: formatNumber(calories * 4.184, 1) },
            { label: "If Fat (9 cal/g)", value: formatNumber(value * 9, 1) },
            { label: "If Protein (4 cal/g)", value: formatNumber(value * 4, 1) },
            { label: "If Carbs (4 cal/g)", value: formatNumber(value * 4, 1) },
            { label: "If Alcohol (7 cal/g)", value: formatNumber(value * 7, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "protein-calculator"],
  faq: [
    { question: "How many calories are in 1 gram of fat?", answer: "1 gram of fat contains 9 calories. Fat is the most calorie-dense macronutrient, providing more than double the calories per gram compared to protein or carbohydrates (4 cal/g each)." },
    { question: "How do I calculate calories from grams?", answer: "Multiply grams by the calorie factor: Fat = grams × 9, Protein = grams × 4, Carbohydrates = grams × 4, Alcohol = grams × 7. For example, 20g of fat = 180 calories." },
  ],
  formula: "Fat: 1g = 9 cal | Protein: 1g = 4 cal | Carbs: 1g = 4 cal | Alcohol: 1g = 7 cal | 1 cal = 4.184 kJ",
};
