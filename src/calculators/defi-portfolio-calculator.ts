import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const defiPortfolioCalculator: CalculatorDefinition = {
  slug: "defi-portfolio-calculator",
  title: "DeFi Portfolio Calculator",
  description: "Free defi portfolio calculator. Calculate defi portfolio quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["defi portfolio calculator"],
  variants: [{
    id: "standard",
    name: "DeFi Portfolio",
    description: "",
    fields: [
      { name: "holdings", label: "Total Holdings ($)", type: "number", min: 1 },
      { name: "yield", label: "Avg Yield %", type: "number", defaultValue: 8 },
      { name: "months", label: "Months", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Projected Value", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate defi portfolio?", answer: "Enter values and get instant results." },
    { question: "Why use this defi portfolio calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
