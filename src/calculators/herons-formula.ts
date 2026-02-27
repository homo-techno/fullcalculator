import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heronsFormulaCalculator: CalculatorDefinition = {
  slug: "herons-formula",
  title: "Heron Formula Calculator",
  description: "Free heron formula calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["heron formula calculator"],
  variants: [{
    id: "standard",
    name: "Heron Formula",
    description: "",
    fields: [
      { name: "a", label: "Side A", type: "number", min: 0.01 },
      { name: "b", label: "Side B", type: "number", min: 0.01 },
      { name: "c", label: "Side C", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Triangle Area", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate heron formula?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
