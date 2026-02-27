import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const classGradeCalculator: CalculatorDefinition = {
  slug: "class-grade-calculator",
  title: "Class Grade Calculator",
  description: "Calculate class grade with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["class grade calculator"],
  variants: [{
    id: "standard",
    name: "Class Grade",
    description: "",
    fields: [
      { name: "earned", label: "Points Earned", type: "number", min: 0 },
      { name: "total", label: "Total Points", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Grade %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate class grade?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good class grade?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
