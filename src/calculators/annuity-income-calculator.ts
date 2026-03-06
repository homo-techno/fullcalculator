import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annuityIncomeCalculator: CalculatorDefinition = {
  slug: "annuity-income-calculator",
  title: "Annuity Income Calculator",
  description: "Calculate the monthly income you can expect from a fixed or immediate annuity based on your lump sum investment, interest rate, and payout period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["annuity income","annuity payout estimator","immediate annuity calculator","fixed annuity income"],
  variants: [{
    id: "standard",
    name: "Annuity Income",
    description: "Calculate the monthly income you can expect from a fixed or immediate annuity based on your lump sum investment, interest rate, and payout period.",
    fields: [
      { name: "lumpSum", label: "Lump Sum Investment ($)", type: "number", min: 10000, max: 10000000, defaultValue: 250000 },
      { name: "interestRate", label: "Annual Interest Rate (%)", type: "number", min: 0.5, max: 12, defaultValue: 5 },
      { name: "payoutYears", label: "Payout Period (Years)", type: "number", min: 5, max: 50, defaultValue: 20 },
      { name: "startAge", label: "Age at Annuity Start", type: "number", min: 50, max: 90, defaultValue: 65 },
    ],
    calculate: (inputs) => {
    const lump = inputs.lumpSum as number;
    const rate = inputs.interestRate as number / 100;
    const years = inputs.payoutYears as number;
    const startAge = inputs.startAge as number;
    const monthlyRate = rate / 12;
    const totalPayments = years * 12;
    const monthlyPayout = monthlyRate > 0 ? lump * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments)) : lump / totalPayments;
    const annualPayout = monthlyPayout * 12;
    const totalPayout = monthlyPayout * totalPayments;
    const totalInterest = totalPayout - lump;
    const endAge = startAge + years;
    return {
      primary: { label: "Monthly Annuity Income", value: "$" + formatNumber(Math.round(monthlyPayout)) },
      details: [
        { label: "Annual Income", value: "$" + formatNumber(Math.round(annualPayout)) },
        { label: "Total Payouts Over Period", value: "$" + formatNumber(Math.round(totalPayout)) },
        { label: "Total Interest Earned", value: "$" + formatNumber(Math.round(totalInterest)) },
        { label: "Payments Until Age", value: formatNumber(endAge) }
      ]
    };
  },
  }],
  relatedSlugs: ["pension-vs-lump-sum-calculator","retirement-income-gap-calculator"],
  faq: [
    { question: "What is an immediate annuity?", answer: "An immediate annuity is a contract where you pay a lump sum to an insurance company and begin receiving regular income payments right away, typically within 30 days. Payments can be fixed or variable and can last for a set period or for life." },
    { question: "Are annuity payments taxable?", answer: "Part of each annuity payment from a non-qualified annuity is a tax-free return of principal, while the earnings portion is taxed as ordinary income. Qualified annuity payments from IRAs or 401k plans are fully taxable as ordinary income." },
    { question: "What is the difference between fixed and variable annuities?", answer: "Fixed annuities provide guaranteed periodic payments at a set interest rate. Variable annuities invest in subaccounts similar to mutual funds, and payments fluctuate based on investment performance." },
  ],
  formula: "Monthly Payment = (Lump Sum x Monthly Rate) / (1 - (1 + Monthly Rate)^(-Total Payments)); Monthly Rate = Annual Rate / 12; Total Payments = Payout Years x 12",
};
