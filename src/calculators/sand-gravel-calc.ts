import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sandGravelCalcCalculator: CalculatorDefinition = {
  slug: "sand-gravel-calc",
  title: "Sand and Gravel Calculator",
  description: "Free sand and gravel calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sand gravel calculator"],
  variants: [{
    id: "standard",
    name: "Sand and Gravel",
    description: "",
    fields: [
      { name: "length", label: "Length (ft)", type: "number", min: 0.5 },
      { name: "width", label: "Width (ft)", type: "number", min: 0.5 },
      { name: "depth", label: "Depth (in)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tons Needed", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sand and gravel?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
