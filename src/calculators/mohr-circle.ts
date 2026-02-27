import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mohrCircleCalculator: CalculatorDefinition = {
  slug: "mohr-circle",
  title: "Mohr Circle Calculator",
  description: "Free mohr circle calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["mohr circle calculator"],
  variants: [{
    id: "standard",
    name: "Mohr Circle",
    description: "",
    fields: [
      { name: "sigmaX", label: "σx (Pa)", type: "number" },
      { name: "sigmaY", label: "σy (Pa)", type: "number" },
      { name: "tauXY", label: "τxy (Pa)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Max Shear (Pa)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mohr circle?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
