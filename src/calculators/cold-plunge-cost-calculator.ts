import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coldPlungeCostCalculator: CalculatorDefinition = {
  slug: "cold-plunge-cost-calculator",
  title: "Cold Plunge Cost Calculator",
  description: "Free cold plunge cost calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cold plunge cost"],
  variants: [{
    id: "standard",
    name: "Cold Plunge Cost",
    description: "",
    fields: [
      { name: "unit", label: "Unit Cost ($)", type: "number", defaultValue: 5000 },
      { name: "electric", label: "Monthly Electric ($)", type: "number", defaultValue: 30 },
      { name: "months", label: "Months", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Cost", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cold plunge cost?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
