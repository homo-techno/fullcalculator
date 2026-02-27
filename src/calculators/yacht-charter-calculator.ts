import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yachtCharterCalculator: CalculatorDefinition = {
  slug: "yacht-charter-calculator",
  title: "Yacht Charter Calculator",
  description: "Calculate yacht charter costs and expenses. Free online yacht charter calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["yacht charter cost"],
  variants: [{
    id: "standard",
    name: "Yacht Charter",
    description: "",
    fields: [
      { name: "days", label: "Days", type: "number", min: 1 },
      { name: "dailyRate", label: "Daily Rate ($)", type: "number", defaultValue: 5000 },
      { name: "crew", label: "Crew Cost ($)", type: "number", defaultValue: 1000 },
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
    { question: "How much does yacht charter cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect yacht charter cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
