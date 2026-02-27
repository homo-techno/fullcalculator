import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const archimedesPrincipleCalculator: CalculatorDefinition = {
  slug: "archimedes-principle",
  title: "Archimedes Principle Calculator",
  description: "Free archimedes principle calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["archimedes calculator"],
  variants: [{
    id: "standard",
    name: "Archimedes Principle",
    description: "",
    fields: [
      { name: "volume", label: "Displaced Volume (m³)", type: "number", min: 0.001 },
      { name: "density", label: "Fluid Density (kg/m³)", type: "number", defaultValue: 1000 },
      { name: "gravity", label: "Gravity (m/s²)", type: "number", defaultValue: 9.81 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Buoyant Force (N)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate archimedes principle?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
