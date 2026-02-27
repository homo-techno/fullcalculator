import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dartsCheckoutCalculator: CalculatorDefinition = {
  slug: "darts-checkout-calculator",
  title: "Darts Checkout Calculator",
  description: "Calculate darts checkout with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["darts checkout calculator"],
  variants: [{
    id: "standard",
    name: "Darts Checkout",
    description: "",
    fields: [
      { name: "remaining", label: "Remaining Score", type: "number", min: 2, max: 170 },
      { name: "dartsLeft", label: "Darts Left", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Checkout Route", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate darts checkout?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good darts checkout?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
