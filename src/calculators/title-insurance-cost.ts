import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const titleInsuranceCostCalculator: CalculatorDefinition = {
  slug: "title-insurance-cost",
  title: "Title Insurance Calculator",
  description: "Free title insurance calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["title insurance calculator"],
  variants: [{
    id: "standard",
    name: "Title Insurance",
    description: "",
    fields: [
      { name: "homePrice", label: "Home Price ($)", type: "number", min: 50000 },
      { name: "rate", label: "Rate per $1000", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Premium ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate title insurance?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
