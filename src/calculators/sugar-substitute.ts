import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sugarSubstituteCalculator: CalculatorDefinition = {
  slug: "sugar-substitute-calculator",
  title: "Sugar Substitute Conversion",
  description:
    "Free sugar substitute conversion calculator. Convert between regular sugar and popular sugar substitutes for baking and cooking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "sugar substitute",
    "sugar conversion",
    "stevia to sugar",
    "erythritol conversion",
    "sweetener substitute",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "sugarAmount",
          label: "Sugar Amount (cups)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "substitute",
          label: "Substitute With",
          type: "select",
          options: [
            { label: "Stevia (powder)", value: "stevia" },
            { label: "Erythritol", value: "erythritol" },
            { label: "Monk Fruit Sweetener", value: "monk_fruit" },
            { label: "Honey", value: "honey" },
            { label: "Maple Syrup", value: "maple_syrup" },
            { label: "Coconut Sugar", value: "coconut_sugar" },
            { label: "Agave Nectar", value: "agave" },
            { label: "Splenda (Sucralose)", value: "splenda" },
          ],
        },
        {
          name: "purpose",
          label: "Purpose",
          type: "select",
          options: [
            { label: "Baking", value: "baking" },
            { label: "Beverages", value: "beverages" },
            { label: "Cooking / Sauces", value: "cooking" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sugarCups = inputs.sugarAmount as number;
        const substitute = inputs.substitute as string;
        const purpose = inputs.purpose as string;
        if (!sugarCups || sugarCups <= 0) return null;

        const conversionRatios: Record<string, number> = {
          stevia: 0.021,
          erythritol: 1.3,
          monk_fruit: 0.5,
          honey: 0.67,
          maple_syrup: 0.75,
          coconut_sugar: 1.0,
          agave: 0.67,
          splenda: 1.0,
        };

        const caloriesPer100g: Record<string, number> = {
          stevia: 0,
          erythritol: 24,
          monk_fruit: 0,
          honey: 304,
          maple_syrup: 260,
          coconut_sugar: 375,
          agave: 310,
          splenda: 0,
        };

        const notes: Record<string, string> = {
          stevia: "Very concentrated; may have aftertaste in large amounts",
          erythritol: "Use 1.3x sugar amount; may have cooling effect",
          monk_fruit: "Blends vary; check label for conversion",
          honey: "Reduce oven temp by 25°F; reduce liquids by 1/4 cup per cup",
          maple_syrup: "Reduce liquids by 3 tbsp per cup; adds maple flavor",
          coconut_sugar: "1:1 replacement; slightly lower glycemic index",
          agave: "Reduce oven temp by 25°F; sweeter than sugar",
          splenda: "1:1 cup-for-cup; not ideal for caramelization",
        };

        const ratio = conversionRatios[substitute] || 1.0;
        const substituteAmount = sugarCups * ratio;
        const sugarGrams = sugarCups * 200;
        const sugarCalories = sugarGrams * 4;
        const subCalPer100 = caloriesPer100g[substitute] || 0;
        const subGrams = substituteAmount * 200;
        const subCalories = (subGrams / 100) * subCalPer100;
        const calorieSavings = Math.max(0, sugarCalories - subCalories);
        const unit = ratio < 0.1 ? "tsp" : "cups";
        const displayAmount = ratio < 0.1 ? substituteAmount * 48 : substituteAmount;

        return {
          primary: {
            label: "Substitute Amount",
            value: formatNumber(displayAmount, 1) + " " + unit,
          },
          details: [
            { label: "Original Sugar", value: formatNumber(sugarCups, 1) + " cups" },
            { label: "Calorie Savings", value: formatNumber(calorieSavings, 0) + " cal" },
            { label: "Original Calories", value: formatNumber(sugarCalories, 0) + " cal" },
            { label: "Substitute Calories", value: formatNumber(subCalories, 0) + " cal" },
            { label: "Baking Note", value: notes[substitute] || "Use as directed" },
            { label: "Purpose", value: purpose.charAt(0).toUpperCase() + purpose.slice(1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "calorie-calculator"],
  faq: [
    {
      question: "Can I substitute stevia for sugar in baking?",
      answer:
        "Stevia works in baking but is about 200-300 times sweeter than sugar. Use about 1 teaspoon of stevia powder per cup of sugar. Since stevia has no bulk, you may need to add a bulking agent.",
    },
    {
      question: "What is the best sugar substitute for baking?",
      answer:
        "Erythritol and monk fruit sweetener are popular for baking because they provide bulk similar to sugar. For liquid substitutes, honey and maple syrup work well but require reducing other liquids in the recipe.",
    },
  ],
  formula:
    "Substitute amount = Sugar cups × Conversion ratio. Ratios: Stevia 0.021, Erythritol 1.3, Monk Fruit 0.5, Honey 0.67, Maple Syrup 0.75, Coconut Sugar 1.0, Agave 0.67, Splenda 1.0.",
};
