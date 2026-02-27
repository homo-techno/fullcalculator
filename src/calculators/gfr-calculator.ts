import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gfrCalculator: CalculatorDefinition = {
  slug: "gfr-calculator",
  title: "GFR Calculator",
  description: "Free gfr calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["gfr calculator", "glomerular filtration"],
  variants: [{
    id: "standard",
    name: "GFR",
    description: "",
    fields: [
      { name: "creatinine", label: "Creatinine (mg/dL)", type: "number", min: 0.1, step: 0.1 },
      { name: "age", label: "Age", type: "number", min: 18 },
      { name: "weight", label: "Weight (kg)", type: "number", min: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "eGFR (mL/min)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gfr?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "GFR = (140-Age) × Weight / (72 × Cr)",
};
