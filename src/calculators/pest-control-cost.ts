import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pestControlCostCalculator: CalculatorDefinition = {
  slug: "pest-control-cost",
  title: "Pest Control Cost Calculator",
  description: "Free pest control cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pest control calculator"],
  variants: [{
    id: "standard",
    name: "Pest Control Cost",
    description: "",
    fields: [
      { name: "sqft", label: "Home Sq Ft", type: "number", min: 500 },
      { name: "treatment", label: "Treatment Type (1-3)", type: "number", defaultValue: 1 },
      { name: "frequency", label: "Visits/Year", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pest control cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
