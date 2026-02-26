import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glycemicIndexCalculator: CalculatorDefinition = {
  slug: "glycemic-index-calculator",
  title: "Glycemic Index Calculator",
  description:
    "Calculate the glycemic index and glycemic load of foods and meals. Estimate blood sugar impact from carbohydrate content and GI values to manage diabetes and diet.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "glycemic index calculator",
    "glycemic load",
    "GI calculator",
    "blood sugar impact",
    "carbohydrate calculator",
    "diabetes diet",
    "low GI foods",
  ],
  variants: [
    {
      id: "glycemic-load",
      name: "Glycemic Load Calculator",
      description: "Calculate the glycemic load of a food based on its GI and carb content",
      fields: [
        {
          name: "gi",
          label: "Glycemic Index (GI)",
          type: "number",
          placeholder: "e.g. 72",
          min: 0,
          max: 120,
          step: 1,
        },
        {
          name: "carbGrams",
          label: "Available Carbohydrates per Serving",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "g",
          min: 0,
          max: 500,
          step: 0.1,
        },
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 1",
          min: 0.1,
          max: 20,
          step: 0.1,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const gi = parseFloat(inputs.gi as string);
        const carbGrams = parseFloat(inputs.carbGrams as string);
        const servings = parseFloat(inputs.servings as string) || 1;
        if (!gi && gi !== 0) return null;
        if (!carbGrams && carbGrams !== 0) return null;

        const totalCarbs = carbGrams * servings;
        const gl = (gi * totalCarbs) / 100;

        let giCategory: string;
        if (gi <= 55) giCategory = "Low GI";
        else if (gi <= 69) giCategory = "Medium GI";
        else giCategory = "High GI";

        let glCategory: string;
        if (gl <= 10) glCategory = "Low GL — minimal blood sugar impact";
        else if (gl <= 19) glCategory = "Medium GL — moderate blood sugar impact";
        else glCategory = "High GL — significant blood sugar impact";

        return {
          primary: { label: "Glycemic Load", value: formatNumber(gl, 1) },
          details: [
            { label: "Glycemic Index", value: `${formatNumber(gi, 0)} (${giCategory})` },
            { label: "Carbs per Serving", value: `${formatNumber(carbGrams, 1)} g` },
            { label: "Servings", value: formatNumber(servings, 1) },
            { label: "Total Carbs", value: `${formatNumber(totalCarbs, 1)} g` },
            { label: "GL Classification", value: glCategory },
          ],
          note: "Glycemic Load (GL) accounts for both the quality (GI) and quantity of carbohydrates. A daily GL under 80 is considered low; over 120 is high.",
        };
      },
    },
    {
      id: "meal-gi",
      name: "Meal GI Estimator",
      description: "Estimate the overall GI of a mixed meal with multiple foods",
      fields: [
        {
          name: "gi1",
          label: "Food 1 — Glycemic Index",
          type: "number",
          placeholder: "e.g. 72",
          min: 0,
          max: 120,
        },
        {
          name: "carb1",
          label: "Food 1 — Carbs (g)",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "g",
          min: 0,
          max: 500,
        },
        {
          name: "gi2",
          label: "Food 2 — Glycemic Index",
          type: "number",
          placeholder: "e.g. 42",
          min: 0,
          max: 120,
        },
        {
          name: "carb2",
          label: "Food 2 — Carbs (g)",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "g",
          min: 0,
          max: 500,
        },
        {
          name: "gi3",
          label: "Food 3 — Glycemic Index (optional)",
          type: "number",
          placeholder: "e.g. 55",
          min: 0,
          max: 120,
        },
        {
          name: "carb3",
          label: "Food 3 — Carbs (g) (optional)",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "g",
          min: 0,
          max: 500,
        },
      ],
      calculate: (inputs) => {
        const gi1 = parseFloat(inputs.gi1 as string);
        const carb1 = parseFloat(inputs.carb1 as string);
        const gi2 = parseFloat(inputs.gi2 as string);
        const carb2 = parseFloat(inputs.carb2 as string);
        const gi3 = parseFloat(inputs.gi3 as string);
        const carb3 = parseFloat(inputs.carb3 as string);

        if (isNaN(gi1) || isNaN(carb1) || isNaN(gi2) || isNaN(carb2)) return null;

        let totalWeighted = gi1 * carb1 + gi2 * carb2;
        let totalCarbs = carb1 + carb2;

        if (!isNaN(gi3) && !isNaN(carb3)) {
          totalWeighted += gi3 * carb3;
          totalCarbs += carb3;
        }

        if (totalCarbs === 0) return null;

        const mealGI = totalWeighted / totalCarbs;
        const mealGL = totalWeighted / 100;

        let category: string;
        if (mealGI <= 55) category = "Low GI Meal";
        else if (mealGI <= 69) category = "Medium GI Meal";
        else category = "High GI Meal";

        return {
          primary: { label: "Meal Glycemic Index", value: formatNumber(mealGI, 0) },
          details: [
            { label: "Meal GI Category", value: category },
            { label: "Total Meal Carbs", value: `${formatNumber(totalCarbs, 1)} g` },
            { label: "Meal Glycemic Load", value: formatNumber(mealGL, 1) },
          ],
          note: "Meal GI is estimated using the weighted average method. Fat, protein, and fiber can further lower the effective GI of a meal.",
        };
      },
    },
  ],
  relatedSlugs: ["a1c-calculator", "diabetes-risk-calculator", "meal-calorie-calculator"],
  faq: [
    {
      question: "What is the difference between Glycemic Index and Glycemic Load?",
      answer:
        "Glycemic Index (GI) ranks how quickly a carbohydrate-containing food raises blood sugar on a scale of 0-100. Glycemic Load (GL) goes further by multiplying GI by the actual amount of carbs in a serving and dividing by 100, giving a more practical measure of blood sugar impact.",
    },
    {
      question: "What GI values are considered low, medium, and high?",
      answer:
        "Low GI is 55 or less (e.g., most fruits, legumes, oats). Medium GI is 56-69 (e.g., whole wheat bread, brown rice). High GI is 70 or above (e.g., white bread, white rice, potatoes).",
    },
    {
      question: "Can I use the Glycemic Index to manage diabetes?",
      answer:
        "Yes. Choosing lower-GI foods can help manage blood sugar levels. However, GI should be used alongside other dietary considerations like total carbs, fiber, fat, and protein. Always consult your healthcare provider for personalized dietary advice.",
    },
  ],
  formula:
    "Glycemic Load (GL) = (GI x Available Carbohydrates in grams) / 100 | Meal GI = Sum(GI_i x Carb_i) / Sum(Carb_i)",
};
