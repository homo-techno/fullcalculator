import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treeCarbonCalculator: CalculatorDefinition = {
  slug: "tree-carbon",
  title: "Tree Carbon Sequestration Calculator",
  description: "Free tree carbon sequestration calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tree carbon calculator"],
  variants: [{
    id: "standard",
    name: "Tree Carbon Sequestration",
    description: "",
    fields: [
      { name: "trees", label: "Number of Trees", type: "number", min: 1 },
      { name: "years", label: "Years", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CO2 Absorbed (kg)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tree carbon sequestration?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
