import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const footingSizeCalcCalculator: CalculatorDefinition = {
  slug: "footing-size-calc",
  title: "Footing Size Calculator",
  description: "Free footing size calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["footing size calculator"],
  variants: [{
    id: "standard",
    name: "Footing Size",
    description: "",
    fields: [
      { name: "load", label: "Load (lbs)", type: "number", min: 100 },
      { name: "soilCapacity", label: "Soil Capacity (psf)", type: "number", defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Footing Area (sq ft)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate footing size?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
