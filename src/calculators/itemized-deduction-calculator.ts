import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const itemizedDeductionCalculator: CalculatorDefinition = {
  slug: "itemized-deduction-calculator",
  title: "Itemized Deduction Calculator",
  description: "Compare your itemized deductions to the standard deduction to find the best option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["itemized deduction calculator", "standard vs itemized", "tax deduction calculator"],
  variants: [{
    id: "standard",
    name: "Itemized Deduction",
    description: "Compare your itemized deductions to the standard deduction to find the best option",
    fields: [
      { name: "mortgageInterest", label: "Mortgage Interest", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 12000 },
      { name: "stateLocalTax", label: "State and Local Taxes (SALT)", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 8000 },
      { name: "charitableDonations", label: "Charitable Donations", type: "number", prefix: "$", min: 0, max: 1000000, defaultValue: 3000 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single ($14,600)"},{value:"married",label:"Married Filing Jointly ($29,200)"},{value:"hoh",label:"Head of Household ($21,900)"}], defaultValue: "single" },
    ],
    calculate: (inputs) => {
      const mortgage = inputs.mortgageInterest as number;
      const salt = Math.min(inputs.stateLocalTax as number, 10000);
      const charity = inputs.charitableDonations as number;
      const status = inputs.filingStatus as string;
      if (!mortgage && !salt && !charity) return null;
      const standardAmounts: Record<string, number> = { single: 14600, married: 29200, hoh: 21900 };
      const standard = standardAmounts[status] || 14600;
      const itemized = mortgage + salt + charity;
      const better = itemized > standard ? "Itemize" : "Standard";
      const savings = Math.abs(itemized - standard);
      const taxSavings = savings * 0.22;
      return {
        primary: { label: "Recommendation", value: better + " (saves $" + formatNumber(Math.round(savings)) + ")" },
        details: [
          { label: "Itemized Total", value: "$" + formatNumber(itemized) },
          { label: "Standard Deduction", value: "$" + formatNumber(standard) },
          { label: "SALT (capped at $10,000)", value: "$" + formatNumber(salt) },
          { label: "Estimated Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) },
        ],
      };
    },
  }],
  relatedSlugs: ["charitable-donation-calculator", "effective-tax-rate-calculator"],
  faq: [
    { question: "Should I itemize or take the standard deduction?", answer: "Itemize if your total deductions exceed the standard deduction, otherwise the standard deduction gives you a larger tax benefit." },
    { question: "What is the SALT deduction cap?", answer: "The state and local tax deduction is capped at $10,000 ($5,000 if married filing separately) under current tax law." },
  ],
  formula: "Comparison: Itemized (Mortgage + SALT + Charity) vs Standard Deduction",
};
