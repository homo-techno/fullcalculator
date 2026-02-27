import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scholarshipChanceCalculator: CalculatorDefinition = {
  slug: "scholarship-chance-calculator",
  title: "Scholarship Odds Calculator",
  description: "Calculate scholarship odds with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["scholarship calculator"],
  variants: [{
    id: "standard",
    name: "Scholarship Odds",
    description: "",
    fields: [
      { name: "gpa", label: "GPA", type: "number", min: 0, max: 4 },
      { name: "applicants", label: "Applicants", type: "number", min: 1 },
      { name: "awards", label: "Awards Available", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Acceptance %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate scholarship odds?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good scholarship odds?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
