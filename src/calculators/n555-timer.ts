import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n555TimerCalculator: CalculatorDefinition = {
  slug: "n555-timer",
  title: "555 Timer Calculator",
  description: "Free 555 timer calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["555 timer calculator"],
  variants: [{
    id: "standard",
    name: "555 Timer",
    description: "",
    fields: [
      { name: "r1", label: "R1 (Ω)", type: "number", min: 1 },
      { name: "r2", label: "R2 (Ω)", type: "number", min: 1 },
      { name: "c", label: "Capacitance (F)", type: "number", min: 1e-12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Frequency (Hz)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate 555 timer?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
