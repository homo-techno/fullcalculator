import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weberNumberCalculator: CalculatorDefinition = {
  slug: "weber-number",
  title: "Weber Number Calculator",
  description: "Free weber number calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["weber number calculator"],
  variants: [{
    id: "standard",
    name: "Weber Number",
    description: "",
    fields: [
      { name: "density", label: "Density (kg/m³)", type: "number", defaultValue: 1000 },
      { name: "velocity", label: "Velocity (m/s)", type: "number", min: 0.01 },
      { name: "length", label: "Length (m)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "We", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate weber number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
