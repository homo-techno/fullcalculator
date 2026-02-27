import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydraulicPressCalculator: CalculatorDefinition = {
  slug: "hydraulic-press",
  title: "Hydraulic Press Calculator",
  description: "Free hydraulic press calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["hydraulic press calculator"],
  variants: [{
    id: "standard",
    name: "Hydraulic Press",
    description: "",
    fields: [
      { name: "force1", label: "Input Force (N)", type: "number", min: 0.1 },
      { name: "area1", label: "Small Piston (m²)", type: "number", min: 0.001 },
      { name: "area2", label: "Large Piston (m²)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Output Force (N)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hydraulic press?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
