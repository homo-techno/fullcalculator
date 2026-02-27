import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeEquityCalcCalculator: CalculatorDefinition = {
  slug: "home-equity-calc",
  title: "Home Equity Calculator",
  description: "Free home equity calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home equity calculator"],
  variants: [{
    id: "standard",
    name: "Home Equity",
    description: "",
    fields: [
      { name: "homeValue", label: "Home Value ($)", type: "number", min: 1 },
      { name: "mortgageBalance", label: "Mortgage Balance ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Equity ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate home equity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
