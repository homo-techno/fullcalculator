import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const watchCollectionCalculator: CalculatorDefinition = {
  slug: "watch-collection-calculator",
  title: "Watch Collection Calculator",
  description: "Calculate watch collection costs and expenses. Free online watch collection calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["watch value calculator"],
  variants: [{
    id: "standard",
    name: "Watch Collection",
    description: "",
    fields: [
      { name: "watches", label: "Number of Watches", type: "number", min: 1 },
      { name: "avgValue", label: "Avg Value ($)", type: "number", defaultValue: 500 },
      { name: "appreciation", label: "Annual Appreciation %", type: "number", defaultValue: 3 },
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
    { question: "How much does watch collection cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect watch collection cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
