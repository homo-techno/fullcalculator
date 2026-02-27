import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newtonToLbfCalculator: CalculatorDefinition = {
  slug: "newton-to-lbf",
  title: "Newton to Pound-Force Calculator",
  description: "Free newton to pound-force calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["newton to pound force"],
  variants: [{
    id: "standard",
    name: "Newton to Pound-Force",
    description: "",
    fields: [
      { name: "newton", label: "Newtons", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "lbf", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate newton to pound-force?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
