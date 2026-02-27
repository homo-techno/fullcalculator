import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const climbingGradeCalculator: CalculatorDefinition = {
  slug: "climbing-grade",
  title: "Climbing Grade Calculator",
  description: "Free climbing grade calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["climbing grade calculator"],
  variants: [{
    id: "standard",
    name: "Climbing Grade",
    description: "",
    fields: [
      { name: "height", label: "Route Height (m)", type: "number", min: 5 },
      { name: "difficulty", label: "Difficulty (1-15)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Grade", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate climbing grade?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
