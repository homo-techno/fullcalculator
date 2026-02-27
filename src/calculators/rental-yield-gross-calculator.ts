import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalYieldGrossCalculator: CalculatorDefinition = {
  slug: "rental-yield-gross-calculator",
  title: "Gross Rental Yield Calculator",
  description: "Calculate gross rental yield with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rental yield calculator"],
  variants: [{
    id: "standard",
    name: "Gross Rental Yield",
    description: "",
    fields: [
      { name: "annualRent", label: "Annual Rent ($)", type: "number", min: 1 },
      { name: "propertyValue", label: "Property Value ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gross Yield %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gross rental yield?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good gross rental yield?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
