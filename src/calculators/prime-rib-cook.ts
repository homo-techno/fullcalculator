import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const primeRibCookCalculator: CalculatorDefinition = {
  slug: "prime-rib-cook",
  title: "Prime Rib Cook Time Calculator",
  description: "Free prime rib cook time calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["prime rib calculator"],
  variants: [{
    id: "standard",
    name: "Prime Rib Cook Time",
    description: "",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 3 },
      { name: "doneness", label: "Doneness (1-5)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cook Minutes", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate prime rib cook time?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
