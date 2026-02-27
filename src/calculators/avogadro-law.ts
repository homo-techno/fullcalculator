import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const avogadroLawCalculator: CalculatorDefinition = {
  slug: "avogadro-law",
  title: "Avogadro Law Calculator",
  description: "Free avogadro law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["avogadro law calculator"],
  variants: [{
    id: "standard",
    name: "Avogadro Law",
    description: "",
    fields: [
      { name: "v1", label: "V1 (L)", type: "number", min: 0.001 },
      { name: "n1", label: "n1 (mol)", type: "number", min: 0.001 },
      { name: "n2", label: "n2 (mol)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "V2 (L)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate avogadro law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
