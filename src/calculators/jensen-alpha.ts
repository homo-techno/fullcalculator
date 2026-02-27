import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jensenAlphaCalculator: CalculatorDefinition = {
  slug: "jensen-alpha",
  title: "Jensen Alpha Calculator",
  description: "Free jensen alpha calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["jensen alpha calculator"],
  variants: [{
    id: "standard",
    name: "Jensen Alpha",
    description: "",
    fields: [
      { name: "return", label: "Portfolio Return %", type: "number" },
      { name: "riskFree", label: "Risk-Free Rate %", type: "number", defaultValue: 2 },
      { name: "beta", label: "Beta", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Alpha", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate jensen alpha?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "α = Rp - [Rf + β(Rm - Rf)]",
};
