import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteVolumeCalculator: CalculatorDefinition = {
  slug: "concrete-volume",
  title: "Concrete Volume Calculator",
  description: "Free concrete volume calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["concrete volume calculator"],
  variants: [{
    id: "standard",
    name: "Concrete Volume",
    description: "",
    fields: [
      { name: "length", label: "Length (ft)", type: "number", min: 0.5 },
      { name: "width", label: "Width (ft)", type: "number", min: 0.5 },
      { name: "depth", label: "Depth (in)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cubic Yards", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate concrete volume?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
