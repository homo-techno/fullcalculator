import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petGroomingCalculator: CalculatorDefinition = {
  slug: "pet-grooming-calculator",
  title: "Pet Grooming Calculator",
  description: "Calculate pet grooming costs and expenses. Free online pet grooming calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pet grooming cost"],
  variants: [{
    id: "standard",
    name: "Pet Grooming",
    description: "",
    fields: [
      { name: "visits", label: "Visits/Year", type: "number", min: 1 },
      { name: "costPerVisit", label: "Cost/Visit ($)", type: "number", defaultValue: 60 },
      { name: "extras", label: "Extras ($)", type: "number", defaultValue: 20 },
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
    { question: "How much does pet grooming cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect pet grooming cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
