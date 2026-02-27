import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const droneBuildCalculator: CalculatorDefinition = {
  slug: "drone-build-calculator",
  title: "Drone Build Calculator",
  description: "Calculate drone build costs and expenses. Free online drone build calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["drone build cost"],
  variants: [{
    id: "standard",
    name: "Drone Build",
    description: "",
    fields: [
      { name: "frame", label: "Frame ($)", type: "number", defaultValue: 50 },
      { name: "motors", label: "Motors x4 ($)", type: "number", defaultValue: 80 },
      { name: "fc", label: "Flight Controller ($)", type: "number", defaultValue: 40 },
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
    { question: "How much does drone build cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect drone build cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
