import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const henrysLawCalculator: CalculatorDefinition = {
  slug: "henrys-law",
  title: "Henry Law Calculator",
  description: "Free henry law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["henry law calculator"],
  variants: [{
    id: "standard",
    name: "Henry Law",
    description: "",
    fields: [
      { name: "kh", label: "Henry Constant (M/atm)", type: "number", min: 0.001 },
      { name: "pressure", label: "Partial Pressure (atm)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Concentration (M)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate henry law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
