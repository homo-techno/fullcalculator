import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jerkyYieldCalculator: CalculatorDefinition = {
  slug: "jerky-yield",
  title: "Jerky Yield Calculator",
  description: "Free jerky yield calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["beef jerky calculator"],
  variants: [{
    id: "standard",
    name: "Jerky Yield",
    description: "",
    fields: [
      { name: "rawMeat", label: "Raw Meat (lbs)", type: "number", min: 0.5 },
      { name: "shrinkage", label: "Shrinkage %", type: "number", defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Jerky Yield (lbs)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate jerky yield?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
