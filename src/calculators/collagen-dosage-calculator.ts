import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collagenDosageCalculator: CalculatorDefinition = {
  slug: "collagen-dosage-calculator",
  title: "Collagen Dosage Calculator",
  description: "Free collagen dosage calculator. Get instant results with our easy-to-use calculator.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["collagen dosage calculator", "nutrition calculator", "health tool"],
  variants: [
    {
      id: "standard",
      name: "Collagen Dosage",
      description: "Calculate collagen dosage",
      fields: [
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 20,
          max: 300,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 1,
          max: 120,
        },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          defaultValue: "1",
          options: [{ label: "Male", value: "1" }, { label: "Female", value: "0.85" }],
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          defaultValue: "1.55",
          options: [{ label: "Sedentary", value: "1.2" }, { label: "Light", value: "1.375" }, { label: "Moderate", value: "1.55" }, { label: "Active", value: "1.725" }, { label: "Very Active", value: "1.9" }],
        }
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number;
        const age = inputs.age as number;
        const gf = parseFloat(inputs.gender as string) || 1;
        const af = parseFloat(inputs.activity as string) || 1.55;
        if (!w || !age) return null;
        const base = (10 * w + 6.25 * (w * 2.5) - 5 * age) * gf;
        const tdee = base * af;
        const result = tdee * 0.15;
        return {
          primary: { label: "Recommended Amount", value: formatNumber(result) + " mg/day" },
          details: [
            { label: "Based on TDEE", value: formatNumber(tdee) + " kcal" },
            { label: "Body weight factor", value: formatNumber(w) + " kg" },
            { label: "Activity multiplier", value: "x" + af },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator"],
  faq: [
    { question: "How does the collagen dosage calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
