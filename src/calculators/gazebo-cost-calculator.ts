import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gazeboCostCalculator: CalculatorDefinition = {
  slug: "gazebo-cost-calculator",
  title: "Gazebo Cost Calculator",
  description: "Calculate gazebo cost costs and expenses. Free online gazebo cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gazebo cost calculator"],
  variants: [{
    id: "standard",
    name: "Gazebo Cost",
    description: "",
    fields: [
      { name: "size", label: "Size (ft diameter)", type: "number", min: 6 },
      { name: "material", label: "Material Cost ($)", type: "number", defaultValue: 3000 },
      { name: "install", label: "Install Cost ($)", type: "number", defaultValue: 2000 },
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
    { question: "How much does gazebo cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect gazebo cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
