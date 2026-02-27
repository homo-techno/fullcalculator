import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treadmillCostCalculator: CalculatorDefinition = {
  slug: "treadmill-cost-calculator",
  title: "Treadmill Cost Calculator",
  description: "Free treadmill cost calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["treadmill cost"],
  variants: [{
    id: "standard",
    name: "Treadmill Cost",
    description: "",
    fields: [
      { name: "price", label: "Price ($)", type: "number", min: 200 },
      { name: "monthly", label: "Gym Saved/Mo ($)", type: "number", defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Payback Months", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate treadmill cost?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
