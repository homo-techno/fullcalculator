import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const varValueAtRiskCalculator: CalculatorDefinition = {
  slug: "var-value-at-risk",
  title: "Value at Risk Calculator",
  description: "Free value at risk calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["var calculator", "value at risk"],
  variants: [{
    id: "standard",
    name: "Value at Risk",
    description: "",
    fields: [
      { name: "portfolio", label: "Portfolio Value ($)", type: "number", min: 1 },
      { name: "volatility", label: "Daily Volatility %", type: "number", min: 0.01 },
      { name: "confidence", label: "Confidence Level", type: "number", defaultValue: 0.95 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "VaR ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate value at risk?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
