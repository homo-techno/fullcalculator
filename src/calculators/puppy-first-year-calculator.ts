import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const puppyFirstYearCalculator: CalculatorDefinition = {
  slug: "puppy-first-year-calculator",
  title: "Puppy First Year Calculator",
  description: "Calculate puppy first year costs and expenses. Free online puppy first year calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["puppy cost calculator"],
  variants: [{
    id: "standard",
    name: "Puppy First Year",
    description: "",
    fields: [
      { name: "purchase", label: "Purchase/Adoption ($)", type: "number", defaultValue: 1000 },
      { name: "vet", label: "Vet Visits ($)", type: "number", defaultValue: 500 },
      { name: "supplies", label: "Supplies ($)", type: "number", defaultValue: 300 },
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
    { question: "How much does puppy first year cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect puppy first year cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
