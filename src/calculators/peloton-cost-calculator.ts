import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pelotonCostCalculator: CalculatorDefinition = {
  slug: "peloton-cost-calculator",
  title: "Peloton Cost Calculator",
  description: "Free peloton cost calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["peloton cost analysis"],
  variants: [{
    id: "standard",
    name: "Peloton Cost",
    description: "",
    fields: [
      { name: "bike", label: "Bike Cost ($)", type: "number", defaultValue: 1500 },
      { name: "monthly", label: "Subscription/Mo ($)", type: "number", defaultValue: 44 },
      { name: "months", label: "Months", type: "number", defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Cost", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate peloton cost?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
