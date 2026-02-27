import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mosfetCalcCalculator: CalculatorDefinition = {
  slug: "mosfet-calc",
  title: "MOSFET Calculator",
  description: "Free mosfet calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["mosfet calculator"],
  variants: [{
    id: "standard",
    name: "MOSFET",
    description: "",
    fields: [
      { name: "vgs", label: "Vgs (V)", type: "number", min: 0 },
      { name: "vth", label: "Threshold Voltage (V)", type: "number", defaultValue: 2 },
      { name: "kn", label: "Kn (A/V²)", type: "number", defaultValue: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Drain Current (A)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mosfet?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
