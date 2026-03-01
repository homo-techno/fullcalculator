import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const estimatedTaxCalculator: CalculatorDefinition = {
  slug: "estimated-tax-calculator",
  title: "Estimated Tax Calculator",
  description: "Calculate quarterly estimated tax payments for self-employed or investment income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["estimated tax payments", "quarterly tax calculator", "self-employment tax"],
  variants: [{
    id: "standard",
    name: "Estimated Tax",
    description: "Calculate quarterly estimated tax payments for self-employed or investment income",
    fields: [
      { name: "annualIncome", label: "Expected Annual Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 100000 },
      { name: "withholding", label: "Total Tax Withholding", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 10000 },
      { name: "deductions", label: "Estimated Deductions", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 14600 },
      { name: "selfEmployed", label: "Self-Employment Income?", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No"}], defaultValue: "yes" },
    ],
    calculate: (inputs) => {
      const income = inputs.annualIncome as number;
      const withholding = inputs.withholding as number;
      const deductions = inputs.deductions as number;
      const se = inputs.selfEmployed as string;
      if (!income || income <= 0) return null;
      const taxableIncome = Math.max(0, income - deductions);
      let incomeTax = 0;
      const brackets = [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]];
      let prev = 0;
      for (const [limit, rate] of brackets) {
        if (taxableIncome <= prev) break;
        const taxable = Math.min(taxableIncome, limit as number) - prev;
        incomeTax += taxable * (rate as number);
        prev = limit as number;
      }
      const seTax = se === "yes" ? income * 0.9235 * 0.153 : 0;
      const seDeduction = seTax / 2;
      const totalTax = incomeTax + seTax - seDeduction * (se === "yes" ? 0.22 : 0);
      const remaining = totalTax - withholding;
      const quarterly = Math.max(0, remaining / 4);
      return {
        primary: { label: "Quarterly Payment", value: "$" + formatNumber(Math.round(quarterly)) },
        details: [
          { label: "Estimated Total Tax", value: "$" + formatNumber(Math.round(totalTax)) },
          { label: "Income Tax", value: "$" + formatNumber(Math.round(incomeTax)) },
          { label: "SE Tax", value: "$" + formatNumber(Math.round(seTax)) },
          { label: "Remaining After Withholding", value: "$" + formatNumber(Math.round(remaining)) },
        ],
      };
    },
  }],
  relatedSlugs: ["capital-gains-tax-calculator", "marginal-tax-rate-calculator"],
  faq: [
    { question: "When are estimated tax payments due?", answer: "Quarterly estimated taxes are due April 15, June 15, September 15, and January 15 of the following year." },
    { question: "Who needs to make estimated tax payments?", answer: "You should make estimated payments if you expect to owe $1,000 or more in tax after subtracting withholding and credits." },
  ],
  formula: "Quarterly Payment = (Total Tax - Withholding) / 4",
};
