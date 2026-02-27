import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const complexModulusCalculator: CalculatorDefinition = {
  slug: "complex-modulus",
  title: "Complex Modulus Calculator",
  description: "Free complex modulus calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["complex modulus calculator"],
  variants: [{
    id: "standard",
    name: "Complex Modulus",
    description: "",
    fields: [
      { name: "a", label: "Real Part", type: "number" },
      { name: "b", label: "Imaginary Part", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "|z|", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate complex modulus?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
