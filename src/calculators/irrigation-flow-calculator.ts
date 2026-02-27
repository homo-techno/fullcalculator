import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irrigationFlowCalculator: CalculatorDefinition = {
  slug: "irrigation-flow-calculator",
  title: "Irrigation Flow Calculator",
  description: "Calculate irrigation flow with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["irrigation calculator"],
  variants: [{
    id: "standard",
    name: "Irrigation Flow",
    description: "",
    fields: [
      { name: "area", label: "Area (sq ft)", type: "number", min: 1 },
      { name: "depth", label: "Water Depth (in)", type: "number", defaultValue: 1 },
      { name: "freq", label: "Times/Week", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gallons/Week", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate irrigation flow?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good irrigation flow?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
