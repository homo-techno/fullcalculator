import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paintingCostCalculator: CalculatorDefinition = {
  slug: "painting-cost-calculator",
  title: "Interior Painting Calculator",
  description: "Calculate interior painting costs and expenses. Free online interior painting calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["painting cost calculator"],
  variants: [{
    id: "standard",
    name: "Interior Painting",
    description: "",
    fields: [
      { name: "rooms", label: "Rooms", type: "number", min: 1 },
      { name: "costPerRoom", label: "Cost/Room ($)", type: "number", defaultValue: 400 },
      { name: "paint", label: "Paint Cost ($)", type: "number", defaultValue: 50 },
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
    { question: "How much does interior painting cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect interior painting cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
