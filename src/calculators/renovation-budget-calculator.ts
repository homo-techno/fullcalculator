import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const renovationBudgetCalculator: CalculatorDefinition = {
  slug: "renovation-budget-calculator",
  title: "Renovation Budget Calculator",
  description: "Calculate renovation budget costs and expenses. Free online renovation budget calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["renovation cost"],
  variants: [{
    id: "standard",
    name: "Renovation Budget",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 50 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 100 },
      { name: "contingency", label: "Contingency %", type: "number", defaultValue: 15 },
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
    { question: "How much does renovation budget cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect renovation budget cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
