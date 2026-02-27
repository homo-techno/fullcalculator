import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const robotBuildCalculator: CalculatorDefinition = {
  slug: "robot-build-calculator",
  title: "Robot Build Calculator",
  description: "Calculate robot build costs and expenses. Free online robot build calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["robot cost calculator"],
  variants: [{
    id: "standard",
    name: "Robot Build",
    description: "",
    fields: [
      { name: "motors", label: "Motors", type: "number", min: 1 },
      { name: "sensors", label: "Sensors", type: "number", min: 0 },
      { name: "controller", label: "Controller ($)", type: "number", defaultValue: 35 },
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
    { question: "How much does robot build cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect robot build cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
