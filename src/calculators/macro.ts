import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const macroCalculator: CalculatorDefinition = {
  slug: "macro-calculator",
  title: "Macro Calculator",
  description: "Free macro calculator. Calculate your ideal macronutrient split (protein, carbs, fat) based on calories, body weight, and fitness goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["macro calculator", "macronutrient calculator", "macro split calculator", "protein carbs fat calculator", "IIFYM calculator"],
  variants: [
    {
      id: "macros",
      name: "Calculate Macros",
      description: "Get protein, carbs, and fat targets based on calories and goal",
      fields: [
        { name: "calories", label: "Daily Calories", type: "number", placeholder: "e.g. 2000" },
        { name: "goal", label: "Goal", type: "select", options: [
          { label: "Balanced (30/40/30)", value: "balanced" },
          { label: "Low Carb (40/20/40)", value: "lowcarb" },
          { label: "High Protein (40/30/30)", value: "highprotein" },
          { label: "Keto (30/5/65)", value: "keto" },
          { label: "Zone Diet (30/40/30)", value: "zone" },
        ], defaultValue: "balanced" },
      ],
      calculate: (inputs) => {
        const cals = inputs.calories as number;
        const goal = inputs.goal as string;
        if (!cals) return null;
        const splits: Record<string, [number, number, number]> = {
          balanced: [30, 40, 30],
          lowcarb: [40, 20, 40],
          highprotein: [40, 30, 30],
          keto: [30, 5, 65],
          zone: [30, 40, 30],
        };
        const [protPct, carbPct, fatPct] = splits[goal] || splits.balanced;
        const proteinCals = cals * (protPct / 100);
        const carbCals = cals * (carbPct / 100);
        const fatCals = cals * (fatPct / 100);
        const proteinG = proteinCals / 4;
        const carbG = carbCals / 4;
        const fatG = fatCals / 9;
        return {
          primary: { label: "Daily Macros", value: `P: ${formatNumber(proteinG, 0)}g | C: ${formatNumber(carbG, 0)}g | F: ${formatNumber(fatG, 0)}g` },
          details: [
            { label: `Protein (${protPct}%)`, value: `${formatNumber(proteinG, 0)}g (${formatNumber(proteinCals, 0)} cal)` },
            { label: `Carbs (${carbPct}%)`, value: `${formatNumber(carbG, 0)}g (${formatNumber(carbCals, 0)} cal)` },
            { label: `Fat (${fatPct}%)`, value: `${formatNumber(fatG, 0)}g (${formatNumber(fatCals, 0)} cal)` },
            { label: "Total calories", value: `${cals}` },
          ],
          note: "Protein = 4 cal/g, Carbs = 4 cal/g, Fat = 9 cal/g. Adjust based on your activity level and how you feel.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "protein-calculator", "bmi-calculator"],
  faq: [
    { question: "What are macros?", answer: "Macros (macronutrients) are the three main nutrient categories: Protein (4 cal/g), Carbohydrates (4 cal/g), and Fat (9 cal/g). Together they make up all your caloric intake." },
  ],
  formula: "Protein (g) = Calories × P% / 4 | Carbs (g) = Calories × C% / 4 | Fat (g) = Calories × F% / 9",
};
