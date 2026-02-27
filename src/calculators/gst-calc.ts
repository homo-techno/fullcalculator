import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gstCalcCalculator: CalculatorDefinition = {
  slug: "gst-calc",
  title: "GST Calculator Calculator",
  description: "Free gst calculator calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gst calculator"],
  variants: [{
    id: "standard",
    name: "GST Calculator",
    description: "",
    fields: [
      { name: "amount", label: "Amount ($)", type: "number", min: 0.01 },
      { name: "gstRate", label: "GST Rate %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Inc GST ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gst calculator?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
