import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roofReplacementCalculator: CalculatorDefinition = {
  slug: "roof-replacement-calculator",
  title: "Roof Replacement Calculator",
  description: "Calculate roof replacement costs and expenses. Free online roof replacement calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["roof replacement cost"],
  variants: [{
    id: "standard",
    name: "Roof Replacement",
    description: "",
    fields: [
      { name: "sqft", label: "Roof Area (sq ft)", type: "number", min: 100 },
      { name: "costPerSqft", label: "Cost/SqFt ($)", type: "number", defaultValue: 7 },
      { name: "removal", label: "Removal ($)", type: "number", defaultValue: 1500 },
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
    { question: "How much does roof replacement cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect roof replacement cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
