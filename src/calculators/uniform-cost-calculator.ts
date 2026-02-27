import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uniformCostCalculator: CalculatorDefinition = {
  slug: "uniform-cost-calculator",
  title: "Uniform Cost Calculator",
  description: "Calculate uniform cost costs and expenses. Free online uniform cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["uniform cost calculator"],
  variants: [{
    id: "standard",
    name: "Uniform Cost",
    description: "",
    fields: [
      { name: "employees", label: "Employees", type: "number", min: 1 },
      { name: "setsPerEmployee", label: "Sets/Employee", type: "number", defaultValue: 3 },
      { name: "costPerSet", label: "Cost/Set ($)", type: "number", defaultValue: 75 },
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
    { question: "How much does uniform cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect uniform cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
