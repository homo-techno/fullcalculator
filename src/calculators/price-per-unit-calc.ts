import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pricePerUnitCalcCalculator: CalculatorDefinition = {
  slug: "price-per-unit-calc",
  title: "Price Per Unit Calculator",
  description: "Free price per unit calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["price per unit calculator"],
  variants: [{
    id: "standard",
    name: "Price Per Unit",
    description: "",
    fields: [
      { name: "price", label: "Price ($)", type: "number", min: 0.01 },
      { name: "quantity", label: "Quantity", type: "number", min: 0.01 },
      { name: "unit", label: "Unit Size", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Price/Unit ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate price per unit?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
