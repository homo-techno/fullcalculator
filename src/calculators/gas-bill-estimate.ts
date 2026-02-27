import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasBillEstimateCalculator: CalculatorDefinition = {
  slug: "gas-bill-estimate",
  title: "Gas Bill Estimate Calculator",
  description: "Free gas bill estimate calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas bill calculator"],
  variants: [{
    id: "standard",
    name: "Gas Bill Estimate",
    description: "",
    fields: [
      { name: "therms", label: "Monthly Therms", type: "number", min: 1 },
      { name: "rate", label: "Rate ($/Therm)", type: "number", defaultValue: 1.2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Bill ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gas bill estimate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
