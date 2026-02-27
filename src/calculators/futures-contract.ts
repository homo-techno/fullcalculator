import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const futuresContractCalculator: CalculatorDefinition = {
  slug: "futures-contract",
  title: "Futures Contract Calculator",
  description: "Free futures contract calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["futures contract calculator"],
  variants: [{
    id: "standard",
    name: "Futures Contract",
    description: "",
    fields: [
      { name: "spotPrice", label: "Spot Price ($)", type: "number", min: 0.01 },
      { name: "riskFree", label: "Risk-Free Rate %", type: "number", defaultValue: 5 },
      { name: "time", label: "Time to Maturity (yrs)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Futures Price ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate futures contract?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
