import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studyAbroadCalculator: CalculatorDefinition = {
  slug: "study-abroad-calculator",
  title: "Study Abroad Calculator",
  description: "Calculate study abroad costs and expenses. Free online study abroad calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["study abroad cost"],
  variants: [{
    id: "standard",
    name: "Study Abroad",
    description: "",
    fields: [
      { name: "tuition", label: "Tuition ($)", type: "number", defaultValue: 15000 },
      { name: "housing", label: "Housing ($)", type: "number", defaultValue: 8000 },
      { name: "living", label: "Living Expenses ($)", type: "number", defaultValue: 5000 },
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
    { question: "How much does study abroad cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect study abroad cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
