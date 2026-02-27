import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fulcrumCalcCalculator: CalculatorDefinition = {
  slug: "fulcrum-calc",
  title: "Fulcrum Calculator",
  description: "Free fulcrum calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fulcrum calculator"],
  variants: [{
    id: "standard",
    name: "Fulcrum",
    description: "",
    fields: [
      { name: "force1", label: "Force 1 (N)", type: "number", min: 0.01 },
      { name: "dist1", label: "Distance 1 (m)", type: "number", min: 0.01 },
      { name: "force2", label: "Force 2 (N)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Distance 2 (m)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fulcrum?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
