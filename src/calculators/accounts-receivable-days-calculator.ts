import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const accountsReceivableDaysCalculator: CalculatorDefinition = {
  slug: "accounts-receivable-days-calculator",
  title: "AR Days Calculator",
  description: "Calculate ar days with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["accounts receivable days"],
  variants: [{
    id: "standard",
    name: "AR Days",
    description: "",
    fields: [
      { name: "ar", label: "Accounts Receivable ($)", type: "number", min: 1 },
      { name: "revenue", label: "Annual Revenue ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Days", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ar days?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good ar days?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
