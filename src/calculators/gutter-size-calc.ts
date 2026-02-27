import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterSizeCalcCalculator: CalculatorDefinition = {
  slug: "gutter-size-calc",
  title: "Gutter Size Calculator",
  description: "Free gutter size calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter size calculator"],
  variants: [{
    id: "standard",
    name: "Gutter Size",
    description: "",
    fields: [
      { name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100 },
      { name: "rainfall", label: "Max Rainfall (in/hr)", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gutter Size (in)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gutter size?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
