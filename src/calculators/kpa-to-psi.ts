import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kpaToPsiCalculator: CalculatorDefinition = {
  slug: "kpa-to-psi",
  title: "kPa to PSI Calculator",
  description: "Free kpa to psi calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["kpa to psi converter"],
  variants: [{
    id: "standard",
    name: "kPa to PSI",
    description: "",
    fields: [
      { name: "kpa", label: "kPa", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PSI", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate kpa to psi?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
