import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const calorieDeficitCalculator: CalculatorDefinition = {
  slug: "calorie-deficit-calculator",
  title: "Calorie Deficit Calculator",
  description:
    "Free calorie deficit calculator. Calculate how many calories to eat for weight loss based on your TDEE. See projected weekly weight loss for different deficit levels.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "calorie deficit calculator",
    "weight loss calculator",
    "calorie calculator for weight loss",
    "deficit calculator",
    "how many calories to lose weight",
  ],
  variants: [
    {
      id: "from-tdee",
      name: "From Known TDEE",
      description: "Enter your TDEE directly if you already know it",
      fields: [
        { name: "tdee", label: "TDEE (Total Daily Energy Expenditure)", type: "number", placeholder: "e.g. 2200", suffix: "cal" },
        {
          name: "deficit",
          label: "Daily Deficit",
          type: "select",
          options: [
            { label: "250 cal (mild - 0.5 lb/week)", value: "250" },
            { label: "500 cal (moderate - 1 lb/week)", value: "500" },
            { label: "750 cal (aggressive - 1.5 lb/week)", value: "750" },
            { label: "1000 cal (extreme - 2 lb/week)", value: "1000" },
          ],
          defaultValue: "500",
        },
      ],
      calculate: (inputs) => {
        const tdee = inputs.tdee as number;
        const deficit = parseFloat(inputs.deficit as string);
        if (!tdee) return null;

        const target = tdee - deficit;
        const weeklyLoss = (deficit * 7) / 3500;
        const monthlyLoss = weeklyLoss * 4.33;

        return {
          primary: { label: "Daily Calorie Target", value: formatNumber(target, 0) },
          details: [
            { label: "Your TDEE", value: `${formatNumber(tdee, 0)} cal` },
            { label: "Daily Deficit", value: `${formatNumber(deficit, 0)} cal` },
            { label: "Weekly Weight Loss", value: `${formatNumber(weeklyLoss, 1)} lbs` },
            { label: "Monthly Weight Loss", value: `${formatNumber(monthlyLoss, 1)} lbs` },
          ],
          note: target < 1200
            ? "Warning: Eating below 1,200 calories/day is not recommended without medical supervision."
            : "A moderate deficit of 500 cal/day is sustainable for most people. Combine with exercise for best results.",
        };
      },
    },
    {
      id: "calculate-tdee",
      name: "Calculate TDEE + Deficit",
      description: "Calculate your TDEE from body stats then apply deficit",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 180", suffix: "lbs" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 70", suffix: "inches" },
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
        {
          name: "deficit",
          label: "Daily Deficit",
          type: "select",
          options: [
            { label: "250 cal (mild - 0.5 lb/week)", value: "250" },
            { label: "500 cal (moderate - 1 lb/week)", value: "500" },
            { label: "750 cal (aggressive - 1.5 lb/week)", value: "750" },
            { label: "1000 cal (extreme - 2 lb/week)", value: "1000" },
          ],
          defaultValue: "500",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const activity = parseFloat(inputs.activity as string);
        const deficit = parseFloat(inputs.deficit as string);
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
        const target = tdee - deficit;
        const weeklyLoss = (deficit * 7) / 3500;
        const monthlyLoss = weeklyLoss * 4.33;

        return {
          primary: { label: "Daily Calorie Target", value: formatNumber(target, 0) },
          details: [
            { label: "BMR", value: `${formatNumber(bmr, 0)} cal` },
            { label: "TDEE", value: `${formatNumber(tdee, 0)} cal` },
            { label: "Daily Deficit", value: `${formatNumber(deficit, 0)} cal` },
            { label: "Weekly Weight Loss", value: `${formatNumber(weeklyLoss, 1)} lbs` },
            { label: "Monthly Weight Loss", value: `${formatNumber(monthlyLoss, 1)} lbs` },
          ],
          note: target < 1200
            ? "Warning: Eating below 1,200 calories/day is not recommended without medical supervision."
            : "A moderate deficit of 500 cal/day is sustainable for most people. Combine with exercise for best results.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "tdee-calculator", "calorie-calculator", "macro-calculator"],
  faq: [
    {
      question: "How many calories should I cut to lose weight?",
      answer:
        "A deficit of 500 calories per day results in about 1 pound of weight loss per week (3,500 calories = 1 pound of fat). This is a safe and sustainable rate for most people.",
    },
    {
      question: "What is the minimum calorie intake?",
      answer:
        "Most experts recommend women eat at least 1,200 calories/day and men at least 1,500 calories/day. Going below these levels without medical supervision can cause nutrient deficiencies and metabolic slowdown.",
    },
    {
      question: "Why am I not losing weight in a deficit?",
      answer:
        "Common reasons include underestimating calorie intake, overestimating exercise calories, water retention, metabolic adaptation, or an inaccurate TDEE estimate. Track accurately for 2-3 weeks before adjusting.",
    },
  ],
  formula:
    "Target Calories = TDEE - Deficit | Weekly Loss (lbs) = (Deficit × 7) / 3500 | 3,500 calories ≈ 1 lb of body fat",
};
