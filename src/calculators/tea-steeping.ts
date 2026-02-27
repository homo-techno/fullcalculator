import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const teaSteepingCalculator: CalculatorDefinition = {
  slug: "tea-steeping",
  title: "Tea Steeping Calculator",
  description: "Free tea steeping calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tea steeping calculator"],
  variants: [{
    id: "standard",
    name: "Tea Steeping",
    description: "",
    fields: [
      { name: "type", label: "Tea Type (1-5)", type: "number", defaultValue: 1 },
      { name: "cups", label: "Cups", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Steep Time (min)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tea steeping?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
