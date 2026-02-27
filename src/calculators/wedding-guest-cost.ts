import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingGuestCostCalculator: CalculatorDefinition = {
  slug: "wedding-guest-cost",
  title: "Wedding per Guest Calculator",
  description: "Free wedding per guest calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding per guest cost"],
  variants: [{
    id: "standard",
    name: "Wedding per Guest",
    description: "",
    fields: [
      { name: "totalBudget", label: "Total Budget ($)", type: "number", min: 5000 },
      { name: "guests", label: "Guests", type: "number", min: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cost/Guest ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate wedding per guest?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
