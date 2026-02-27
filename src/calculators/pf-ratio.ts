import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pfRatioCalculator: CalculatorDefinition = {
  slug: "pf-ratio",
  title: "P/F Ratio Calculator",
  description: "Free p/f ratio calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pf ratio calculator", "ards"],
  variants: [{
    id: "standard",
    name: "P/F Ratio",
    description: "",
    fields: [
      { name: "pao2", label: "PaO2 (mmHg)", type: "number", min: 1 },
      { name: "fio2", label: "FiO2 (decimal)", type: "number", min: 0.21, max: 1, step: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "P/F Ratio", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate p/f ratio?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "P/F = PaO2 / FiO2",
};
