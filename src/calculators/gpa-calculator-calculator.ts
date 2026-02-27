import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gpaCalculatorCalculator: CalculatorDefinition = {
  slug: "gpa-calculator-calculator",
  title: "GPA Calculator",
  description: "Calculate gpa with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gpa calculator"],
  variants: [{
    id: "standard",
    name: "GPA",
    description: "",
    fields: [
      { name: "credits", label: "Total Credits", type: "number", min: 1 },
      { name: "qualityPoints", label: "Quality Points", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "GPA", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gpa?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good gpa?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
