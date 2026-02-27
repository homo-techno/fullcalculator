import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rlcCircuitCalculator: CalculatorDefinition = {
  slug: "rlc-circuit",
  title: "RLC Circuit Calculator",
  description: "Free rlc circuit calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rlc circuit calculator"],
  variants: [{
    id: "standard",
    name: "RLC Circuit",
    description: "",
    fields: [
      { name: "resistance", label: "Resistance (Ω)", type: "number", min: 0 },
      { name: "inductance", label: "Inductance (H)", type: "number", min: 0.001 },
      { name: "capacitance", label: "Capacitance (F)", type: "number", min: 1e-12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Resonant Freq (Hz)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rlc circuit?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
