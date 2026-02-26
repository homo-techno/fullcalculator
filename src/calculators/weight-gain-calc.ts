import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weightGainCalcCalculator: CalculatorDefinition = {
  slug: "weight-gain-calc",
  title: "Weight Gain Calculator",
  description: "Free online healthy weight gain calculator. Calculate how many calories you need to eat daily to gain weight at a safe and sustainable rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["weight gain", "bulking", "calorie surplus", "gain weight", "muscle gain", "mass building"],
  variants: [
    {
      id: "weight-gain",
      name: "Calculate Weight Gain Calories",
      fields: [
        { name: "weight", label: "Current Weight (lbs)", type: "number", placeholder: "e.g. 150" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 68" },
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 25" },
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
            { label: "Extra Active", value: "1.9" },
          ],
        },
        {
          name: "rate",
          label: "Weight Gain Rate",
          type: "select",
          options: [
            { label: "Slow (0.5 lb/week)", value: "0.5" },
            { label: "Moderate (1 lb/week)", value: "1" },
            { label: "Fast (1.5 lbs/week)", value: "1.5" },
          ],
        },
        { name: "targetWeight", label: "Target Weight (lbs)", type: "number", placeholder: "e.g. 180" },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const activity = parseFloat(inputs.activity as string) || 1.2;
        const rate = parseFloat(inputs.rate as string) || 1;
        const targetWeight = parseFloat(inputs.targetWeight as string) || 0;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        let bmr: number;
        if (gender === "female") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        }

        const tdee = bmr * activity;
        const dailySurplus = (rate * 3500) / 7;
        const targetCalories = tdee + dailySurplus;
        const weightToGain = targetWeight > weight ? targetWeight - weight : 0;
        const weeksToGoal = weightToGain > 0 ? weightToGain / rate : 0;

        return {
          primary: { label: "Daily Calorie Target", value: formatNumber(Math.round(targetCalories)) },
          details: [
            { label: "Maintenance Calories", value: formatNumber(Math.round(tdee)) },
            { label: "Daily Surplus", value: formatNumber(Math.round(dailySurplus)) },
            { label: "BMR", value: formatNumber(Math.round(bmr)) },
            { label: "Gain Rate (lbs/week)", value: formatNumber(rate) },
            { label: "Weeks to Target", value: weeksToGoal > 0 ? formatNumber(Math.round(weeksToGoal)) : "N/A" },
            { label: "Weight to Gain", value: weightToGain > 0 ? `${formatNumber(weightToGain)} lbs` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["maintenance-calories", "iifym-calculator", "calorie-deficit"],
  faq: [
    {
      question: "How many extra calories do I need to gain weight?",
      answer: "To gain 1 pound per week, you need a surplus of about 500 calories per day above your maintenance level (3,500 calories per pound). For lean muscle gain, a surplus of 250-500 calories is recommended to minimize fat gain.",
    },
    {
      question: "How fast should I gain weight?",
      answer: "A safe rate of weight gain is 0.5-1 pound per week. Beginners with resistance training can gain muscle faster. Gaining more than 1-2 pounds per week usually means excessive fat gain.",
    },
    {
      question: "What should I eat to gain weight healthily?",
      answer: "Focus on nutrient-dense foods: lean proteins, complex carbohydrates, healthy fats, fruits, and vegetables. Eat frequent meals, include calorie-dense foods like nuts and avocados, and pair your surplus with strength training for muscle gain.",
    },
  ],
  formula: "TDEE = BMR x Activity Factor; Daily Surplus = (Rate lbs/week x 3500) / 7; Target Calories = TDEE + Daily Surplus",
};
