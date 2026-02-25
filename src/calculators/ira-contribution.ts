import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iraContributionCalculator: CalculatorDefinition = {
  slug: "ira-contribution-limit-calculator",
  title: "IRA Contribution Limit Calculator",
  description:
    "Determine your IRA contribution limits and deductibility based on income, filing status, and workplace retirement plan coverage. Covers Traditional and Roth IRAs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["IRA contribution", "contribution limit", "Traditional IRA", "Roth IRA", "tax deduction", "MAGI"],
  variants: [
    {
      id: "contributionLimits",
      name: "Contribution Limits",
      fields: [
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 40" },
        { name: "magi", label: "Modified Adjusted Gross Income ($)", type: "number", placeholder: "e.g. 120000" },
        { name: "filingStatus", label: "Filing Status (1=Single, 2=Married Joint, 3=Married Separate)", type: "number", placeholder: "e.g. 1" },
        { name: "hasWorkplacePlan", label: "Covered by Workplace Plan? (0=No, 1=Yes)", type: "number", placeholder: "e.g. 1" },
        { name: "spouseHasWorkplacePlan", label: "Spouse Covered by Workplace Plan? (0=No, 1=Yes)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const magi = inputs.magi as number;
        const filingStatus = inputs.filingStatus as number || 1;
        const hasWorkplacePlan = inputs.hasWorkplacePlan as number || 0;
        const spouseHasWorkplacePlan = inputs.spouseHasWorkplacePlan as number || 0;

        if (!age || !magi) return null;

        const baseLimit = 7000;
        const catchUp = age >= 50 ? 1000 : 0;
        const totalLimit = baseLimit + catchUp;

        // Roth IRA income limits (2024 estimates)
        let rothLimit = totalLimit;
        if (filingStatus === 1) {
          if (magi > 161000) rothLimit = 0;
          else if (magi > 146000) rothLimit = totalLimit * (161000 - magi) / 15000;
        } else if (filingStatus === 2) {
          if (magi > 240000) rothLimit = 0;
          else if (magi > 230000) rothLimit = totalLimit * (240000 - magi) / 10000;
        } else {
          if (magi > 10000) rothLimit = 0;
        }
        rothLimit = Math.max(Math.round(rothLimit), 0);

        // Traditional IRA deductibility
        let deductibleAmount = totalLimit;
        if (hasWorkplacePlan) {
          if (filingStatus === 1) {
            if (magi > 87000) deductibleAmount = 0;
            else if (magi > 77000) deductibleAmount = totalLimit * (87000 - magi) / 10000;
          } else if (filingStatus === 2) {
            if (magi > 143000) deductibleAmount = 0;
            else if (magi > 123000) deductibleAmount = totalLimit * (143000 - magi) / 20000;
          }
        } else if (filingStatus === 2 && spouseHasWorkplacePlan) {
          if (magi > 240000) deductibleAmount = 0;
          else if (magi > 230000) deductibleAmount = totalLimit * (240000 - magi) / 10000;
        }
        deductibleAmount = Math.max(Math.round(deductibleAmount), 0);

        return {
          primary: { label: "Maximum IRA Contribution", value: `$${formatNumber(totalLimit, 0)}` },
          details: [
            { label: "Roth IRA Limit", value: `$${formatNumber(rothLimit, 0)}` },
            { label: "Traditional IRA Deductible Amount", value: `$${formatNumber(deductibleAmount, 0)}` },
            { label: "Traditional IRA Limit (non-deductible ok)", value: `$${formatNumber(totalLimit, 0)}` },
            { label: "Catch-Up Contribution (50+)", value: `$${formatNumber(catchUp, 0)}` },
            { label: "Backdoor Roth Eligible", value: rothLimit === 0 ? "Consider Backdoor Roth" : "Regular Roth available" },
          ],
        };
      },
    },
    {
      id: "growthProjection",
      name: "Max Contribution Growth",
      fields: [
        { name: "currentBalance", label: "Current IRA Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 7000" },
        { name: "yearsToRetirement", label: "Years to Retirement", type: "number", placeholder: "e.g. 25" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "isRoth", label: "Roth IRA? (0=Traditional, 1=Roth)", type: "number", placeholder: "e.g. 1" },
        { name: "taxRate", label: "Current Marginal Tax Rate (%)", type: "number", placeholder: "e.g. 24" },
      ],
      calculate: (inputs) => {
        const currentBalance = inputs.currentBalance as number || 0;
        const annualContribution = inputs.annualContribution as number;
        const yearsToRetirement = inputs.yearsToRetirement as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const isRoth = inputs.isRoth as number || 0;
        const taxRate = (inputs.taxRate as number) / 100;

        if (!annualContribution || !yearsToRetirement || !returnRate) return null;

        let balance = currentBalance;
        for (let i = 0; i < yearsToRetirement; i++) {
          balance = (balance + annualContribution) * (1 + returnRate);
        }

        const totalContributions = annualContribution * yearsToRetirement + currentBalance;
        const afterTaxValue = isRoth ? balance : balance * (1 - taxRate);
        const taxSavingsNow = isRoth ? 0 : annualContribution * taxRate;
        const annualTaxSavings = taxSavingsNow;

        return {
          primary: { label: "Projected Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "After-Tax Value (est.)", value: `$${formatNumber(afterTaxValue, 2)}` },
            { label: "Total Contributions", value: `$${formatNumber(totalContributions, 0)}` },
            { label: "Investment Growth", value: `$${formatNumber(balance - totalContributions, 0)}` },
            { label: "Account Type", value: isRoth ? "Roth IRA (tax-free withdrawals)" : "Traditional IRA (taxed at withdrawal)" },
            { label: "Annual Tax Savings (Traditional)", value: isRoth ? "N/A" : `$${formatNumber(annualTaxSavings, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roth-ira-calculator", "sep-ira-calculator", "simple-ira-calculator", "401k-calculator"],
  faq: [
    { question: "What is the IRA contribution limit?", answer: "For 2024, the IRA contribution limit is $7,000 ($8,000 if age 50+). This limit applies to the total of your Traditional and Roth IRA contributions combined." },
    { question: "Can I contribute to both a 401(k) and an IRA?", answer: "Yes, you can contribute to both. However, your Traditional IRA deduction may be limited if you or your spouse is covered by a workplace retirement plan and your income exceeds certain thresholds." },
  ],
  formula: "Limit = Base ($7,000) + Catch-Up ($1,000 if 50+); Phase-outs based on MAGI and filing status",
};
