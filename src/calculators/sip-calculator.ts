import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sipCalculator: CalculatorDefinition = {
  slug: "sip-calculator",
  title: "SIP Calculator Calculator",
  description: "Free sip calculator calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sip calculator", "systematic investment plan"],
  variants: [{
    id: "standard",
    name: "SIP Calculator",
    description: "",
    fields: [
      { name: "monthly", label: "Monthly Investment ($)", type: "number", min: 1 },
      { name: "rate", label: "Expected Return %", type: "number", defaultValue: 12 },
      { name: "years", label: "Years", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Future Value ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sip calculator?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
