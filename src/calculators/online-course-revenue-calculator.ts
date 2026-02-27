import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const onlineCourseRevenueCalculator: CalculatorDefinition = {
  slug: "online-course-revenue-calculator",
  title: "Online Course Revenue Calculator",
  description: "Free online course revenue calculator. Calculate online course revenue quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["course revenue calculator"],
  variants: [{
    id: "standard",
    name: "Online Course Revenue",
    description: "",
    fields: [
      { name: "students", label: "Students", type: "number", min: 1 },
      { name: "price", label: "Course Price ($)", type: "number", min: 1 },
      { name: "refundRate", label: "Refund Rate %", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Net Revenue", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate online course revenue?", answer: "Enter values and get instant results." },
    { question: "Why use this online course revenue calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
