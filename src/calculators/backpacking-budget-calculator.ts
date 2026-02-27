import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backpackingBudgetCalculator: CalculatorDefinition = {
  slug: "backpacking-budget-calculator",
  title: "Backpacking Budget Calculator",
  description: "Calculate backpacking budget costs and expenses. Free online backpacking budget calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backpacking budget"],
  variants: [{
    id: "standard",
    name: "Backpacking Budget",
    description: "",
    fields: [
      { name: "days", label: "Days", type: "number", min: 1 },
      { name: "dailyBudget", label: "Daily Budget ($)", type: "number", defaultValue: 50 },
      { name: "flights", label: "Flight Cost ($)", type: "number", defaultValue: 500 },
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
    { question: "How much does backpacking budget cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect backpacking budget cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
