import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gigTaxEstimateCalculator: CalculatorDefinition = {
  slug: "gig-tax-estimate-calculator",
  title: "Gig Tax Estimate Calculator",
  description: "Free gig tax estimate calculator. Calculate gig tax estimate quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gig economy tax"],
  variants: [{
    id: "standard",
    name: "Gig Tax Estimate",
    description: "",
    fields: [
      { name: "income", label: "Gig Income ($)", type: "number", min: 1 },
      { name: "expenses", label: "Deductions ($)", type: "number", defaultValue: 0 },
      { name: "taxRate", label: "Tax Rate %", type: "number", defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tax Owed", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate gig tax estimate?", answer: "Enter values and get instant results." },
    { question: "Why use this gig tax estimate calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
