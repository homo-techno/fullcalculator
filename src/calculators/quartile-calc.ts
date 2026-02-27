import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quartileCalcCalculator: CalculatorDefinition = {
  slug: "quartile-calc",
  title: "Quartile Calculator",
  description: "Free quartile calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["quartile calculator"],
  variants: [{
    id: "standard",
    name: "Quartile",
    description: "",
    fields: [
      { name: "n", label: "Data Points", type: "number", min: 4 },
      { name: "q", label: "Quartile (1-3)", type: "number", min: 1, max: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Quartile Value", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate quartile?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
