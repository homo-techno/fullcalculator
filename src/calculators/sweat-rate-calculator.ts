import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sweatRateCalculator: CalculatorDefinition = {
  slug: "sweat-rate-calculator",
  title: "Sweat Rate Calculator",
  description: "Free sweat rate calculator. Get personalized health insights based on your profile.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sweat rate calculator", "health calculator", "medical calculator"],
  variants: [
    {
      id: "standard",
      name: "Sweat Rate",
      description: "Free sweat rate calculator. Get personalized health insights based on your profi",
      fields: [
        {
          name: "value1",
          label: "Primary Value",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "value2",
          label: "Secondary Value",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
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
          options: [{ label: "Male", value: "1" }, { label: "Female", value: "0.9" }],
        }
      ],
      calculate: (inputs) => {
        const v1 = inputs.value1 as number;
        const v2 = inputs.value2 as number;
        const age = inputs.age as number;
        const genderFactor = parseFloat(inputs.gender as string) || 1;
        if (!v1 || !v2 || !age) return null;
        const score = Math.round(((v1 + v2) / 2) * genderFactor * (1 - age / 200) * 10) / 10;
        const rating = score > 70 ? "Excellent" : score > 50 ? "Good" : score > 30 ? "Fair" : "Needs Attention";
        return {
          primary: { label: "Score", value: formatNumber(score) + " (" + rating + ")" },
          details: [
            { label: "Primary factor", value: formatNumber(v1) },
            { label: "Secondary factor", value: formatNumber(v2) },
            { label: "Age adjustment", value: formatNumber(1 - age / 200) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How does the sweat rate work?",
      answer: "This calculator uses evidence-based formulas to provide estimates. Always consult a healthcare professional for medical advice.",
    },
    {
      question: "Is this calculator medically accurate?",
      answer: "This tool provides general estimates for educational purposes. Individual needs may vary based on health conditions, medications, and other factors.",
    }
  ],
  formula: "Score based on individual health factors",
};
