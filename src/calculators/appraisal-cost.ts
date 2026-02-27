import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const appraisalCostCalculator: CalculatorDefinition = {
  slug: "appraisal-cost",
  title: "Appraisal Cost Calculator",
  description: "Free appraisal cost calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["appraisal cost calculator"],
  variants: [{
    id: "standard",
    name: "Appraisal Cost",
    description: "",
    fields: [
      { name: "homeValue", label: "Home Value ($)", type: "number", min: 50000 },
      { name: "complexity", label: "Complexity (1-3)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Appraisal Fee ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate appraisal cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
