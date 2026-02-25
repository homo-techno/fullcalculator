import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glycemicLoadCalculator: CalculatorDefinition = {
  slug: "glycemic-load-calculator",
  title: "Glycemic Load Calculator",
  description: "Free glycemic load calculator. Calculate the glycemic load of foods based on their glycemic index and carbohydrate content per serving.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["glycemic load", "glycemic index", "blood sugar", "carbohydrate quality", "gl calculator", "gi calculator"],
  variants: [
    {
      id: "single-food",
      name: "Single Food GL",
      description: "Calculate glycemic load for a single food item",
      fields: [
        { name: "gi", label: "Glycemic Index (GI)", type: "number", placeholder: "e.g. 72", min: 0, max: 100 },
        { name: "carbs", label: "Carbohydrates per Serving", type: "number", placeholder: "e.g. 25", suffix: "g" },
        { name: "servings", label: "Number of Servings", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const gi = inputs.gi as number;
        const carbs = inputs.carbs as number;
        const servings = (inputs.servings as number) || 1;
        if (gi === undefined || gi === null || !carbs) return null;
        const glPerServing = (gi * carbs) / 100;
        const glTotal = glPerServing * servings;
        let category: string;
        if (glPerServing <= 10) category = "Low GL (good)";
        else if (glPerServing <= 19) category = "Medium GL (moderate)";
        else category = "High GL (limit intake)";
        let giCategory: string;
        if (gi <= 55) giCategory = "Low GI";
        else if (gi <= 69) giCategory = "Medium GI";
        else giCategory = "High GI";
        return {
          primary: { label: "Glycemic Load", value: formatNumber(glTotal, 1) },
          details: [
            { label: "GL per Serving", value: formatNumber(glPerServing, 1) },
            { label: "GL Category", value: category },
            { label: "GI Category", value: giCategory },
            { label: "Total Carbs", value: `${formatNumber(carbs * servings, 1)} g` },
          ],
        };
      },
    },
    {
      id: "daily-gl",
      name: "Daily Glycemic Load",
      description: "Estimate your daily glycemic load target based on calorie needs",
      fields: [
        { name: "calories", label: "Daily Calories", type: "number", placeholder: "e.g. 2000", suffix: "kcal" },
        { name: "carbPercent", label: "Carbs (% of Calories)", type: "number", placeholder: "e.g. 50", suffix: "%", defaultValue: 50 },
        { name: "avgGI", label: "Average GI of Diet", type: "number", placeholder: "e.g. 55", defaultValue: 55 },
      ],
      calculate: (inputs) => {
        const calories = inputs.calories as number;
        const carbPct = (inputs.carbPercent as number) || 50;
        const avgGI = (inputs.avgGI as number) || 55;
        if (!calories) return null;
        const totalCarbs = (calories * carbPct / 100) / 4;
        const dailyGL = (avgGI * totalCarbs) / 100;
        let rating: string;
        if (dailyGL < 80) rating = "Low daily GL (ideal for blood sugar management)";
        else if (dailyGL < 120) rating = "Moderate daily GL";
        else rating = "High daily GL (consider lowering GI choices)";
        return {
          primary: { label: "Daily Glycemic Load", value: formatNumber(dailyGL, 0) },
          details: [
            { label: "Rating", value: rating },
            { label: "Total Daily Carbs", value: `${formatNumber(totalCarbs, 0)} g` },
            { label: "Average GI", value: formatNumber(avgGI, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "protein-intake-calculator"],
  faq: [
    { question: "What is glycemic load?", answer: "Glycemic Load (GL) accounts for both the glycemic index (how quickly a food raises blood sugar) and the amount of carbohydrates per serving. GL = (GI x carbs per serving) / 100. A GL of 10 or less is low, 11-19 is medium, and 20+ is high." },
    { question: "Why is glycemic load better than glycemic index?", answer: "GI alone can be misleading. Watermelon has a high GI (72) but low carbs per serving, giving it a low GL (~4). GL gives a more practical picture of a food's blood sugar impact by considering portion size." },
  ],
  formula: "GL = (GI x Carbohydrates per serving in grams) / 100",
};
