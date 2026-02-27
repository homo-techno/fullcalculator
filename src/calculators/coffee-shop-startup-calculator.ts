import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coffeeShopStartupCalculator: CalculatorDefinition = {
  slug: "coffee-shop-startup-calculator",
  title: "Coffee Shop Startup Calculator",
  description: "Calculate coffee shop startup costs and expenses. Free online coffee shop startup calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["coffee shop cost"],
  variants: [{
    id: "standard",
    name: "Coffee Shop Startup",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 200 },
      { name: "equipment", label: "Equipment ($)", type: "number", defaultValue: 30000 },
      { name: "inventory", label: "Initial Inventory ($)", type: "number", defaultValue: 5000 },
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
    { question: "How much does coffee shop startup cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect coffee shop startup cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
