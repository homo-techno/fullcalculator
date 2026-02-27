import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bicycleSizeCalculator: CalculatorDefinition = {
  slug: "bicycle-size-calculator",
  title: "Bicycle Size Calculator",
  description: "Calculate bicycle size with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bicycle size calculator"],
  variants: [{
    id: "standard",
    name: "Bicycle Size",
    description: "",
    fields: [
      { name: "height", label: "Height (cm)", type: "number", min: 100 },
      { name: "inseam", label: "Inseam (cm)", type: "number", min: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Frame Size (cm)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bicycle size?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good bicycle size?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
