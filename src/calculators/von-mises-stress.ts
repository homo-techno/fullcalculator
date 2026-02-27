import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vonMisesStressCalculator: CalculatorDefinition = {
  slug: "von-mises-stress",
  title: "Von Mises Stress Calculator",
  description: "Free von mises stress calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["von mises stress calculator"],
  variants: [{
    id: "standard",
    name: "Von Mises Stress",
    description: "",
    fields: [
      { name: "s1", label: "σ1 (Pa)", type: "number" },
      { name: "s2", label: "σ2 (Pa)", type: "number" },
      { name: "s3", label: "σ3 (Pa)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Von Mises (Pa)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate von mises stress?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
