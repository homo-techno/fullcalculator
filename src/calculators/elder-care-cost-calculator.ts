import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const elderCareCostCalculator: CalculatorDefinition = {
  slug: "elder-care-cost-calculator",
  title: "Elder Care Cost Calculator",
  description: "Free elder care cost calculator. Calculate elder care cost quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["elder care calculator"],
  variants: [{
    id: "standard",
    name: "Elder Care Cost",
    description: "",
    fields: [
      { name: "type", label: "Care Type (1-3)", type: "number", defaultValue: 2 },
      { name: "hours", label: "Hours/Week", type: "number", defaultValue: 20 },
      { name: "rate", label: "Rate/Hour ($)", type: "number", defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Cost", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate elder care cost?", answer: "Enter values and get instant results." },
    { question: "Why use this elder care cost calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
