import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const archeryArrowSpineCalculator: CalculatorDefinition = {
  slug: "archery-arrow-spine-calculator",
  title: "Arrow Spine Calculator",
  description: "Calculate arrow spine with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["arrow spine calculator"],
  variants: [{
    id: "standard",
    name: "Arrow Spine",
    description: "",
    fields: [
      { name: "drawWeight", label: "Draw Weight (lbs)", type: "number", min: 10 },
      { name: "drawLength", label: "Draw Length (in)", type: "number", min: 20 },
      { name: "arrowLength", label: "Arrow Length (in)", type: "number", min: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Spine Rating", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate arrow spine?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good arrow spine?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
