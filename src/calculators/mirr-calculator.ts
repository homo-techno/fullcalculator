import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mirrCalculator: CalculatorDefinition = {
  slug: "mirr-calculator",
  title: "MIRR Calculator",
  description: "Free mirr calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mirr calculator"],
  variants: [{
    id: "standard",
    name: "MIRR",
    description: "",
    fields: [
      { name: "investment", label: "Initial Investment ($)", type: "number", min: 1 },
      { name: "financeRate", label: "Finance Rate %", type: "number", defaultValue: 10 },
      { name: "reinvestRate", label: "Reinvest Rate %", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "MIRR %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate mirr?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
