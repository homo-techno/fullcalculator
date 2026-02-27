import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reptileTankSizeCalculator: CalculatorDefinition = {
  slug: "reptile-tank-size-calculator",
  title: "Reptile Tank Size Calculator",
  description: "Calculate reptile tank size with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["reptile tank calculator"],
  variants: [{
    id: "standard",
    name: "Reptile Tank Size",
    description: "",
    fields: [
      { name: "animalLength", label: "Animal Length (in)", type: "number", min: 3 },
      { name: "multiplier", label: "Tank Multiplier", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tank Size (gal)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate reptile tank size?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good reptile tank size?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
