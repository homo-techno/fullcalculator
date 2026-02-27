import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chimneySweepCostCalculator: CalculatorDefinition = {
  slug: "chimney-sweep-cost",
  title: "Chimney Sweep Cost Calculator",
  description: "Free chimney sweep cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["chimney sweep calculator"],
  variants: [{
    id: "standard",
    name: "Chimney Sweep Cost",
    description: "",
    fields: [
      { name: "chimneys", label: "Chimneys", type: "number", min: 1 },
      { name: "baseCost", label: "Base Cost ($)", type: "number", defaultValue: 200 },
      { name: "condition", label: "Condition (1-3)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate chimney sweep cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
