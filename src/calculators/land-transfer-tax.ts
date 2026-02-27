import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landTransferTaxCalculator: CalculatorDefinition = {
  slug: "land-transfer-tax",
  title: "Land Transfer Tax Calculator",
  description: "Free land transfer tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["land transfer tax calculator"],
  variants: [{
    id: "standard",
    name: "Land Transfer Tax",
    description: "",
    fields: [
      { name: "price", label: "Price ($)", type: "number", min: 10000 },
      { name: "rate", label: "Rate %", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "LTT ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate land transfer tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
