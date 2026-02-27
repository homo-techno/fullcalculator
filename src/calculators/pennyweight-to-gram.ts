import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pennyweightToGramCalculator: CalculatorDefinition = {
  slug: "pennyweight-to-gram",
  title: "Pennyweight to Gram Calculator",
  description: "Free pennyweight to gram calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pennyweight to gram"],
  variants: [{
    id: "standard",
    name: "Pennyweight to Gram",
    description: "",
    fields: [
      { name: "dwt", label: "Pennyweights", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Grams", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pennyweight to gram?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
