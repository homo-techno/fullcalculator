import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fiberCalculator: CalculatorDefinition = {
  slug: "fiber-calculator",
  title: "Daily Fiber Calculator",
  description: "Free online daily fiber needs calculator. Find out how much fiber you should eat each day based on your age, gender, and calorie intake.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fiber calculator", "daily fiber", "fiber intake", "dietary fiber", "fiber needs", "fiber recommendation"],
  variants: [
    {
      id: "fiber-needs",
      name: "Calculate Daily Fiber Needs",
      fields: [
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
        { name: "calories", label: "Daily Calorie Intake", type: "number", placeholder: "e.g. 2000" },
        {
          name: "goal",
          label: "Health Goal",
          type: "select",
          options: [
            { label: "General Health", value: "general" },
            { label: "Weight Loss", value: "weightloss" },
            { label: "Digestive Health", value: "digestive" },
            { label: "Heart Health", value: "heart" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const calories = parseFloat(inputs.calories as string) || 2000;
        const goal = inputs.goal as string;

        let baseRecommendation: number;
        if (age <= 3) {
          baseRecommendation = 19;
        } else if (age <= 8) {
          baseRecommendation = 25;
        } else if (age <= 13) {
          baseRecommendation = gender === "male" ? 31 : 26;
        } else if (age <= 18) {
          baseRecommendation = gender === "male" ? 38 : 26;
        } else if (age <= 50) {
          baseRecommendation = gender === "male" ? 38 : 25;
        } else {
          baseRecommendation = gender === "male" ? 30 : 21;
        }

        let goalMultiplier = 1.0;
        if (goal === "weightloss") goalMultiplier = 1.15;
        if (goal === "digestive") goalMultiplier = 1.2;
        if (goal === "heart") goalMultiplier = 1.1;

        const recommended = Math.round(baseRecommendation * goalMultiplier);
        const fiberPerThousandCal = (recommended / calories) * 1000;
        const solubleFiber = Math.round(recommended * 0.25);
        const insolubleFiber = Math.round(recommended * 0.75);

        return {
          primary: { label: "Daily Fiber (grams)", value: formatNumber(recommended) },
          details: [
            { label: "Base Recommendation", value: `${formatNumber(baseRecommendation)}g` },
            { label: "Soluble Fiber Target", value: `${formatNumber(solubleFiber)}g` },
            { label: "Insoluble Fiber Target", value: `${formatNumber(insolubleFiber)}g` },
            { label: "Fiber per 1,000 Calories", value: `${formatNumber(fiberPerThousandCal)}g` },
            { label: "Goal Adjustment", value: goal === "general" ? "None" : `+${Math.round((goalMultiplier - 1) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["carb-calculator", "iifym-calculator", "calorie-deficit"],
  faq: [
    {
      question: "How much fiber do adults need daily?",
      answer: "The recommended daily fiber intake is 38 grams for men and 25 grams for women ages 19-50. After age 50, the recommendation drops to 30 grams for men and 21 grams for women. Most Americans only consume about 15 grams per day.",
    },
    {
      question: "What is the difference between soluble and insoluble fiber?",
      answer: "Soluble fiber dissolves in water and helps lower cholesterol and regulate blood sugar. It is found in oats, beans, and fruits. Insoluble fiber adds bulk to stool and aids digestion. It is found in whole grains, nuts, and vegetables.",
    },
    {
      question: "Can you eat too much fiber?",
      answer: "Yes. Consuming more than 50-70 grams of fiber per day can cause bloating, gas, and discomfort. Increase fiber gradually (by 3-5 grams per week) and drink plenty of water to avoid digestive issues.",
    },
  ],
  formula: "Recommended Fiber = Base Recommendation (by age/gender) x Goal Multiplier; Soluble = 25% of total; Insoluble = 75% of total",
};
