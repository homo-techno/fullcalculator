import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const markupCalculatorCalculator: CalculatorDefinition = {
  slug: "markup-calculator-calculator",
  title: "Markup Calculator",
  description: "Calculate markup with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["markup calculator"],
  variants: [{
    id: "standard",
    name: "Markup",
    description: "",
    fields: [
      { name: "cost", label: "Cost ($)", type: "number", min: 0.01 },
      { name: "markup", label: "Markup %", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Selling Price ($)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate markup?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good markup?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
