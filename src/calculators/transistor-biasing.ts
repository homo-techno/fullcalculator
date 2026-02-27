import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transistorBiasingCalculator: CalculatorDefinition = {
  slug: "transistor-biasing",
  title: "Transistor Biasing Calculator",
  description: "Free transistor biasing calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["transistor biasing calculator"],
  variants: [{
    id: "standard",
    name: "Transistor Biasing",
    description: "",
    fields: [
      { name: "vcc", label: "Vcc (V)", type: "number", min: 1 },
      { name: "beta", label: "Beta (hFE)", type: "number", defaultValue: 100 },
      { name: "rb", label: "Base Resistance (Ω)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Ic (A)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate transistor biasing?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
