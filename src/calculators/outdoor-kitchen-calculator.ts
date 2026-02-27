import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const outdoorKitchenCalculator: CalculatorDefinition = {
  slug: "outdoor-kitchen-calculator",
  title: "Outdoor Kitchen Calculator",
  description: "Calculate outdoor kitchen costs and expenses. Free online outdoor kitchen calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["outdoor kitchen cost"],
  variants: [{
    id: "standard",
    name: "Outdoor Kitchen",
    description: "",
    fields: [
      { name: "grill", label: "Grill Cost ($)", type: "number", defaultValue: 2000 },
      { name: "counter", label: "Counter Cost ($)", type: "number", defaultValue: 3000 },
      { name: "plumbing", label: "Plumbing ($)", type: "number", defaultValue: 1500 },
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
    { question: "How much does outdoor kitchen cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect outdoor kitchen cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
