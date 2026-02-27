import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const revisedGenevaCalculator: CalculatorDefinition = {
  slug: "revised-geneva",
  title: "Revised Geneva Score Calculator",
  description: "Free revised geneva score calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["geneva score calculator"],
  variants: [{
    id: "standard",
    name: "Revised Geneva Score",
    description: "",
    fields: [
      { name: "age", label: "Age >65 (0-1)", type: "number", min: 0, max: 1 },
      { name: "dvt", label: "Previous DVT/PE (0-3)", type: "number", min: 0, max: 3 },
      { name: "hr", label: "Heart Rate (0-5)", type: "number", min: 0, max: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Geneva Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate revised geneva score?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
