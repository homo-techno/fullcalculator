import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const calorieCalculator: CalculatorDefinition = {
  slug: "calorie-calculator",
  title: "Calorie Calculator",
  description:
    "Free calorie calculator. Estimate your daily calorie needs (TDEE) based on age, gender, height, weight, and activity level. Plan for weight loss or gain.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "calorie calculator",
    "TDEE calculator",
    "daily calorie needs",
    "calorie intake calculator",
    "BMR calculator",
  ],
  variants: [
    {
      id: "tdee",
      name: "Daily Calorie Needs (TDEE)",
      description: "Calculate your Total Daily Energy Expenditure",
      fields: [
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "male",
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 15,
          max: 120,
        },
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 30,
          max: 300,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 175",
          suffix: "cm",
          min: 100,
          max: 250,
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (office job)", value: "1.2" },
            { label: "Light (exercise 1-3x/week)", value: "1.375" },
            { label: "Moderate (exercise 3-5x/week)", value: "1.55" },
            { label: "Active (exercise 6-7x/week)", value: "1.725" },
            { label: "Very Active (athlete / physical job)", value: "1.9" },
          ],
          defaultValue: "1.55",
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = inputs.age as number;
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        const activity = parseFloat(inputs.activity as string);
        if (!age || !weight || !height) return null;

        // Mifflin-St Jeor equation
        let bmr: number;
        if (gender === "male") {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const tdee = bmr * activity;
        const loseWeight = tdee - 500;
        const gainWeight = tdee + 500;

        return {
          primary: {
            label: "Daily Calories (TDEE)",
            value: formatNumber(Math.round(tdee), 0),
            suffix: "cal/day",
          },
          details: [
            { label: "BMR (at rest)", value: `${formatNumber(Math.round(bmr), 0)} cal` },
            { label: "Weight loss (-0.5 kg/week)", value: `${formatNumber(Math.round(loseWeight), 0)} cal` },
            { label: "Weight gain (+0.5 kg/week)", value: `${formatNumber(Math.round(gainWeight), 0)} cal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "percentage-calculator"],
  faq: [
    {
      question: "What is TDEE?",
      answer:
        "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including basal metabolism, physical activity, and digestion. It is your BMR multiplied by your activity level.",
    },
    {
      question: "What is BMR?",
      answer:
        "BMR (Basal Metabolic Rate) is the number of calories your body needs at complete rest to maintain basic functions like breathing, circulation, and cell production. It typically accounts for 60-75% of your total daily calories.",
    },
    {
      question: "How many calories should I eat to lose weight?",
      answer:
        "A safe rate of weight loss is 0.5-1 kg (1-2 lbs) per week, which requires a deficit of 500-1000 calories per day below your TDEE. Never go below 1200 cal/day (women) or 1500 cal/day (men) without medical supervision.",
    },
  ],
  formula: "BMR (male) = 10*weight + 6.25*height - 5*age + 5 | TDEE = BMR x Activity Factor",
};
