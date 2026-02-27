import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const downsizingSavingsCalculator: CalculatorDefinition = {
  slug: "downsizing-savings-calculator",
  title: "Downsizing Savings Calculator",
  description: "Free downsizing savings calculator. Calculate downsizing savings quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["downsizing calculator"],
  variants: [{
    id: "standard",
    name: "Downsizing Savings",
    description: "",
    fields: [
      { name: "currentValue", label: "Current Home Value ($)", type: "number", min: 1 },
      { name: "newValue", label: "New Home Value ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Net Proceeds", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate downsizing savings?", answer: "Enter values and get instant results." },
    { question: "Why use this downsizing savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
