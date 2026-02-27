import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mechanicalAdvantageCalculator: CalculatorDefinition = {
  slug: "mechanical-advantage",
  title: "Mechanical Advantage Calculator",
  description: "Free mechanical advantage calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["mechanical advantage calculator"],
  variants: [{
    id: "standard",
    name: "Mechanical Advantage",
    description: "",
    fields: [
      { name: "outputForce", label: "Output Force (N)", type: "number", min: 0.01 },
      { name: "inputForce", label: "Input Force (N)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "MA", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mechanical advantage?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "MA = Fout / Fin",
};
