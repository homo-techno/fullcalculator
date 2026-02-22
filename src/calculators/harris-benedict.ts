import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const harrisBenedictCalculator: CalculatorDefinition = {
  slug: "harris-benedict",
  title: "Harris-Benedict BMR Calculator",
  description: "Free Harris-Benedict BMR calculator. Calculate basal metabolic rate and total daily energy expenditure using the revised Harris-Benedict equation.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["harris benedict", "bmr calculator", "basal metabolic rate", "calorie needs", "tdee calculator", "energy expenditure"],
  variants: [
    {
      id: "harris-benedict",
      name: "Harris-Benedict (Revised)",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70", min: 20, max: 300, step: 0.1 },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 170", min: 100, max: 250, step: 0.1 },
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 30", min: 15, max: 120 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        { name: "activityLevel", label: "Activity Level", type: "select", options: [
          { label: "Sedentary (little/no exercise)", value: "1.2" },
          { label: "Lightly active (1-3 days/wk)", value: "1.375" },
          { label: "Moderately active (3-5 days/wk)", value: "1.55" },
          { label: "Very active (6-7 days/wk)", value: "1.725" },
          { label: "Extra active (very intense/physical job)", value: "1.9" },
        ] },
      ],
      calculate: (inputs) => {
        const wt = inputs.weight as number;
        const ht = inputs.height as number;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const af = parseFloat(inputs.activityLevel as string);
        if (!wt || !ht || !age || !sex || !af) return null;
        let bmr: number;
        if (sex === "male") {
          bmr = 88.362 + (13.397 * wt) + (4.799 * ht) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * wt) + (3.098 * ht) - (4.330 * age);
        }
        const tdee = bmr * af;
        return {
          primary: { label: "BMR", value: formatNumber(bmr, 0) + " kcal/day" },
          details: [
            { label: "Basal Metabolic Rate", value: formatNumber(bmr, 0) + " kcal/day" },
            { label: "Total Daily Energy Expenditure", value: formatNumber(tdee, 0) + " kcal/day" },
            { label: "Activity Factor", value: formatNumber(af, 3) },
            { label: "Weight Loss (~0.5 kg/wk)", value: formatNumber(tdee - 500, 0) + " kcal/day" },
            { label: "Weight Gain (~0.5 kg/wk)", value: formatNumber(tdee + 500, 0) + " kcal/day" },
            { label: "Protein Need (est.)", value: formatNumber(wt * 0.8, 0) + " - " + formatNumber(wt * 1.2, 0) + " g/day" },
          ],
          note: "BMR is the energy needed at complete rest. TDEE = BMR x activity factor. Adjust caloric intake by 500 kcal/day for approximately 0.5 kg/week weight change.",
        };
      },
    },
  ],
  relatedSlugs: ["nutritional-screening", "fluid-maintenance", "framingham-score"],
  faq: [
    { question: "What is the Harris-Benedict equation?", answer: "The revised Harris-Benedict equation estimates BMR: Male: 88.362 + (13.397 x weight kg) + (4.799 x height cm) - (5.677 x age). Female: 447.593 + (9.247 x weight) + (3.098 x height) - (4.330 x age)." },
    { question: "What is the difference between BMR and TDEE?", answer: "BMR is calories burned at rest. TDEE is total calories burned including activity. TDEE = BMR x activity factor." },
    { question: "How accurate is this calculator?", answer: "Harris-Benedict is accurate within 5-10% for most people. Individual variation exists based on body composition, genetics, and metabolic conditions." },
  ],
  formula: "Male BMR = 88.362 + (13.397 x W) + (4.799 x H) - (5.677 x A) | Female BMR = 447.593 + (9.247 x W) + (3.098 x H) - (4.330 x A)",
};
