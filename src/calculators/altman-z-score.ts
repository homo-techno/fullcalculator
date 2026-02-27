import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const altmanZScoreCalculator: CalculatorDefinition = {
  slug: "altman-z-score",
  title: "Altman Z-Score Calculator",
  description: "Free altman z-score calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["altman z score calculator"],
  variants: [{
    id: "standard",
    name: "Altman Z-Score",
    description: "",
    fields: [
      { name: "wcta", label: "WC/TA", type: "number" },
      { name: "reta", label: "RE/TA", type: "number" },
      { name: "ebitta", label: "EBIT/TA", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Z-Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate altman z-score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + X5",
};
