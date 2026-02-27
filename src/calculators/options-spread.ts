import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const optionsSpreadCalculator: CalculatorDefinition = {
  slug: "options-spread",
  title: "Options Spread Calculator",
  description: "Free options spread calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["options spread calculator"],
  variants: [{
    id: "standard",
    name: "Options Spread",
    description: "",
    fields: [
      { name: "longPremium", label: "Long Premium ($)", type: "number", min: 0 },
      { name: "shortPremium", label: "Short Premium ($)", type: "number", min: 0 },
      { name: "contracts", label: "Contracts", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Max Profit ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate options spread?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
