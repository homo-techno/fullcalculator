import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ergToJouleCalculator: CalculatorDefinition = {
  slug: "erg-to-joule",
  title: "Erg to Joule Calculator",
  description: "Free erg to joule calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["erg to joule"],
  variants: [{
    id: "standard",
    name: "Erg to Joule",
    description: "",
    fields: [
      { name: "erg", label: "Ergs", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Joules", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate erg to joule?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
