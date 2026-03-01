import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sCorpTaxSavingsCalculator: CalculatorDefinition = {
  slug: "s-corp-tax-savings-calculator",
  title: "S-Corp Tax Savings Calculator",
  description: "Compare the self-employment tax burden of a sole proprietorship versus an S-corporation election.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["S-corp tax savings", "S-corp vs sole proprietor", "self employment tax savings"],
  variants: [{
    id: "standard",
    name: "S-Corp Tax Savings",
    description: "Compare the self-employment tax burden of a sole proprietorship versus an S-corporation election",
    fields: [
      { name: "netIncome", label: "Annual Net Business Income", type: "number", prefix: "$", min: 0, max: 5000000, step: 1000, defaultValue: 150000 },
      { name: "reasonableSalary", label: "Reasonable S-Corp Salary", type: "number", prefix: "$", min: 0, max: 5000000, step: 1000, defaultValue: 80000 },
      { name: "additionalCosts", label: "Additional S-Corp Annual Costs", type: "number", prefix: "$", min: 0, max: 20000, step: 100, defaultValue: 3000 },
    ],
    calculate: (inputs) => {
      const income = inputs.netIncome as number;
      const salary = inputs.reasonableSalary as number;
      const costs = inputs.additionalCosts as number;
      if (!income || income <= 0) return null;
      const seTaxRate = 0.153;
      const soleProprietorSETax = income * 0.9235 * seTaxRate;
      const sCorpSETax = salary * seTaxRate;
      const taxSavings = soleProprietorSETax - sCorpSETax - costs;
      const distribution = income - salary;
      return {
        primary: { label: "Estimated Annual Tax Savings", value: "$" + formatNumber(Math.round(Math.max(0, taxSavings))) },
        details: [
          { label: "Sole Proprietor SE Tax", value: "$" + formatNumber(Math.round(soleProprietorSETax)) },
          { label: "S-Corp Payroll Tax", value: "$" + formatNumber(Math.round(sCorpSETax)) },
          { label: "S-Corp Distributions (not subject to SE tax)", value: "$" + formatNumber(Math.round(distribution)) },
        ],
      };
    },
  }],
  relatedSlugs: ["llc-cost-calculator", "business-valuation-calculator"],
  faq: [
    { question: "When does an S-corp election make sense?", answer: "An S-corp election generally becomes beneficial when your net business income exceeds $50,000 to $60,000 per year, as the self-employment tax savings begin to outweigh the additional administrative costs." },
    { question: "What is a reasonable salary for an S-corp?", answer: "The IRS requires S-corp owners to pay themselves a reasonable salary comparable to what other businesses pay for similar services. This is typically 50 to 70 percent of net income." },
  ],
  formula: "Tax Savings = (Net Income x 0.9235 x 15.3%) - (Salary x 15.3%) - Additional S-Corp Costs",
};
