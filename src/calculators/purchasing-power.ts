import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const purchasingPowerCalculator: CalculatorDefinition = {
  slug: "purchasing-power",
  title: "Purchasing Power Calculator",
  description: "Free purchasing power calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["purchasing power calculator"],
  variants: [{
    id: "standard",
    name: "Purchasing Power",
    description: "",
    fields: [
      { name: "amount", label: "Amount ($)", type: "number", min: 0.01 },
      { name: "years", label: "Years Ago", type: "number", min: 1 },
      { name: "avgInflation", label: "Avg Inflation %", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Equivalent Today ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate purchasing power?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
