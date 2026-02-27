import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sampleSizeMeanCalculator: CalculatorDefinition = {
  slug: "sample-size-mean",
  title: "Sample Size for Mean Calculator",
  description: "Free sample size for mean calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["sample size calculator mean"],
  variants: [{
    id: "standard",
    name: "Sample Size for Mean",
    description: "",
    fields: [
      { name: "zScore", label: "Z-Score", type: "number", defaultValue: 1.96 },
      { name: "stdDev", label: "Std Deviation", type: "number", min: 0.001 },
      { name: "moe", label: "Margin of Error", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Sample Size", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sample size for mean?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "n = (z×σ/E)²",
};
