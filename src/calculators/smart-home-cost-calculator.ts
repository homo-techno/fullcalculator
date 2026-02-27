import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smartHomeCostCalculator: CalculatorDefinition = {
  slug: "smart-home-cost-calculator",
  title: "Smart Home Cost Calculator",
  description: "Free smart home cost calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["smart home cost"],
  variants: [{
    id: "standard",
    name: "Smart Home Cost",
    description: "",
    fields: [
      { name: "devices", label: "Devices", type: "number", min: 1 },
      { name: "avgCost", label: "Avg Cost/Device ($)", type: "number", defaultValue: 50 },
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
    { question: "How to calculate smart home cost?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
