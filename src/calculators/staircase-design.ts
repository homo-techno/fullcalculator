import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const staircaseDesignCalculator: CalculatorDefinition = {
  slug: "staircase-design",
  title: "Staircase Design Calculator",
  description: "Free staircase design calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["staircase calculator"],
  variants: [{
    id: "standard",
    name: "Staircase Design",
    description: "",
    fields: [
      { name: "totalRise", label: "Total Rise (in)", type: "number", min: 12 },
      { name: "riserHeight", label: "Riser Height (in)", type: "number", defaultValue: 7.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Number of Steps", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate staircase design?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
