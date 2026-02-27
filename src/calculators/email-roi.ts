import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emailRoiCalculator: CalculatorDefinition = {
  slug: "email-roi",
  title: "Email Marketing ROI Calculator",
  description: "Free email marketing roi calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["email roi calculator"],
  variants: [{
    id: "standard",
    name: "Email Marketing ROI",
    description: "",
    fields: [
      { name: "revenue", label: "Revenue ($)", type: "number", min: 0 },
      { name: "cost", label: "Cost ($)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ROI %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate email marketing roi?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
