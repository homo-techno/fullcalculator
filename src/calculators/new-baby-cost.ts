import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newBabyCostCalculator: CalculatorDefinition = {
  slug: "new-baby-cost",
  title: "New Baby Cost Calculator",
  description: "Free new baby cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["new baby cost calculator"],
  variants: [{
    id: "standard",
    name: "New Baby Cost",
    description: "",
    fields: [
      { name: "diapers", label: "Diaper Cost/Mo ($)", type: "number", defaultValue: 80 },
      { name: "formula", label: "Formula/Mo ($)", type: "number", defaultValue: 150 },
      { name: "gear", label: "One-time Gear ($)", type: "number", defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "First Year ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate new baby cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
