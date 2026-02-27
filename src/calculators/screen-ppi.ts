import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const screenPpiCalculator: CalculatorDefinition = {
  slug: "screen-ppi",
  title: "Screen PPI Calculator",
  description: "Free screen ppi calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["screen ppi calculator"],
  variants: [{
    id: "standard",
    name: "Screen PPI",
    description: "",
    fields: [
      { name: "width", label: "Width (px)", type: "number", min: 100 },
      { name: "height", label: "Height (px)", type: "number", min: 100 },
      { name: "diagonal", label: "Diagonal (in)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PPI", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate screen ppi?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
