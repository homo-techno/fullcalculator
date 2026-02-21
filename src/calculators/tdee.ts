import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tdeeCalculator: CalculatorDefinition = {
  slug: "tdee-calculator",
  title: "TDEE Calculator",
  description: "Free TDEE calculator. Calculate your Total Daily Energy Expenditure based on BMR and activity level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["tdee calculator", "total daily energy expenditure", "calories burned per day", "maintenance calories"],
  variants: [
    {
      id: "metric",
      name: "Metric (kg/cm)",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        {
          name: "activity", label: "Activity Level", type: "select",
          options: [
            { label: "Sedentary (office job)", value: "1.2" },
            { label: "Lightly active (1-3 days/week)", value: "1.375" },
            { label: "Moderately active (3-5 days/week)", value: "1.55" },
            { label: "Very active (6-7 days/week)", value: "1.725" },
            { label: "Extra active (athlete)", value: "1.9" },
          ],
        },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number, h = inputs.height as number;
        const age = inputs.age as number, sex = (inputs.sex as string) || "male";
        const af = parseFloat((inputs.activity as string) || "1.55");
        if (!w || !h || !age) return null;
        const bmr = sex === "male"
          ? 10 * w + 6.25 * h - 5 * age + 5
          : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * af;
        return {
          primary: { label: "TDEE", value: `${formatNumber(tdee, 0)} cal/day` },
          details: [
            { label: "BMR", value: `${formatNumber(bmr, 0)} cal/day` },
            { label: "Activity multiplier", value: `×${af}` },
            { label: "To lose 0.5 kg/week", value: `${formatNumber(tdee - 500, 0)} cal/day` },
            { label: "To lose 1 kg/week", value: `${formatNumber(tdee - 1000, 0)} cal/day` },
            { label: "To gain 0.5 kg/week", value: `${formatNumber(tdee + 500, 0)} cal/day` },
          ],
        };
      },
    },
    {
      id: "imperial",
      name: "Imperial (lbs/in)",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 154" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 69" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
        {
          name: "activity", label: "Activity Level", type: "select",
          options: [
            { label: "Sedentary (office job)", value: "1.2" },
            { label: "Lightly active (1-3 days/week)", value: "1.375" },
            { label: "Moderately active (3-5 days/week)", value: "1.55" },
            { label: "Very active (6-7 days/week)", value: "1.725" },
            { label: "Extra active (athlete)", value: "1.9" },
          ],
        },
      ],
      calculate: (inputs) => {
        const wLbs = inputs.weight as number, hIn = inputs.height as number;
        const age = inputs.age as number, sex = (inputs.sex as string) || "male";
        const af = parseFloat((inputs.activity as string) || "1.55");
        if (!wLbs || !hIn || !age) return null;
        const w = wLbs * 0.453592, h = hIn * 2.54;
        const bmr = sex === "male"
          ? 10 * w + 6.25 * h - 5 * age + 5
          : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * af;
        return {
          primary: { label: "TDEE", value: `${formatNumber(tdee, 0)} cal/day` },
          details: [
            { label: "BMR", value: `${formatNumber(bmr, 0)} cal/day` },
            { label: "To lose 1 lb/week", value: `${formatNumber(tdee - 500, 0)} cal/day` },
            { label: "To gain 1 lb/week", value: `${formatNumber(tdee + 500, 0)} cal/day` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmr-calculator", "calorie-calculator", "macro-calculator"],
  faq: [{ question: "What is TDEE?", answer: "TDEE (Total Daily Energy Expenditure) is the total calories you burn per day including exercise. TDEE = BMR × Activity Factor. Eat below TDEE to lose weight, above to gain weight." }],
  formula: "TDEE = BMR × Activity Factor (1.2 to 1.9)",
};
