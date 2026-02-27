import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gapYearCalculator: CalculatorDefinition = {
  slug: "gap-year-calculator",
  title: "Gap Year Calculator",
  description: "Calculate gap year costs and expenses. Free online gap year calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gap year budget"],
  variants: [{
    id: "standard",
    name: "Gap Year",
    description: "",
    fields: [
      { name: "months", label: "Months", type: "number", min: 1 },
      { name: "monthly", label: "Monthly Budget ($)", type: "number", defaultValue: 2000 },
      { name: "flights", label: "Flights ($)", type: "number", defaultValue: 2000 },
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
    { question: "How much does gap year cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect gap year cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
