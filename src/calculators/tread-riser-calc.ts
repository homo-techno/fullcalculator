import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treadRiserCalcCalculator: CalculatorDefinition = {
  slug: "tread-riser-calc",
  title: "Tread and Riser Calculator",
  description: "Free tread and riser calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tread riser calculator"],
  variants: [{
    id: "standard",
    name: "Tread and Riser",
    description: "",
    fields: [
      { name: "totalRise", label: "Total Rise (in)", type: "number", min: 12 },
      { name: "steps", label: "Number of Steps", type: "number", min: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Riser Height (in)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tread and riser?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
