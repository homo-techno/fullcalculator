import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vectorAngleCalculator: CalculatorDefinition = {
  slug: "vector-angle",
  title: "Vector Angle Calculator",
  description: "Free vector angle calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["angle between vectors"],
  variants: [{
    id: "standard",
    name: "Vector Angle",
    description: "",
    fields: [
      { name: "x1", label: "x1", type: "number" },
      { name: "y1", label: "y1", type: "number" },
      { name: "x2", label: "x2", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Angle (°)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate vector angle?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
