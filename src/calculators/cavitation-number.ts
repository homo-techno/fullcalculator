import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cavitationNumberCalculator: CalculatorDefinition = {
  slug: "cavitation-number",
  title: "Cavitation Number Calculator",
  description: "Free cavitation number calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cavitation number calculator"],
  variants: [{
    id: "standard",
    name: "Cavitation Number",
    description: "",
    fields: [
      { name: "pressure", label: "Reference Pressure (Pa)", type: "number", min: 1 },
      { name: "vapor", label: "Vapor Pressure (Pa)", type: "number", min: 0 },
      { name: "velocity", label: "Velocity (m/s)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "σ", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cavitation number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
