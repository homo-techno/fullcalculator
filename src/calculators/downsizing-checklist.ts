import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const downsizingChecklistCalculator: CalculatorDefinition = {
  slug: "downsizing-checklist",
  title: "Downsizing Cost Calculator",
  description: "Free downsizing cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["downsizing cost calculator"],
  variants: [{
    id: "standard",
    name: "Downsizing Cost",
    description: "",
    fields: [
      { name: "items", label: "Items to Sell", type: "number", min: 0 },
      { name: "donations", label: "Donation Value ($)", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Net Savings ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate downsizing cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
