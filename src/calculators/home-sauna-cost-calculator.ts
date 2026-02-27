import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeSaunaCostCalculator: CalculatorDefinition = {
  slug: "home-sauna-cost-calculator",
  title: "Home Sauna Cost Calculator",
  description: "Free home sauna cost calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sauna cost"],
  variants: [{
    id: "standard",
    name: "Home Sauna Cost",
    description: "",
    fields: [
      { name: "type", label: "Type (1=IR,2=trad)", type: "number", defaultValue: 1 },
      { name: "baseCost", label: "Base Cost ($)", type: "number", defaultValue: 3000 },
      { name: "install", label: "Install ($)", type: "number", defaultValue: 500 },
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
    { question: "How to calculate home sauna cost?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
