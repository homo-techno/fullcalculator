import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lorentzForceCalculator: CalculatorDefinition = {
  slug: "lorentz-force",
  title: "Lorentz Force Calculator",
  description: "Free lorentz force calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lorentz force calculator"],
  variants: [{
    id: "standard",
    name: "Lorentz Force",
    description: "",
    fields: [
      { name: "charge", label: "Charge (C)", type: "number", min: 1e-20 },
      { name: "velocity", label: "Velocity (m/s)", type: "number", min: 0 },
      { name: "bField", label: "Magnetic Field (T)", type: "number", min: 0 },
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
    { question: "How to calculate lorentz force?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
