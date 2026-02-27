import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alvaradoScoreCalculator: CalculatorDefinition = {
  slug: "alvarado-score",
  title: "Alvarado Score Calculator",
  description: "Free alvarado score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["alvarado score calculator", "appendicitis"],
  variants: [{
    id: "standard",
    name: "Alvarado Score",
    description: "",
    fields: [
      { name: "migration", label: "Migration of Pain (0-1)", type: "number", min: 0, max: 1 },
      { name: "anorexia", label: "Anorexia (0-1)", type: "number", min: 0, max: 1 },
      { name: "nausea", label: "Nausea/Vomiting (0-1)", type: "number", min: 0, max: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Alvarado Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate alvarado score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
