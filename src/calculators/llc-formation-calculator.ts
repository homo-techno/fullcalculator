import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llcFormationCalculator: CalculatorDefinition = {
  slug: "llc-formation-calculator",
  title: "LLC Formation Calculator",
  description: "Calculate llc formation costs and expenses. Free online llc formation calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["llc cost calculator"],
  variants: [{
    id: "standard",
    name: "LLC Formation",
    description: "",
    fields: [
      { name: "stateFee", label: "State Filing Fee ($)", type: "number", defaultValue: 100 },
      { name: "agent", label: "Registered Agent ($)", type: "number", defaultValue: 100 },
      { name: "legal", label: "Legal Fees ($)", type: "number", defaultValue: 500 },
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
    { question: "How much does llc formation cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect llc formation cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
