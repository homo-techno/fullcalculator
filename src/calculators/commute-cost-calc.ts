import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commuteCostCalcCalculator: CalculatorDefinition = {
  slug: "commute-cost-calc",
  title: "Commute Cost Calculator",
  description: "Free commute cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["commute cost calculator"],
  variants: [{
    id: "standard",
    name: "Commute Cost",
    description: "",
    fields: [
      { name: "miles", label: "Miles One Way", type: "number", min: 1 },
      { name: "mpg", label: "MPG", type: "number", defaultValue: 25 },
      { name: "gasPrice", label: "Gas Price ($)", type: "number", defaultValue: 3.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate commute cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
