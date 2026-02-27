import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lengthContractionCalculator: CalculatorDefinition = {
  slug: "length-contraction",
  title: "Length Contraction Calculator",
  description: "Free length contraction calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["length contraction calculator"],
  variants: [{
    id: "standard",
    name: "Length Contraction",
    description: "",
    fields: [
      { name: "properLength", label: "Proper Length (m)", type: "number", min: 0.001 },
      { name: "velocity", label: "Velocity (m/s)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Contracted Length (m)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate length contraction?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
