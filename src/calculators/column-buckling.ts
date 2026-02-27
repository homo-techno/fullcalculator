import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const columnBucklingCalculator: CalculatorDefinition = {
  slug: "column-buckling",
  title: "Column Buckling Calculator",
  description: "Free column buckling calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["euler buckling calculator"],
  variants: [{
    id: "standard",
    name: "Column Buckling",
    description: "",
    fields: [
      { name: "e", label: "E (Pa)", type: "number", defaultValue: 200000000000 },
      { name: "i", label: "I (m⁴)", type: "number", min: 1e-10 },
      { name: "length", label: "Length (m)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Critical Load (N)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate column buckling?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Pcr = π²EI/L²",
};
