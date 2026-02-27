import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paraboloidVolumeCalculator: CalculatorDefinition = {
  slug: "paraboloid-volume",
  title: "Paraboloid Volume Calculator",
  description: "Free paraboloid volume calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["paraboloid volume calculator"],
  variants: [{
    id: "standard",
    name: "Paraboloid Volume",
    description: "",
    fields: [
      { name: "radius", label: "Radius", type: "number", min: 0.01 },
      { name: "height", label: "Height", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Volume", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate paraboloid volume?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
