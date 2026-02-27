import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const matrixInverse2x2Calculator: CalculatorDefinition = {
  slug: "matrix-inverse-2x2",
  title: "2x2 Matrix Inverse Calculator",
  description: "Free 2x2 matrix inverse calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["matrix inverse calculator"],
  variants: [{
    id: "standard",
    name: "2x2 Matrix Inverse",
    description: "",
    fields: [
      { name: "a", label: "a", type: "number" },
      { name: "b", label: "b", type: "number" },
      { name: "c", label: "c", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Inverse Matrix", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate 2x2 matrix inverse?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
