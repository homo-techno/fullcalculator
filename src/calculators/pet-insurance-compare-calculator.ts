import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petInsuranceCompareCalculator: CalculatorDefinition = {
  slug: "pet-insurance-compare-calculator",
  title: "Pet Insurance Calculator",
  description: "Calculate pet insurance costs and expenses. Free online pet insurance calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pet insurance calculator"],
  variants: [{
    id: "standard",
    name: "Pet Insurance",
    description: "",
    fields: [
      { name: "age", label: "Pet Age (years)", type: "number", min: 0 },
      { name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", defaultValue: 50 },
      { name: "deductible", label: "Annual Deductible ($)", type: "number", defaultValue: 250 },
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
    { question: "How much does pet insurance cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect pet insurance cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
