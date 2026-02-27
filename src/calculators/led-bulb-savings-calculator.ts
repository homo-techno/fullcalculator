import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ledBulbSavingsCalculator: CalculatorDefinition = {
  slug: "led-bulb-savings-calculator",
  title: "LED Bulb Savings Calculator",
  description: "Free led bulb savings calculator. Calculate led bulb savings quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["led savings calculator"],
  variants: [{
    id: "standard",
    name: "LED Bulb Savings",
    description: "",
    fields: [
      { name: "bulbs", label: "Number of Bulbs", type: "number", min: 1 },
      { name: "hoursPerDay", label: "Hours/Day", type: "number", defaultValue: 5 },
      { name: "rate", label: "Rate ($/kWh)", type: "number", defaultValue: 0.13 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Savings", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate led bulb savings?", answer: "Enter values and get instant results." },
    { question: "Why use this led bulb savings calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
