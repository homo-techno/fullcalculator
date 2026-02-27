import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gaussLawCalcCalculator: CalculatorDefinition = {
  slug: "gauss-law-calc",
  title: "Gauss Law Calculator",
  description: "Free gauss law calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gauss law calculator"],
  variants: [{
    id: "standard",
    name: "Gauss Law",
    description: "",
    fields: [
      { name: "charge", label: "Enclosed Charge (C)", type: "number" },
      { name: "permittivity", label: "Permittivity", type: "number", defaultValue: 8.854e-12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Electric Flux", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gauss law?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
