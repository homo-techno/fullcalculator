import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inductorEnergyCalculator: CalculatorDefinition = {
  slug: "inductor-energy-calculator",
  title: "Inductor Energy Calculator",
  description: "Calculate inductor energy with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["inductor energy"],
  variants: [{
    id: "standard",
    name: "Inductor Energy",
    description: "",
    fields: [
      { name: "inductance", label: "Inductance (H)", type: "number", min: 0.001 },
      { name: "current", label: "Current (A)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Energy (J)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate inductor energy?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good inductor energy?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
