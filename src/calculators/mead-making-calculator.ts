import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meadMakingCalculator: CalculatorDefinition = {
  slug: "mead-making-calculator",
  title: "Mead Making Calculator",
  description: "Calculate mead making with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mead calculator", "honey wine"],
  variants: [{
    id: "standard",
    name: "Mead Making",
    description: "",
    fields: [
      { name: "honey", label: "Honey (lbs)", type: "number", min: 1 },
      { name: "water", label: "Water (gallons)", type: "number", min: 1 },
      { name: "yeast", label: "Yeast Packets", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Batch Volume", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mead making?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good mead making?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
