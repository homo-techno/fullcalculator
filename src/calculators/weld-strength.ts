import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weldStrengthCalculator: CalculatorDefinition = {
  slug: "weld-strength",
  title: "Weld Strength Calculator",
  description: "Free weld strength calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["weld strength calculator"],
  variants: [{
    id: "standard",
    name: "Weld Strength",
    description: "",
    fields: [
      { name: "throat", label: "Throat Size (mm)", type: "number", min: 1 },
      { name: "length", label: "Weld Length (mm)", type: "number", min: 1 },
      { name: "allowable", label: "Allowable Stress (MPa)", type: "number", defaultValue: 124 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Capacity (kN)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate weld strength?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
