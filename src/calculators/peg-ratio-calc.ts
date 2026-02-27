import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pegRatioCalcCalculator: CalculatorDefinition = {
  slug: "peg-ratio-calc",
  title: "PEG Ratio Calculator",
  description: "Free peg ratio calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["peg ratio calculator"],
  variants: [{
    id: "standard",
    name: "PEG Ratio",
    description: "",
    fields: [
      { name: "pe", label: "P/E Ratio", type: "number", min: 0.1 },
      { name: "growth", label: "EPS Growth Rate %", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PEG Ratio", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate peg ratio?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "PEG = P/E / Growth",
};
