import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saasArrCalculator: CalculatorDefinition = {
  slug: "saas-arr",
  title: "SaaS ARR Calculator",
  description: "Free saas arr calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["arr calculator"],
  variants: [{
    id: "standard",
    name: "SaaS ARR",
    description: "",
    fields: [
      { name: "mrr", label: "MRR ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ARR ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate saas arr?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "ARR = MRR × 12",
};
