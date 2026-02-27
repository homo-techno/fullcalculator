import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bearingLifeCalculator: CalculatorDefinition = {
  slug: "bearing-life",
  title: "Bearing Life Calculator",
  description: "Free bearing life calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bearing life calculator"],
  variants: [{
    id: "standard",
    name: "Bearing Life",
    description: "",
    fields: [
      { name: "c", label: "Dynamic Rating (kN)", type: "number", min: 0.1 },
      { name: "p", label: "Load (kN)", type: "number", min: 0.1 },
      { name: "rpm", label: "RPM", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Life (hours)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bearing life?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "L10 = (C/P)^3 × 10^6 / (60×RPM)",
};
