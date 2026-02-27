import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rollingResistanceCalcCalculator: CalculatorDefinition = {
  slug: "rolling-resistance-calc",
  title: "Rolling Resistance Calculator",
  description: "Free rolling resistance calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rolling resistance calculator"],
  variants: [{
    id: "standard",
    name: "Rolling Resistance",
    description: "",
    fields: [
      { name: "crr", label: "Rolling Coeff", type: "number", defaultValue: 0.015 },
      { name: "mass", label: "Mass (kg)", type: "number", min: 1 },
      { name: "gravity", label: "Gravity (m/s²)", type: "number", defaultValue: 9.81 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Force (N)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rolling resistance?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
