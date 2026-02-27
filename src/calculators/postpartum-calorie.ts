import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postpartumCalorieCalculator: CalculatorDefinition = {
  slug: "postpartum-calorie-calculator",
  title: "Postpartum Calorie Needs Calculator",
  description:
    "Calculate daily calorie and macronutrient needs for postpartum recovery and breastfeeding. Accounts for lactation, activity level, and weight goals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "postpartum calorie calculator",
    "breastfeeding calories",
    "postpartum nutrition",
    "calories while breastfeeding",
    "postpartum weight loss",
    "lactation calorie needs",
  ],
  variants: [
    {
      id: "postpartum",
      name: "Postpartum Calorie Needs",
      description: "Calculate daily calorie needs for postpartum recovery",
      fields: [
        {
          name: "weight",
          label: "Current Weight",
          type: "number",
          placeholder: "e.g. 165",
          suffix: "lbs",
          min: 80,
          max: 400,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 65",
          suffix: "inches",
          min: 48,
          max: 84,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 15,
          max: 50,
        },
        {
          name: "feedingStatus",
          label: "Feeding Status",
          type: "select",
          options: [
            { label: "Exclusively breastfeeding", value: "exclusive_bf" },
            { label: "Partial breastfeeding / combo", value: "partial_bf" },
            { label: "Formula feeding / not lactating", value: "formula" },
          ],
          defaultValue: "exclusive_bf",
        },
        {
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (newborn phase recovery)", value: "sedentary" },
            { label: "Lightly active (walking, light exercise)", value: "light" },
            { label: "Moderately active (regular exercise)", value: "moderate" },
            { label: "Very active (intense exercise)", value: "active" },
          ],
          defaultValue: "light",
        },
        {
          name: "weightGoal",
          label: "Weight Goal",
          type: "select",
          options: [
            { label: "Maintain current weight", value: "maintain" },
            { label: "Gradual weight loss (~0.5 lb/week)", value: "slow_loss" },
            { label: "Moderate weight loss (~1 lb/week)", value: "mod_loss" },
          ],
          defaultValue: "maintain",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const height = parseFloat(inputs.height as string);
        const age = parseFloat(inputs.age as string);
        const feeding = inputs.feedingStatus as string;
        const activity = inputs.activityLevel as string;
        const goal = inputs.weightGoal as string;
        if (!weight || !height || !age) return null;

        // Mifflin-St Jeor for women (using imperial inputs)
        const weightKg = weight * 0.4536;
        const heightCm = height * 2.54;
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

        const activityMultipliers: Record<string, number> = {
          sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725,
        };

        const tdee = bmr * (activityMultipliers[activity] || 1.375);

        // Lactation calorie additions
        const lactationCalories: Record<string, number> = {
          exclusive_bf: 500, partial_bf: 250, formula: 0,
        };
        const lactationAdd = lactationCalories[feeding] || 0;

        // Weight goal adjustments
        const goalAdjustments: Record<string, number> = {
          maintain: 0, slow_loss: -250, mod_loss: -500,
        };
        const goalAdj = goalAdjustments[goal] || 0;

        // Don't go below safe minimums for breastfeeding
        let totalCalories = tdee + lactationAdd + goalAdj;
        const safeMinimum = feeding === "exclusive_bf" ? 1800 : feeding === "partial_bf" ? 1600 : 1500;
        totalCalories = Math.max(safeMinimum, totalCalories);

        // Macros
        const proteinG = weightKg * 1.2; // Higher for recovery/lactation
        const proteinCal = proteinG * 4;
        const fatCal = totalCalories * 0.30;
        const fatG = fatCal / 9;
        const carbCal = totalCalories - proteinCal - fatCal;
        const carbG = carbCal / 4;

        return {
          primary: { label: "Daily Calories", value: formatNumber(totalCalories, 0), suffix: "cal" },
          details: [
            { label: "Base TDEE", value: `${formatNumber(tdee, 0)} cal` },
            { label: "Lactation Addition", value: `+${formatNumber(lactationAdd, 0)} cal` },
            { label: "Weight Goal Adjustment", value: `${formatNumber(goalAdj, 0)} cal` },
            { label: "Protein", value: `${formatNumber(proteinG, 0)}g (${formatNumber(proteinCal, 0)} cal)` },
            { label: "Carbs", value: `${formatNumber(carbG, 0)}g (${formatNumber(carbCal, 0)} cal)` },
            { label: "Fat", value: `${formatNumber(fatG, 0)}g (${formatNumber(fatCal, 0)} cal)` },
            { label: "Water Intake", value: feeding !== "formula" ? "16+ cups/day" : "8-10 cups/day" },
          ],
          note: "Do not restrict calories below 1,800/day while exclusively breastfeeding, as this can reduce milk supply. Gradual weight loss (0.5-1 lb/week) is safe after 6 weeks postpartum. Consult your OB/GYN before starting any diet or exercise program postpartum.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "prenatal-vitamin-calculator", "macro-calculator"],
  faq: [
    {
      question: "How many extra calories do I need while breastfeeding?",
      answer:
        "Exclusively breastfeeding mothers need approximately 450-500 extra calories per day. Partial breastfeeding (combo feeding) requires about 250 extra calories. Your body also uses stored fat from pregnancy for milk production, so some caloric deficit is naturally occurring.",
    },
    {
      question: "Is it safe to lose weight while breastfeeding?",
      answer:
        "Gradual weight loss of 0.5-1 pound per week is generally safe after 6 weeks postpartum and does not affect milk supply. Avoid going below 1,800 calories/day and ensure adequate hydration (16+ cups of fluid daily). Rapid weight loss can release environmental toxins stored in fat and reduce milk supply.",
    },
    {
      question: "When should I start trying to lose postpartum weight?",
      answer:
        "Most experts recommend waiting at least 6 weeks postpartum before intentional weight loss, and longer (3-6 months) before restricting calories while breastfeeding. Focus on nutrient-dense foods and gentle activity first. Most women lose pregnancy weight within 6-12 months with a healthy lifestyle.",
    },
  ],
  formula:
    "Daily Calories = (BMR x Activity Factor) + Lactation Calories + Weight Goal Adjustment | BMR (Mifflin) = 10 x kg + 6.25 x cm - 5 x age - 161",
};
