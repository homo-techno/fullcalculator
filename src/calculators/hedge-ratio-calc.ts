import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hedgeRatioCalcCalculator: CalculatorDefinition = {
  slug: "hedge-ratio-calc",
  title: "Hedge Ratio Calculator",
  description: "Free hedge ratio calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hedge ratio calculator"],
  variants: [{
    id: "standard",
    name: "Hedge Ratio",
    description: "",
    fields: [
      { name: "correlation", label: "Correlation", type: "number", min: -1, max: 1 },
      { name: "assetVol", label: "Asset Vol %", type: "number", min: 0.01 },
      { name: "hedgeVol", label: "Hedge Vol %", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Optimal Hedge Ratio", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hedge ratio?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
