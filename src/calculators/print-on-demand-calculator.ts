import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printOnDemandCalculator: CalculatorDefinition = {
  slug: "print-on-demand-calculator",
  title: "Print on Demand Profit Calculator",
  description: "Free print on demand profit calculator. Calculate print on demand profit quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pod profit calculator"],
  variants: [{
    id: "standard",
    name: "Print on Demand Profit",
    description: "",
    fields: [
      { name: "price", label: "Selling Price ($)", type: "number", min: 1 },
      { name: "baseCost", label: "Base Cost ($)", type: "number", min: 1 },
      { name: "sales", label: "Monthly Sales", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Profit", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate print on demand profit?", answer: "Enter values and get instant results." },
    { question: "Why use this print on demand profit calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
