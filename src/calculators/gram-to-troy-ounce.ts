import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramToTroyOunceCalculator: CalculatorDefinition = {
  slug: "gram-to-troy-ounce",
  title: "Gram to Troy Ounce Calculator",
  description: "Free gram to troy ounce calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gram to troy ounce"],
  variants: [{
    id: "standard",
    name: "Gram to Troy Ounce",
    description: "",
    fields: [
      { name: "grams", label: "Grams", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Troy Ounces", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gram to troy ounce?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
