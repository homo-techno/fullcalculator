import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shingleCalcCalculator: CalculatorDefinition = {
  slug: "shingle-calc",
  title: "Shingle Calculator Calculator",
  description: "Free shingle calculator calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shingle calculator"],
  variants: [{
    id: "standard",
    name: "Shingle Calculator",
    description: "",
    fields: [
      { name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100 },
      { name: "waste", label: "Waste Factor %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Bundles Needed", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate shingle calculator?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
