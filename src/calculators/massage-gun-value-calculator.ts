import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const massageGunValueCalculator: CalculatorDefinition = {
  slug: "massage-gun-value-calculator",
  title: "Massage Gun Value Calculator",
  description: "Free massage gun value calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["massage gun vs massage"],
  variants: [{
    id: "standard",
    name: "Massage Gun Value",
    description: "",
    fields: [
      { name: "gunCost", label: "Gun Cost ($)", type: "number", defaultValue: 300 },
      { name: "massageCost", label: "Massage Cost ($)", type: "number", defaultValue: 80 },
      { name: "freq", label: "Massages/Month", type: "number", defaultValue: 2 },
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
    { question: "How to calculate massage gun value?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
