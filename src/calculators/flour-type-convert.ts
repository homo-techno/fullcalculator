import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flourTypeConvertCalculator: CalculatorDefinition = {
  slug: "flour-type-convert",
  title: "Flour Type Conversion Calculator",
  description: "Free flour type conversion calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["flour conversion calculator"],
  variants: [{
    id: "standard",
    name: "Flour Type Conversion",
    description: "",
    fields: [
      { name: "amount", label: "Amount (cups)", type: "number", min: 0.25 },
      { name: "from", label: "From (1=AP,2=bread,3=cake)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Converted Amount", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate flour type conversion?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
