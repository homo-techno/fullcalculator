import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grashofNumberCalculator: CalculatorDefinition = {
  slug: "grashof-number",
  title: "Grashof Number Calculator",
  description: "Free grashof number calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["grashof number calculator"],
  variants: [{
    id: "standard",
    name: "Grashof Number",
    description: "",
    fields: [
      { name: "beta", label: "β (1/K)", type: "number", defaultValue: 0.003 },
      { name: "deltaT", label: "ΔT (°C)", type: "number", min: 0.1 },
      { name: "length", label: "Length (m)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gr", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate grashof number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
