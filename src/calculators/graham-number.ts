import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grahamNumberCalculator: CalculatorDefinition = {
  slug: "graham-number",
  title: "Graham Number Calculator",
  description: "Free graham number calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["graham number calculator"],
  variants: [{
    id: "standard",
    name: "Graham Number",
    description: "",
    fields: [
      { name: "eps", label: "EPS ($)", type: "number", min: 0.01 },
      { name: "bookValue", label: "Book Value/Share ($)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Graham Number ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate graham number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "√(22.5 × EPS × BVPS)",
};
