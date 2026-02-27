import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yieldToCallCalculator: CalculatorDefinition = {
  slug: "yield-to-call",
  title: "Yield to Call Calculator",
  description: "Free yield to call calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["yield to call calculator"],
  variants: [{
    id: "standard",
    name: "Yield to Call",
    description: "",
    fields: [
      { name: "price", label: "Current Price ($)", type: "number", min: 1 },
      { name: "callPrice", label: "Call Price ($)", type: "number", min: 1 },
      { name: "coupon", label: "Annual Coupon ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "YTC %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate yield to call?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
