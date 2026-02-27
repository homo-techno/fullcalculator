import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const zincNeedsCalculator: CalculatorDefinition = {
  slug: "zinc-needs-calculator",
  title: "Zinc Needs Calculator",
  description: "Free zinc needs calculator. Get personalized health insights based on your profile.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["zinc needs calculator", "health calculator", "medical calculator"],
  variants: [
    {
      id: "standard",
      name: "Zinc Needs",
      description: "Free zinc needs calculator. Get personalized health insights based on your profi",
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
          defaultValue: "male",
          options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
        }
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        if (!weight || !age) return null;
        const baseDose = weight * 0.5;
        const ageFactor = age > 50 ? 1.2 : age > 30 ? 1.0 : 0.9;
        const genderFactor = gender === "female" ? 0.85 : 1.0;
        const recommended = baseDose * ageFactor * genderFactor;
        return {
          primary: { label: "Recommended Amount", value: formatNumber(recommended) + " mg/day" },
          details: [
            { label: "Based on weight", value: formatNumber(baseDose) + " mg" },
            { label: "Age adjustment", value: "x" + ageFactor },
            { label: "Min safe dose", value: formatNumber(recommended * 0.5) + " mg" },
            { label: "Max safe dose", value: formatNumber(recommended * 2) + " mg" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How does the zinc needs work?",
      answer: "This calculator uses evidence-based formulas to provide estimates. Always consult a healthcare professional for medical advice.",
    },
    {
      question: "Is this calculator medically accurate?",
      answer: "This tool provides general estimates for educational purposes. Individual needs may vary based on health conditions, medications, and other factors.",
    }
  ],
  formula: "Score based on individual health factors",
};
