import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dcfCalculator: CalculatorDefinition = {
  slug: "dcf-calculator",
  title: "DCF Valuation Calculator",
  description: "Free dcf valuation calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dcf calculator", "discounted cash flow"],
  variants: [{
    id: "standard",
    name: "DCF Valuation",
    description: "",
    fields: [
      { name: "cashFlow", label: "Year 1 Cash Flow ($)", type: "number", min: 1 },
      { name: "growth", label: "Growth Rate %", type: "number", defaultValue: 5 },
      { name: "discount", label: "Discount Rate %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "DCF Value ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dcf valuation?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
