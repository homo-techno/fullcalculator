import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageSaleCalculator: CalculatorDefinition = {
  slug: "garage-sale-calculator",
  title: "Garage Sale Pricing Calculator",
  description: "Free garage sale pricing calculator. Calculate garage sale pricing quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garage sale calculator"],
  variants: [{
    id: "standard",
    name: "Garage Sale Pricing",
    description: "",
    fields: [
      { name: "originalPrice", label: "Original Price ($)", type: "number", min: 1 },
      { name: "age", label: "Age (years)", type: "number", min: 0 },
      { name: "condition", label: "Condition (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Sale Price", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate garage sale pricing?", answer: "Enter values and get instant results." },
    { question: "Why use this garage sale pricing calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
