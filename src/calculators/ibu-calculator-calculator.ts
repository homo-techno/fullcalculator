import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ibuCalculatorCalculator: CalculatorDefinition = {
  slug: "ibu-calculator-calculator",
  title: "IBU Calculator",
  description: "Calculate ibu with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ibu calculator", "bitterness"],
  variants: [{
    id: "standard",
    name: "IBU",
    description: "",
    fields: [
      { name: "ozHops", label: "Hops (oz)", type: "number", min: 0.1 },
      { name: "alpha", label: "Alpha Acid %", type: "number", defaultValue: 5 },
      { name: "boilMin", label: "Boil Minutes", type: "number", defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "IBU", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ibu?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good ibu?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
