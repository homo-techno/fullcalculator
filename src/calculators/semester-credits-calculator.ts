import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const semesterCreditsCalculator: CalculatorDefinition = {
  slug: "semester-credits-calculator",
  title: "Semester Credit Load Calculator",
  description: "Calculate semester credit load with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["credit hour calculator"],
  variants: [{
    id: "standard",
    name: "Semester Credit Load",
    description: "",
    fields: [
      { name: "courses", label: "Courses", type: "number", min: 1 },
      { name: "creditsPerCourse", label: "Credits/Course", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Credits", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate semester credit load?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good semester credit load?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
