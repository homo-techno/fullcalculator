import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dilutionEquationCalculator: CalculatorDefinition = {
  slug: "dilution-equation",
  title: "Dilution Equation Calculator",
  description: "Free dilution equation calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["dilution calculator", "C1V1=C2V2"],
  variants: [{
    id: "standard",
    name: "Dilution Equation",
    description: "",
    fields: [
      { name: "c1", label: "C1 (M)", type: "number", min: 0.001 },
      { name: "v1", label: "V1 (mL)", type: "number", min: 0.01 },
      { name: "c2", label: "C2 (M)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "V2 (mL)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dilution equation?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "C1V1 = C2V2",
};
