import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coinCollectionValueCalculator: CalculatorDefinition = {
  slug: "coin-collection-value-calculator",
  title: "Coin Collection Value Calculator",
  description: "Free coin collection value calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["coin collection value"],
  variants: [{
    id: "standard",
    name: "Coin Collection Value",
    description: "",
    fields: [
      { name: "coins", label: "Number of Coins", type: "number", min: 1 },
      { name: "avgValue", label: "Avg Value ($)", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Collection Value", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate coin collection value?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
