import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sepIraCalculator: CalculatorDefinition = {
  slug: "sep-ira-calculator",
  title: "SEP IRA Calculator",
  description:
    "Calculate your SEP IRA contribution limits as a self-employed individual or small business owner. Determine maximum contributions and project retirement growth.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["SEP IRA", "self-employed retirement", "small business retirement", "SEP contribution", "self-employment tax"],
  variants: [
    {
      id: "contributionLimit",
      name: "Contribution Limit",
      fields: [
        { name: "netSelfEmploymentIncome", label: "Net Self-Employment Income ($)", type: "number", placeholder: "e.g. 150000" },
        { name: "isSelfEmployed", label: "Self-Employed? (0=Employee, 1=Self-Employed)", type: "number", placeholder: "e.g. 1" },
        { name: "w2Salary", label: "W-2 Salary (if employee) ($)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const netSelfEmploymentIncome = inputs.netSelfEmploymentIncome as number;
        const isSelfEmployed = inputs.isSelfEmployed as number || 1;
        const w2Salary = inputs.w2Salary as number || 0;

        if (!netSelfEmploymentIncome && !w2Salary) return null;

        const maxContribution = 69000; // 2024 limit
        let contribution: number;
        let effectiveRate: number;

        if (isSelfEmployed) {
          const seTaxDeduction = netSelfEmploymentIncome * 0.9235 * 0.5 * 0.153;
          const adjustedIncome = netSelfEmploymentIncome - seTaxDeduction;
          const compensationBase = adjustedIncome * 0.9235;
          contribution = Math.min(compensationBase * 0.25, maxContribution);
          effectiveRate = netSelfEmploymentIncome > 0 ? (contribution / netSelfEmploymentIncome) * 100 : 0;
        } else {
          contribution = Math.min(w2Salary * 0.25, maxContribution);
          effectiveRate = w2Salary > 0 ? (contribution / w2Salary) * 100 : 0;
        }

        const taxSavings25 = contribution * 0.25;
        const taxSavings32 = contribution * 0.32;

        return {
          primary: { label: "Maximum SEP IRA Contribution", value: `$${formatNumber(contribution, 2)}` },
          details: [
            { label: "Annual Limit", value: `$${formatNumber(maxContribution, 0)}` },
            { label: "Effective Contribution Rate", value: `${formatNumber(effectiveRate, 1)}%` },
            { label: "Tax Savings (25% bracket)", value: `$${formatNumber(taxSavings25, 2)}` },
            { label: "Tax Savings (32% bracket)", value: `$${formatNumber(taxSavings32, 2)}` },
            { label: "Type", value: isSelfEmployed ? "Self-Employed" : "Employee" },
          ],
        };
      },
    },
    {
      id: "growthProjection",
      name: "Growth Projection",
      fields: [
        { name: "currentBalance", label: "Current SEP IRA Balance ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "yearsToRetire", label: "Years to Retirement", type: "number", placeholder: "e.g. 20" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "taxRateNow", label: "Current Tax Rate (%)", type: "number", placeholder: "e.g. 30" },
        { name: "taxRateRetirement", label: "Expected Retirement Tax Rate (%)", type: "number", placeholder: "e.g. 22" },
      ],
      calculate: (inputs) => {
        const currentBalance = inputs.currentBalance as number || 0;
        const annualContribution = inputs.annualContribution as number;
        const yearsToRetire = inputs.yearsToRetire as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const taxRateNow = (inputs.taxRateNow as number) / 100;
        const taxRateRetirement = (inputs.taxRateRetirement as number) / 100;

        if (!annualContribution || !yearsToRetire || !returnRate) return null;

        let balance = currentBalance;
        for (let i = 0; i < yearsToRetire; i++) {
          balance = (balance + annualContribution) * (1 + returnRate);
        }

        const totalContributions = annualContribution * yearsToRetire + currentBalance;
        const afterTaxValue = balance * (1 - taxRateRetirement);
        const totalTaxSavings = annualContribution * taxRateNow * yearsToRetire;
        const taxOnWithdrawal = balance * taxRateRetirement;
        const netTaxBenefit = totalTaxSavings - taxOnWithdrawal;

        return {
          primary: { label: "Projected SEP IRA Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "After-Tax Value at Retirement", value: `$${formatNumber(afterTaxValue, 0)}` },
            { label: "Total Contributions", value: `$${formatNumber(totalContributions, 0)}` },
            { label: "Investment Growth", value: `$${formatNumber(balance - totalContributions, 0)}` },
            { label: "Total Tax Savings (contributions)", value: `$${formatNumber(totalTaxSavings, 0)}` },
            { label: "Net Tax Benefit", value: `$${formatNumber(netTaxBenefit, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["simple-ira-calculator", "ira-contribution-limit-calculator", "401k-calculator", "retirement-calculator"],
  faq: [
    { question: "What is a SEP IRA?", answer: "A Simplified Employee Pension (SEP) IRA is a retirement plan for self-employed individuals and small business owners. It allows much higher contribution limits than a Traditional IRA, up to 25% of compensation or $69,000 (2024)." },
    { question: "How is the self-employed SEP contribution calculated?", answer: "For self-employed individuals, the effective contribution rate is approximately 20% of net self-employment income (not 25%) because you must reduce your income by half the self-employment tax before calculating the contribution." },
  ],
  formula: "Self-Employed: Max = min(Adjusted Net Income × 25%, $69,000); Employee: Max = min(Salary × 25%, $69,000)",
};
