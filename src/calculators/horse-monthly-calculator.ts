import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horseMonthlyCalculator: CalculatorDefinition = {
  slug: "horse-monthly-calculator",
  title: "Horse Monthly Cost Calculator",
  description: "Calculate horse monthly cost costs and expenses. Free online horse monthly cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["horse monthly cost"],
  variants: [{
    id: "standard",
    name: "Horse Monthly Cost",
    description: "",
    fields: [
      { name: "board", label: "Board/Month ($)", type: "number", defaultValue: 800 },
      { name: "feed", label: "Feed/Month ($)", type: "number", defaultValue: 200 },
      { name: "farrier", label: "Farrier/Month ($)", type: "number", defaultValue: 100 },
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
    { question: "How much does horse monthly cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect horse monthly cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
