import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cardiacIndexCalcCalculator: CalculatorDefinition = {
  slug: "cardiac-index-calc",
  title: "Cardiac Index Calculator",
  description: "Free cardiac index calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cardiac index calculator"],
  variants: [{
    id: "standard",
    name: "Cardiac Index",
    description: "",
    fields: [
      { name: "co", label: "Cardiac Output (L/min)", type: "number", min: 1 },
      { name: "bsa", label: "BSA (m²)", type: "number", min: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CI (L/min/m²)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cardiac index?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "CI = CO / BSA",
};
