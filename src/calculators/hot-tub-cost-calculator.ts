import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hotTubCostCalculator: CalculatorDefinition = {
  slug: "hot-tub-cost-calculator",
  title: "Hot Tub Cost Calculator",
  description: "Calculate hot tub cost costs and expenses. Free online hot tub cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hot tub cost"],
  variants: [{
    id: "standard",
    name: "Hot Tub Cost",
    description: "",
    fields: [
      { name: "price", label: "Purchase Price ($)", type: "number", min: 1000 },
      { name: "install", label: "Installation ($)", type: "number", defaultValue: 2000 },
      { name: "monthly", label: "Monthly Operating ($)", type: "number", defaultValue: 50 },
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
    { question: "How much does hot tub cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect hot tub cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
