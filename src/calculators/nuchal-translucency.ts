import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nuchalTranslucencyCalculator: CalculatorDefinition = {
  slug: "nuchal-translucency",
  title: "Nuchal Translucency Calculator",
  description: "Free nuchal translucency calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["nuchal translucency calculator"],
  variants: [{
    id: "standard",
    name: "Nuchal Translucency",
    description: "",
    fields: [
      { name: "crl", label: "CRL (mm)", type: "number", min: 45, max: 84 },
      { name: "nt", label: "NT Measurement (mm)", type: "number", min: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Risk Assessment", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate nuchal translucency?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
