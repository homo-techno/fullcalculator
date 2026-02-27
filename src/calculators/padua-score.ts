import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paduaScoreCalculator: CalculatorDefinition = {
  slug: "padua-score",
  title: "Padua VTE Score Calculator",
  description: "Free padua vte score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["padua score calculator"],
  variants: [{
    id: "standard",
    name: "Padua VTE Score",
    description: "",
    fields: [
      { name: "cancer", label: "Active Cancer (0-3)", type: "number", min: 0, max: 3 },
      { name: "vte", label: "Previous VTE (0-3)", type: "number", min: 0, max: 3 },
      { name: "mobility", label: "Reduced Mobility (0-3)", type: "number", min: 0, max: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Padua Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate padua vte score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
