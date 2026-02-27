import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cranberrySauceCalculator: CalculatorDefinition = {
  slug: "cranberry-sauce",
  title: "Cranberry Sauce Calculator",
  description: "Free cranberry sauce calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cranberry sauce calculator"],
  variants: [{
    id: "standard",
    name: "Cranberry Sauce",
    description: "",
    fields: [
      { name: "guests", label: "Guests", type: "number", min: 1 },
      { name: "ozPerGuest", label: "Oz/Guest", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Bags Needed", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cranberry sauce?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
