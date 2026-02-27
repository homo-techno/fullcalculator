import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homebrewAbvCalculator: CalculatorDefinition = {
  slug: "homebrew-abv-calculator",
  title: "Homebrew ABV Calculator",
  description: "Calculate homebrew abv with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["homebrew abv", "original gravity"],
  variants: [{
    id: "standard",
    name: "Homebrew ABV",
    description: "",
    fields: [
      { name: "og", label: "Original Gravity", type: "number", step: 0.001, defaultValue: 1.05 },
      { name: "fg", label: "Final Gravity", type: "number", step: 0.001, defaultValue: 1.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ABV %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate homebrew abv?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good homebrew abv?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
