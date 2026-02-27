import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yurtCostCalculator: CalculatorDefinition = {
  slug: "yurt-cost-calculator",
  title: "Yurt Cost Calculator",
  description: "Calculate yurt cost costs and expenses. Free online yurt cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["yurt cost calculator"],
  variants: [{
    id: "standard",
    name: "Yurt Cost",
    description: "",
    fields: [
      { name: "diameter", label: "Diameter (ft)", type: "number", min: 10 },
      { name: "walls", label: "Wall Height (ft)", type: "number", defaultValue: 7 },
      { name: "insulated", label: "Insulation Grade", type: "number", defaultValue: 1 },
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
    { question: "How much does yurt cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect yurt cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
