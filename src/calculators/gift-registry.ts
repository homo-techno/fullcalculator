import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const giftRegistryCalculator: CalculatorDefinition = {
  slug: "gift-registry",
  title: "Gift Registry Budget Calculator",
  description: "Free gift registry budget calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gift registry calculator"],
  variants: [{
    id: "standard",
    name: "Gift Registry Budget",
    description: "",
    fields: [
      { name: "items", label: "Items", type: "number", min: 1 },
      { name: "avgPrice", label: "Avg Price ($)", type: "number", defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Registry Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gift registry budget?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
