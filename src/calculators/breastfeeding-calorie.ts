import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breastfeedingCalorieCalculator: CalculatorDefinition = {
  slug: "breastfeeding-calorie-calculator",
  title: "Breastfeeding Calorie Calculator",
  description:
    "Free breastfeeding calorie calculator. Calculate your total daily calorie needs while nursing. Accounts for the extra 500 calories needed for breast milk production.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "breastfeeding calorie calculator",
    "nursing calorie needs",
    "breastfeeding calories",
    "lactation calorie calculator",
    "calories while breastfeeding",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Nursing Calories",
      description: "How many calories do you need while breastfeeding?",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 150", suffix: "lbs" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 65", suffix: "inches" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (little/no exercise)", value: "1.2" },
            { label: "Lightly Active (1-3 days/week)", value: "1.375" },
            { label: "Moderately Active (3-5 days/week)", value: "1.55" },
            { label: "Very Active (6-7 days/week)", value: "1.725" },
          ],
          defaultValue: "1.2",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        const age = inputs.age as number;
        const activity = parseFloat(inputs.activity as string);
        if (!weight || !height || !age) return null;

        const weightKg = weight * 0.453592;
        const heightCm = height * 2.54;

        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        const tdee = bmr * activity;
        const lactationCalories = 500;
        const totalNeeded = tdee + lactationCalories;

        const mildDeficit = totalNeeded - 300;

        return {
          primary: { label: "Total Daily Calories Needed", value: formatNumber(totalNeeded, 0) },
          details: [
            { label: "Base TDEE", value: `${formatNumber(tdee, 0)} cal` },
            { label: "Lactation Bonus", value: `+${lactationCalories} cal` },
            { label: "BMR", value: `${formatNumber(bmr, 0)} cal` },
            { label: "If Losing Weight (mild deficit)", value: `${formatNumber(mildDeficit, 0)} cal` },
          ],
          note: "Breastfeeding mothers need about 500 extra calories per day for milk production. Do not go below 1,800 cal/day while nursing, as it can affect milk supply. Consult your healthcare provider before dieting while breastfeeding.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "tdee-calculator", "pregnancy-calculator", "calorie-deficit-calculator"],
  faq: [
    {
      question: "How many extra calories do breastfeeding mothers need?",
      answer:
        "Breastfeeding mothers need approximately 450-500 extra calories per day to support milk production. This is on top of your normal TDEE. Producing breast milk burns roughly 500 calories per day.",
    },
    {
      question: "Can I lose weight while breastfeeding?",
      answer:
        "Yes, but gradually. A mild deficit of 300-500 calories below your total needs (TDEE + lactation bonus) is generally safe. Do not drop below 1,800 calories per day, as this can reduce milk supply. Most experts recommend waiting 6-8 weeks postpartum before actively trying to lose weight.",
    },
    {
      question: "Will eating less affect my milk supply?",
      answer:
        "Severe calorie restriction can decrease milk supply. Most mothers can maintain supply on 1,800+ calories per day. Stay well hydrated (drink to thirst), eat a balanced diet, and lose weight gradually (no more than 1 lb per week). If supply drops, increase calories.",
    },
  ],
  formula:
    "Total Calories = TDEE + 500 (lactation) | TDEE = BMR × Activity Factor | BMR (Mifflin-St Jeor, female) = 10×weight(kg) + 6.25×height(cm) - 5×age - 161",
};
