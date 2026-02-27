import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lbfToNewtonCalculator: CalculatorDefinition = {
  slug: "lbf-to-newton",
  title: "Pound-Force to Newton Calculator",
  description: "Free pound-force to newton calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pound force to newton"],
  variants: [{
    id: "standard",
    name: "Pound-Force to Newton",
    description: "",
    fields: [
      { name: "lbf", label: "Pound-Force", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Newtons", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pound-force to newton?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
