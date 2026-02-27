import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evHomeChargerCalculator: CalculatorDefinition = {
  slug: "ev-home-charger-calculator",
  title: "EV Home Charger Calculator",
  description: "Free ev home charger calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ev charger cost"],
  variants: [{
    id: "standard",
    name: "EV Home Charger",
    description: "",
    fields: [
      { name: "install", label: "Install Cost ($)", type: "number", defaultValue: 1500 },
      { name: "monthlySavings", label: "Gas Savings/Mo ($)", type: "number", defaultValue: 150 },
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
    { question: "How to calculate ev home charger?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
