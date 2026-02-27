import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodTruckStartupCalculator: CalculatorDefinition = {
  slug: "food-truck-startup-calculator",
  title: "Food Truck Startup Calculator",
  description: "Calculate food truck startup costs and expenses. Free online food truck startup calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["food truck cost"],
  variants: [{
    id: "standard",
    name: "Food Truck Startup",
    description: "",
    fields: [
      { name: "truck", label: "Truck Cost ($)", type: "number", defaultValue: 50000 },
      { name: "equipment", label: "Equipment ($)", type: "number", defaultValue: 20000 },
      { name: "permits", label: "Permits ($)", type: "number", defaultValue: 5000 },
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
    { question: "How much does food truck startup cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect food truck startup cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
