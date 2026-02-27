import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hvacLoadCalculator: CalculatorDefinition = {
  slug: "hvac-load",
  title: "HVAC Load Calculator",
  description: "Free hvac load calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hvac load calculator"],
  variants: [{
    id: "standard",
    name: "HVAC Load",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 100 },
      { name: "climate", label: "Climate Zone (1-5)", type: "number", defaultValue: 3 },
      { name: "insulation", label: "Insulation (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "BTU/hr", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hvac load?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
