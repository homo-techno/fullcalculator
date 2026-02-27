import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeApplicationCalculator: CalculatorDefinition = {
  slug: "college-application-calculator",
  title: "College Application Calculator",
  description: "Calculate college application costs and expenses. Free online college application calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["college application cost"],
  variants: [{
    id: "standard",
    name: "College Application",
    description: "",
    fields: [
      { name: "schools", label: "Schools", type: "number", min: 1 },
      { name: "feePerSchool", label: "Fee/School ($)", type: "number", defaultValue: 75 },
      { name: "testScores", label: "Score Sends ($)", type: "number", defaultValue: 30 },
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
    { question: "How much does college application cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect college application cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
