import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectQuoteCalculator: CalculatorDefinition = {
  slug: "project-quote-calculator",
  title: "Project Quote Calculator",
  description: "Free project quote calculator. Calculate project quote quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["project quote calculator"],
  variants: [{
    id: "standard",
    name: "Project Quote",
    description: "",
    fields: [
      { name: "hours", label: "Estimated Hours", type: "number", min: 1 },
      { name: "rate", label: "Hourly Rate ($)", type: "number", min: 1 },
      { name: "margin", label: "Margin %", type: "number", defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Project Quote", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate project quote?", answer: "Enter values and get instant results." },
    { question: "Why use this project quote calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
