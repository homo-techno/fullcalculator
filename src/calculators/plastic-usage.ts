import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plasticUsageCalculator: CalculatorDefinition = {
  slug: "plastic-usage",
  title: "Plastic Usage Calculator",
  description: "Free plastic usage calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["plastic usage calculator"],
  variants: [{
    id: "standard",
    name: "Plastic Usage",
    description: "",
    fields: [
      { name: "bottlesWeek", label: "Bottles/Week", type: "number", min: 0 },
      { name: "bagsWeek", label: "Bags/Week", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Plastic kg/Year", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate plastic usage?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
