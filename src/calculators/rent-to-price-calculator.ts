import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentToPriceCalculator: CalculatorDefinition = {
  slug: "rent-to-price-calculator",
  title: "Rent to Price Ratio Calculator",
  description: "Calculate rent to price ratio with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rent to price ratio"],
  variants: [{
    id: "standard",
    name: "Rent to Price Ratio",
    description: "",
    fields: [
      { name: "monthlyRent", label: "Monthly Rent ($)", type: "number", min: 1 },
      { name: "price", label: "Property Price ($)", type: "number", min: 1 },
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
    { question: "How to calculate rent to price ratio?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good rent to price ratio?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
