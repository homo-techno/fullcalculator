import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingDressCalculator: CalculatorDefinition = {
  slug: "wedding-dress-calculator",
  title: "Wedding Dress Calculator",
  description: "Calculate wedding dress costs and expenses. Free online wedding dress calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding dress cost"],
  variants: [{
    id: "standard",
    name: "Wedding Dress",
    description: "",
    fields: [
      { name: "dressPrice", label: "Dress Price ($)", type: "number", min: 100 },
      { name: "alterations", label: "Alterations ($)", type: "number", defaultValue: 300 },
      { name: "accessories", label: "Accessories ($)", type: "number", defaultValue: 200 },
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
    { question: "How much does wedding dress cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect wedding dress cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
