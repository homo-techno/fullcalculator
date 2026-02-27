import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cpmCalcCalculator: CalculatorDefinition = {
  slug: "cpm-calc",
  title: "CPM Calculator Calculator",
  description: "Free cpm calculator calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cpm calculator advertising"],
  variants: [{
    id: "standard",
    name: "CPM Calculator",
    description: "",
    fields: [
      { name: "cost", label: "Total Cost ($)", type: "number", min: 0.01 },
      { name: "impressions", label: "Impressions", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CPM ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cpm calculator?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "CPM = Cost/Impressions × 1000",
};
