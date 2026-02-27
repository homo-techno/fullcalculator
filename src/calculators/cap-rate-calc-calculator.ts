import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capRateCalcCalculator: CalculatorDefinition = {
  slug: "cap-rate-calc-calculator",
  title: "Cap Rate Calculator",
  description: "Calculate cap rate with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cap rate calculator"],
  variants: [{
    id: "standard",
    name: "Cap Rate",
    description: "",
    fields: [
      { name: "noi", label: "Net Operating Income ($)", type: "number", min: 1 },
      { name: "value", label: "Property Value ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cap Rate %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cap rate?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good cap rate?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
