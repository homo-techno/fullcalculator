import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dressAlterationCalculator: CalculatorDefinition = {
  slug: "dress-alteration-calculator",
  title: "Dress Alteration Calculator",
  description: "Calculate dress alteration with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["alteration calculator"],
  variants: [{
    id: "standard",
    name: "Dress Alteration",
    description: "",
    fields: [
      { name: "bust", label: "Bust (in)", type: "number", min: 20 },
      { name: "waist", label: "Waist (in)", type: "number", min: 15 },
      { name: "hip", label: "Hip (in)", type: "number", min: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Alteration Needed (in)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dress alteration?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good dress alteration?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
