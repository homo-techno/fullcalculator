import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementAccountConsolidationCalculator: CalculatorDefinition = {
  slug: "retirement-account-consolidation-calculator",
  title: "Retirement Account Consolidation Calculator",
  description: "Evaluate the potential fee savings and simplification benefits of consolidating multiple retirement accounts into fewer accounts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement account consolidation","401k rollover calculator","IRA consolidation","combine retirement accounts"],
  variants: [{
    id: "standard",
    name: "Retirement Account Consolidation",
    description: "Evaluate the potential fee savings and simplification benefits of consolidating multiple retirement accounts into fewer accounts.",
    fields: [
      { name: "account1Balance", label: "Account 1 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 150000 },
      { name: "account1Fee", label: "Account 1 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.85 },
      { name: "account2Balance", label: "Account 2 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 75000 },
      { name: "account2Fee", label: "Account 2 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 1.2 },
      { name: "account3Balance", label: "Account 3 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 50000 },
      { name: "account3Fee", label: "Account 3 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.95 },
      { name: "consolidatedFee", label: "Consolidated Account Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.25 },
      { name: "yearsToProject", label: "Years to Project", type: "number", min: 5, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const b1 = inputs.account1Balance as number;
    const f1 = inputs.account1Fee as number / 100;
    const b2 = inputs.account2Balance as number;
    const f2 = inputs.account2Fee as number / 100;
    const b3 = inputs.account3Balance as number;
    const f3 = inputs.account3Fee as number / 100;
    const cf = inputs.consolidatedFee as number / 100;
    const years = inputs.yearsToProject as number;
    const totalBalance = b1 + b2 + b3;
    const currentFees = b1 * f1 + b2 * f2 + b3 * f3;
    const consolidatedFees = totalBalance * cf;
    const annualSavings = currentFees - consolidatedFees;
    const weightedFee = totalBalance > 0 ? (currentFees / totalBalance) * 100 : 0;
    let totalSavings = 0;
    for (let y = 0; y < years; y++) {
      totalSavings += annualSavings * Math.pow(1.06, y);
    }
    return {
      primary: { label: "Annual Fee Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
      details: [
        { label: "Current Total Fees", value: "$" + formatNumber(Math.round(currentFees)) + "/yr" },
        { label: "Consolidated Fees", value: "$" + formatNumber(Math.round(consolidatedFees)) + "/yr" },
        { label: "Current Weighted Fee", value: formatNumber(Math.round(weightedFee * 100) / 100) + "%" },
        { label: "Total Balance", value: "$" + formatNumber(Math.round(totalBalance)) },
        { label: "Projected Savings Over " + formatNumber(years) + " Years", value: "$" + formatNumber(Math.round(totalSavings)) }
      ]
    };
  },
  }],
  relatedSlugs: ["401k-employer-match-maximizer-calculator","roth-conversion-ladder-calculator"],
  faq: [
    { question: "Should I consolidate my retirement accounts?", answer: "Consolidation often makes sense when you have multiple old 401k plans with high fees. Benefits include simplified management, potentially lower fees, easier asset allocation, and streamlined required minimum distributions. However, consider any unique benefits of existing plans before rolling over." },
    { question: "What is the difference between a rollover and a transfer?", answer: "A direct transfer (trustee-to-trustee) moves funds between accounts without you touching the money, avoiding withholding and penalties. A rollover gives you the funds for up to 60 days, during which you must deposit them into the new account to avoid taxes and penalties." },
    { question: "Can I roll a 401k into an IRA?", answer: "Yes, you can roll a traditional 401k into a traditional IRA or a Roth 401k into a Roth IRA tax-free. Rolling a traditional 401k into a Roth IRA triggers a taxable Roth conversion on the full amount." },
  ],
  formula: "Current Annual Fees = Sum of (Balance x Fee %) for each account; Consolidated Fees = Total Balance x New Fee %; Annual Savings = Current Fees - Consolidated Fees; Projected Savings = Sum of Annual Savings x (1.06)^year",
};
