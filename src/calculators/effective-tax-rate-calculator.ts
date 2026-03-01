import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const effectiveTaxRateCalculator: CalculatorDefinition = {
  slug: "effective-tax-rate-calculator",
  title: "Effective Tax Rate Calculator",
  description: "Calculate your overall effective tax rate including federal, state, and FICA taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["effective tax rate", "total tax rate", "all-in tax rate"],
  variants: [{
    id: "standard",
    name: "Effective Tax Rate",
    description: "Calculate your overall effective tax rate including federal, state, and FICA taxes",
    fields: [
      { name: "grossIncome", label: "Gross Annual Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 100000 },
      { name: "federalTax", label: "Federal Tax Paid", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 14000 },
      { name: "stateTax", label: "State Tax Paid", type: "number", prefix: "$", min: 0, max: 2000000, defaultValue: 5000 },
      { name: "ficaTax", label: "FICA Tax Paid", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 7650 },
    ],
    calculate: (inputs) => {
      const income = inputs.grossIncome as number;
      const federal = inputs.federalTax as number;
      const state = inputs.stateTax as number;
      const fica = inputs.ficaTax as number;
      if (!income || income <= 0) return null;
      const totalTax = federal + state + fica;
      const effectiveRate = (totalTax / income) * 100;
      const federalRate = (federal / income) * 100;
      const stateRate = (state / income) * 100;
      const afterTax = income - totalTax;
      return {
        primary: { label: "Effective Tax Rate", value: effectiveRate.toFixed(1) + "%" },
        details: [
          { label: "Total Taxes Paid", value: "$" + formatNumber(totalTax) },
          { label: "Federal Rate", value: federalRate.toFixed(1) + "%" },
          { label: "State Rate", value: stateRate.toFixed(1) + "%" },
          { label: "After-Tax Income", value: "$" + formatNumber(afterTax) },
        ],
      };
    },
  }],
  relatedSlugs: ["marginal-tax-rate-calculator", "itemized-deduction-calculator"],
  faq: [
    { question: "What is a good effective tax rate?", answer: "The average effective federal tax rate for most Americans is between 10% and 22%, depending on income level and deductions." },
    { question: "How can I lower my effective tax rate?", answer: "Maximize retirement contributions, use tax-advantaged accounts, itemize deductions, and harvest capital losses to reduce your rate." },
  ],
  formula: "Effective Rate = (Federal + State + FICA) / Gross Income x 100",
};
