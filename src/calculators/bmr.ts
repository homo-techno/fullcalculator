import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bmrCalculator: CalculatorDefinition = {
  slug: "bmr-calculator",
  title: "BMR Calculator",
  description: "Free BMR calculator. Calculate your Basal Metabolic Rate using the Mifflin-St Jeor and Harris-Benedict equations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bmr calculator", "basal metabolic rate", "metabolism calculator", "resting metabolic rate", "mifflin st jeor"],
  variants: [
    {
      id: "metric",
      name: "Metric (kg/cm)",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        {
          name: "sex", label: "Sex", type: "select",
          options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
        },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number, h = inputs.height as number;
        const age = inputs.age as number, sex = inputs.sex as string || "male";
        if (!w || !h || !age) return null;
        const mifflin = sex === "male"
          ? 10 * w + 6.25 * h - 5 * age + 5
          : 10 * w + 6.25 * h - 5 * age - 161;
        const harris = sex === "male"
          ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * age
          : 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
        return {
          primary: { label: "BMR (Mifflin-St Jeor)", value: `${formatNumber(mifflin, 0)} cal/day` },
          details: [
            { label: "Harris-Benedict", value: `${formatNumber(harris, 0)} cal/day` },
            { label: "TDEE (sedentary ×1.2)", value: `${formatNumber(mifflin * 1.2, 0)} cal/day` },
            { label: "TDEE (moderate ×1.55)", value: `${formatNumber(mifflin * 1.55, 0)} cal/day` },
            { label: "TDEE (active ×1.725)", value: `${formatNumber(mifflin * 1.725, 0)} cal/day` },
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
        {
          name: "sex", label: "Sex", type: "select",
          options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
        },
      ],
      calculate: (inputs) => {
        const wLbs = inputs.weight as number, hIn = inputs.height as number;
        const age = inputs.age as number, sex = inputs.sex as string || "male";
        if (!wLbs || !hIn || !age) return null;
        const w = wLbs * 0.453592, h = hIn * 2.54;
        const mifflin = sex === "male"
          ? 10 * w + 6.25 * h - 5 * age + 5
          : 10 * w + 6.25 * h - 5 * age - 161;
        return {
          primary: { label: "BMR (Mifflin-St Jeor)", value: `${formatNumber(mifflin, 0)} cal/day` },
          details: [
            { label: "TDEE (sedentary ×1.2)", value: `${formatNumber(mifflin * 1.2, 0)} cal/day` },
            { label: "TDEE (moderate ×1.55)", value: `${formatNumber(mifflin * 1.55, 0)} cal/day` },
            { label: "TDEE (active ×1.725)", value: `${formatNumber(mifflin * 1.725, 0)} cal/day` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "bmi-calculator"],
  faq: [{ question: "What is BMR?", answer: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest to maintain basic life functions like breathing and digestion. Multiply BMR by an activity factor (1.2-1.9) to get your TDEE (Total Daily Energy Expenditure)." }],
  formula: "Mifflin-St Jeor: Male = 10w + 6.25h - 5a + 5 | Female = 10w + 6.25h - 5a - 161",
};
