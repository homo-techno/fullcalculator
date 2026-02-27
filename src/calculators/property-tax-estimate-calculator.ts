import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyTaxEstimateCalculator: CalculatorDefinition = {
  slug: "property-tax-estimate-calculator",
  title: "Property Tax Estimate Calculator",
  description: "Calculate property tax estimate with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["property tax estimator"],
  variants: [{
    id: "standard",
    name: "Property Tax Estimate",
    description: "",
    fields: [
      { name: "assessedValue", label: "Assessed Value ($)", type: "number", min: 1 },
      { name: "millRate", label: "Mill Rate", type: "number", defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Tax ($)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate property tax estimate?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good property tax estimate?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
