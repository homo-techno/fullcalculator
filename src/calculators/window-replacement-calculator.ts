import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowReplacementCalculator: CalculatorDefinition = {
  slug: "window-replacement-calculator",
  title: "Window Replacement Calculator",
  description: "Calculate window replacement costs and expenses. Free online window replacement calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["window replacement cost"],
  variants: [{
    id: "standard",
    name: "Window Replacement",
    description: "",
    fields: [
      { name: "windows", label: "Number of Windows", type: "number", min: 1 },
      { name: "costPerWindow", label: "Cost/Window ($)", type: "number", defaultValue: 500 },
      { name: "install", label: "Install/Window ($)", type: "number", defaultValue: 200 },
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
    { question: "How much does window replacement cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect window replacement cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
