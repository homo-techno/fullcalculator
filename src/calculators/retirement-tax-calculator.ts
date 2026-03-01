import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementTaxCalculator: CalculatorDefinition = {
  slug: "retirement-tax-calculator",
  title: "Retirement Tax Calculator",
  description: "Estimate your total tax burden in retirement from Social Security, pensions, and retirement account withdrawals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement tax","tax in retirement","retirement tax estimator"],
  variants: [{
    id: "standard",
    name: "Retirement Tax",
    description: "Estimate your total tax burden in retirement from Social Security, pensions, and retirement account withdrawals.",
    fields: [
      { name: "socialSecurity", label: "Annual Social Security", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 24000 },
      { name: "pensionIncome", label: "Annual Pension Income", type: "number", prefix: "$", min: 0, max: 200000, defaultValue: 0 },
      { name: "iraWithdrawals", label: "Annual IRA/401k Withdrawals", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 30000 },
      { name: "otherIncome", label: "Other Taxable Income", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 5000 },
      { name: "standardDeduction", label: "Standard Deduction", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 15700 },
    ],
    calculate: (inputs) => {
      const ss = inputs.socialSecurity as number;
      const pension = inputs.pensionIncome as number;
      const ira = inputs.iraWithdrawals as number;
      const other = inputs.otherIncome as number;
      const deduction = inputs.standardDeduction as number;
      const provisionalIncome = (ss * 0.5) + pension + ira + other;
      const taxableSS = provisionalIncome > 44000 ? ss * 0.85 : provisionalIncome > 32000 ? ss * 0.5 : 0;
      const totalIncome = taxableSS + pension + ira + other;
      const taxableIncome = Math.max(0, totalIncome - deduction);
      let tax = 0;
      if (taxableIncome <= 11600) tax = taxableIncome * 0.10;
      else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12;
      else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22;
      else tax = 17168.50 + (taxableIncome - 100525) * 0.24;
      const effectiveRate = totalIncome > 0 ? (tax / totalIncome) * 100 : 0;
      return {
        primary: { label: "Estimated Federal Tax", value: "$" + formatNumber(Math.round(tax)) },
        details: [
          { label: "Total Gross Income", value: "$" + formatNumber(Math.round(totalIncome)) },
          { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
          { label: "Taxable Social Security", value: "$" + formatNumber(Math.round(taxableSS)) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["retirement-income-calculator","required-minimum-distribution-calculator"],
  faq: [
    { question: "Is Social Security income taxed?", answer: "Up to 85% of Social Security benefits can be taxed depending on your combined income. Single filers with combined income above $34,000 and joint filers above $44,000 may owe tax on up to 85% of benefits." },
    { question: "How can I reduce taxes in retirement?", answer: "Strategies include Roth conversions before retirement, managing withdrawal sources, keeping income below Social Security taxation thresholds, and using the higher standard deduction available to those 65 and older." },
  ],
  formula: "Taxable Income = (Taxable SS + Pension + IRA Withdrawals + Other) - Standard Deduction; Tax calculated using federal brackets",
};
