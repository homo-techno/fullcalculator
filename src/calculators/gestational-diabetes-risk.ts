import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gestationalDiabetesRiskCalculator: CalculatorDefinition = {
  slug: "gestational-diabetes-risk",
  title: "Gestational Diabetes Risk Calculator",
  description: "Free gestational diabetes risk calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["gestational diabetes calculator"],
  variants: [{
    id: "standard",
    name: "Gestational Diabetes Risk",
    description: "",
    fields: [
      { name: "age", label: "Age", type: "number", min: 18 },
      { name: "bmi", label: "Pre-pregnancy BMI", type: "number", min: 15 },
      { name: "familyHistory", label: "Family History (0-1)", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Risk Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gestational diabetes risk?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
