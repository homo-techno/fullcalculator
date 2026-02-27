import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mhrCalcCalculator: CalculatorDefinition = {
  slug: "mhr-calc",
  title: "Max Heart Rate Calculator",
  description: "Free max heart rate calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["max heart rate calculator"],
  variants: [{
    id: "standard",
    name: "Max Heart Rate",
    description: "",
    fields: [
      { name: "age", label: "Age", type: "number", min: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Max HR (bpm)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate max heart rate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "MHR = 220 - Age",
};
