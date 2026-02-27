import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const renewableEnergySavingsCalculator: CalculatorDefinition = {
  slug: "renewable-energy-savings",
  title: "Renewable Energy Savings Calculator",
  description: "Free renewable energy savings calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["renewable savings calculator"],
  variants: [{
    id: "standard",
    name: "Renewable Energy Savings",
    description: "",
    fields: [
      { name: "panelKw", label: "Panel kW", type: "number", min: 1 },
      { name: "sunHours", label: "Sun Hours/Day", type: "number", defaultValue: 5 },
      { name: "rate", label: "Elec Rate ($/kWh)", type: "number", defaultValue: 0.13 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Savings ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate renewable energy savings?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
