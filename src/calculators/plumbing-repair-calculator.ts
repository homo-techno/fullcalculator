import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plumbingRepairCalculator: CalculatorDefinition = {
  slug: "plumbing-repair-calculator",
  title: "Plumbing Repair Calculator",
  description: "Calculate plumbing repair costs and expenses. Free online plumbing repair calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["plumbing repair cost"],
  variants: [{
    id: "standard",
    name: "Plumbing Repair",
    description: "",
    fields: [
      { name: "hours", label: "Labor Hours", type: "number", min: 0.5 },
      { name: "rate", label: "Hourly Rate ($)", type: "number", defaultValue: 100 },
      { name: "parts", label: "Parts ($)", type: "number", defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => !x || x <= 0)) return null;
      const result = v.reduce((a, b) => a * b, 1) / (v.length > 2 ? v[v.length-1] : 1);
      return { primary: { label: "Estimated Cost", value: "$" + formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["budget-calculator"],
  faq: [
    { question: "How much does plumbing repair cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect plumbing repair cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
