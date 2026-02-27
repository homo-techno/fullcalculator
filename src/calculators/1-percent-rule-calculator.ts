import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n1PercentRuleCalculator: CalculatorDefinition = {
  slug: "1-percent-rule-calculator",
  title: "1% Rule Calculator",
  description: "Calculate 1% rule with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["1 percent rule real estate"],
  variants: [{
    id: "standard",
    name: "1% Rule",
    description: "",
    fields: [
      { name: "price", label: "Property Price ($)", type: "number", min: 1 },
      { name: "rent", label: "Monthly Rent ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Ratio", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate 1% rule?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good 1% rule?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
