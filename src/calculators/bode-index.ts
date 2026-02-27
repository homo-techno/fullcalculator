import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodeIndexCalculator: CalculatorDefinition = {
  slug: "bode-index",
  title: "BODE Index Calculator",
  description: "Free bode index calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bode index calculator", "copd"],
  variants: [{
    id: "standard",
    name: "BODE Index",
    description: "",
    fields: [
      { name: "fev1", label: "FEV1 % Predicted", type: "number", min: 1 },
      { name: "walkDist", label: "6MWT Distance (m)", type: "number", min: 0 },
      { name: "mmrc", label: "mMRC Dyspnea (0-4)", type: "number", min: 0, max: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "BODE Index", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bode index?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
