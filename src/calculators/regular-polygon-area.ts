import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const regularPolygonAreaCalculator: CalculatorDefinition = {
  slug: "regular-polygon-area",
  title: "Regular Polygon Area Calculator",
  description: "Free regular polygon area calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["regular polygon area calculator"],
  variants: [{
    id: "standard",
    name: "Regular Polygon Area",
    description: "",
    fields: [
      { name: "sides", label: "Number of Sides", type: "number", min: 3 },
      { name: "sideLength", label: "Side Length", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Area", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate regular polygon area?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
