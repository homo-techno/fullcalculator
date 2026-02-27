import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const urineOutputCalcCalculator: CalculatorDefinition = {
  slug: "urine-output-calc",
  title: "Urine Output Calculator",
  description: "Free urine output calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["urine output calculator"],
  variants: [{
    id: "standard",
    name: "Urine Output",
    description: "",
    fields: [
      { name: "volume", label: "Volume (mL)", type: "number", min: 0 },
      { name: "hours", label: "Hours", type: "number", min: 0.5 },
      { name: "weight", label: "Weight (kg)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "mL/kg/hr", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate urine output?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
