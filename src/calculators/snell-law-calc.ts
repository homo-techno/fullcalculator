import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snellLawCalcCalculator: CalculatorDefinition = {
  slug: "snell-law-calc",
  title: "Snell Law Calculator",
  description: "Free snell law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["snell law calculator"],
  variants: [{
    id: "standard",
    name: "Snell Law",
    description: "",
    fields: [
      { name: "n1", label: "n1 (refractive index)", type: "number", defaultValue: 1 },
      { name: "theta1", label: "Angle 1 (°)", type: "number", min: 0, max: 89 },
      { name: "n2", label: "n2", type: "number", defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Angle 2 (°)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate snell law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
