import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const maintenanceCaloriesCalculator: CalculatorDefinition = {
  slug: "maintenance-calories",
  title: "Maintenance Calorie Calculator",
  description: "Free online maintenance calorie calculator. Find out how many calories you need daily to maintain your current weight based on your stats and activity level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["maintenance calories", "tdee", "daily calories", "calorie needs", "energy expenditure"],
  variants: [
    {
      id: "maintenance",
      name: "Calculate Maintenance Calories",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 160" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 67" },
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
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (little or no exercise)", value: "1.2" },
            { label: "Lightly Active (1-3 days/week)", value: "1.375" },
            { label: "Moderately Active (3-5 days/week)", value: "1.55" },
            { label: "Very Active (6-7 days/week)", value: "1.725" },
            { label: "Extra Active (athlete)", value: "1.9" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const age = parseFloat(inputs.age as string) || 0;
        const gender = inputs.gender as string;
        const activity = parseFloat(inputs.activity as string) || 1.2;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        let bmr: number;
        if (gender === "female") {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        }

        const tdee = bmr * activity;
        const mildLoss = tdee - 250;
        const moderateLoss = tdee - 500;
        const mildGain = tdee + 250;

        return {
          primary: { label: "Maintenance Calories", value: formatNumber(Math.round(tdee)) },
          details: [
            { label: "BMR (Basal Metabolic Rate)", value: formatNumber(Math.round(bmr)) },
            { label: "Mild Weight Loss (-0.5 lb/wk)", value: formatNumber(Math.round(mildLoss)) },
            { label: "Moderate Weight Loss (-1 lb/wk)", value: formatNumber(Math.round(moderateLoss)) },
            { label: "Mild Weight Gain (+0.5 lb/wk)", value: formatNumber(Math.round(mildGain)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-deficit", "iifym-calculator", "weight-gain-calc"],
  faq: [
    {
      question: "What are maintenance calories?",
      answer: "Maintenance calories are the number of calories your body needs each day to maintain your current weight. This includes energy used for basic functions (BMR) plus energy used during physical activity.",
    },
    {
      question: "How accurate is the Mifflin-St Jeor equation?",
      answer: "The Mifflin-St Jeor equation is considered the most accurate predictive equation for estimating BMR, with an accuracy of about plus or minus 10%. Individual metabolism can vary based on genetics, muscle mass, and other factors.",
    },
    {
      question: "Should I eat exactly my maintenance calories?",
      answer: "Your maintenance calories are an estimate. Track your weight over 2-3 weeks while eating at this level and adjust up or down by 100-200 calories based on whether you are gaining, losing, or maintaining weight.",
    },
  ],
  formula: "BMR (Male) = 10 x weight(kg) + 6.25 x height(cm) - 5 x age + 5; BMR (Female) = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 161; TDEE = BMR x Activity Factor",
};
