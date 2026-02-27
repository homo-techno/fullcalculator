import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bmiPediatricCalculator: CalculatorDefinition = {
  slug: "bmi-pediatric",
  title: "Pediatric BMI Calculator",
  description: "Free pediatric bmi calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pediatric bmi calculator"],
  variants: [{
    id: "standard",
    name: "Pediatric BMI",
    description: "",
    fields: [
      { name: "weight", label: "Weight (kg)", type: "number", min: 2 },
      { name: "height", label: "Height (cm)", type: "number", min: 40 },
      { name: "age", label: "Age (years)", type: "number", min: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "BMI Percentile", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pediatric bmi?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
