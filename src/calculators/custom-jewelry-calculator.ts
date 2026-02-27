import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const customJewelryCalculator: CalculatorDefinition = {
  slug: "custom-jewelry-calculator",
  title: "Custom Jewelry Calculator",
  description: "Calculate custom jewelry costs and expenses. Free online custom jewelry calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["custom jewelry cost"],
  variants: [{
    id: "standard",
    name: "Custom Jewelry",
    description: "",
    fields: [
      { name: "metalCost", label: "Metal Cost ($)", type: "number", min: 10 },
      { name: "stones", label: "Stone Cost ($)", type: "number", defaultValue: 200 },
      { name: "labor", label: "Labor ($)", type: "number", defaultValue: 150 },
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
    { question: "How much does custom jewelry cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect custom jewelry cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
