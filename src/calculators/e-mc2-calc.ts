import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eMc2CalcCalculator: CalculatorDefinition = {
  slug: "e-mc2-calc",
  title: "E=mc² Energy Calculator",
  description: "Free e=mc² energy calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["e mc2 calculator", "mass energy"],
  variants: [{
    id: "standard",
    name: "E=mc² Energy",
    description: "",
    fields: [
      { name: "mass", label: "Mass (kg)", type: "number", min: 1e-30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Energy (J)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate e=mc² energy?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "E = mc²",
};
