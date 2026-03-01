import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const macronutrientRatioCalculator: CalculatorDefinition = {
  slug: "macronutrient-ratio-calculator",
  title: "Macronutrient Ratio Calculator",
  description: "Calculate your daily macro split for specific diet goals",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["macronutrient ratio","macro calculator","diet macros"],
  variants: [{
    id: "standard",
    name: "Macronutrient Ratio",
    description: "Calculate your daily macro split for specific diet goals",
    fields: [
      { name: "dailyCalories", label: "Daily Calorie Target", type: "number", defaultValue: 2000, min: 800, max: 5000, step: 100 },
      { name: "proteinPct", label: "Protein (%)", type: "number", defaultValue: 30, min: 5, max: 60, step: 5 },
      { name: "carbPct", label: "Carbs (%)", type: "number", defaultValue: 40, min: 5, max: 70, step: 5 },
      { name: "fatPct", label: "Fat (%)", type: "number", defaultValue: 30, min: 5, max: 60, step: 5 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const cals = inputs.dailyCalories as number || 2000;
      const pPct = (inputs.proteinPct as number || 30) / 100;
      const cPct = (inputs.carbPct as number || 40) / 100;
      const fPct = (inputs.fatPct as number || 30) / 100;
      const totalPct = pPct + cPct + fPct;
      const adjP = pPct / totalPct;
      const adjC = cPct / totalPct;
      const adjF = fPct / totalPct;
      const proteinG = Math.round((cals * adjP) / 4);
      const carbG = Math.round((cals * adjC) / 4);
      const fatG = Math.round((cals * adjF) / 9);
      const actualCals = proteinG * 4 + carbG * 4 + fatG * 9;
      return {
        primary: { label: "Daily Macros", value: proteinG + "P / " + carbG + "C / " + fatG + "F (grams)" },
        details: [
          { label: "Protein", value: proteinG + "g (" + Math.round(adjP * 100) + "%)" },
          { label: "Carbs", value: carbG + "g (" + Math.round(adjC * 100) + "%)" },
          { label: "Fat", value: fatG + "g (" + Math.round(adjF * 100) + "%)" },
          { label: "Actual Calories", value: formatNumber(actualCals) + " cal" }
        ]
      };
    },
  }],
  relatedSlugs: ["protein-intake-calculator"],
  faq: [
    { question: "What is a good macro ratio?", answer: "Common splits are 30/40/30 (balanced), 40/30/30 (high protein), or 20/50/30 (endurance athletes)." },
    { question: "How are grams calculated from percentages?", answer: "Protein and carbs have 4 calories per gram, and fat has 9 calories per gram." },
  ],
  formula: "Protein(g) = Calories x P% / 4. Carbs(g) = Calories x C% / 4. Fat(g) = Calories x F% / 9.",
};
