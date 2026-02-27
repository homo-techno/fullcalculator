import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evToEbitdaCalculator: CalculatorDefinition = {
  slug: "ev-to-ebitda",
  title: "EV/EBITDA Calculator",
  description: "Free ev/ebitda calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ev to ebitda calculator"],
  variants: [{
    id: "standard",
    name: "EV/EBITDA",
    description: "",
    fields: [
      { name: "ev", label: "Enterprise Value ($)", type: "number", min: 1 },
      { name: "ebitda", label: "EBITDA ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Multiple", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ev/ebitda?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
