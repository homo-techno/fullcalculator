import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const prandtlNumberCalculator: CalculatorDefinition = {
  slug: "prandtl-number",
  title: "Prandtl Number Calculator",
  description: "Free prandtl number calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["prandtl number calculator"],
  variants: [{
    id: "standard",
    name: "Prandtl Number",
    description: "",
    fields: [
      { name: "cp", label: "Cp (J/kg·K)", type: "number", defaultValue: 4186 },
      { name: "mu", label: "Dynamic Viscosity (Pa·s)", type: "number", defaultValue: 0.001 },
      { name: "k", label: "k (W/m·K)", type: "number", defaultValue: 0.6 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Pr", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate prandtl number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Pr = μCp/k",
};
