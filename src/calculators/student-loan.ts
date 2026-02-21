import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentLoanCalculator: CalculatorDefinition = {
  slug: "student-loan-calculator",
  title: "Student Loan Calculator",
  description:
    "Free student loan calculator. Estimate monthly payments, total interest, and compare standard vs extended repayment plans.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["student loan", "student debt", "loan repayment", "interest", "education loan"],
  variants: [
    {
      id: "standard",
      name: "Standard Repayment",
      fields: [
        { name: "loanBalance", label: "Loan Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
        { name: "loanTerm", label: "Loan Term (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const loanBalance = inputs.loanBalance as number;
        const interestRate = inputs.interestRate as number;
        const loanTerm = inputs.loanTerm as number;

        if (!loanBalance || !interestRate || !loanTerm) return null;

        const monthlyRate = (interestRate / 100) / 12;
        const totalMonths = loanTerm * 12;

        const monthlyPayment = loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

        const totalPaid = monthlyPayment * totalMonths;
        const totalInterest = totalPaid - loanBalance;

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(monthlyPayment, 2)}` },
          details: [
            { label: "Total Amount Paid", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Total Interest", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Interest as % of Principal", value: `${formatNumber((totalInterest / loanBalance) * 100, 1)}%` },
            { label: "Payoff Date", value: `${loanTerm} years` },
            { label: "Biweekly Payment", value: `$${formatNumber(monthlyPayment / 2, 2)}` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Standard vs Extended",
      fields: [
        { name: "loanBalance", label: "Loan Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
      ],
      calculate: (inputs) => {
        const loanBalance = inputs.loanBalance as number;
        const interestRate = inputs.interestRate as number;

        if (!loanBalance || !interestRate) return null;

        const monthlyRate = (interestRate / 100) / 12;

        // Standard: 10 years
        const standardMonths = 120;
        const standardPayment = loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, standardMonths)) /
          (Math.pow(1 + monthlyRate, standardMonths) - 1);
        const standardTotal = standardPayment * standardMonths;
        const standardInterest = standardTotal - loanBalance;

        // Extended: 25 years
        const extendedMonths = 300;
        const extendedPayment = loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, extendedMonths)) /
          (Math.pow(1 + monthlyRate, extendedMonths) - 1);
        const extendedTotal = extendedPayment * extendedMonths;
        const extendedInterest = extendedTotal - loanBalance;

        return {
          primary: { label: "Standard Monthly Payment (10yr)", value: `$${formatNumber(standardPayment, 2)}` },
          details: [
            { label: "Standard Total Interest", value: `$${formatNumber(standardInterest, 2)}` },
            { label: "Standard Total Paid", value: `$${formatNumber(standardTotal, 2)}` },
            { label: "Extended Monthly Payment (25yr)", value: `$${formatNumber(extendedPayment, 2)}` },
            { label: "Extended Total Interest", value: `$${formatNumber(extendedInterest, 2)}` },
            { label: "Extended Total Paid", value: `$${formatNumber(extendedTotal, 2)}` },
            { label: "Monthly Savings (Extended)", value: `$${formatNumber(standardPayment - extendedPayment, 2)}` },
            { label: "Extra Interest Cost (Extended)", value: `$${formatNumber(extendedInterest - standardInterest, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "debt-snowball-calculator", "college-savings-calculator"],
  faq: [
    { question: "What is the standard repayment plan?", answer: "The standard repayment plan is a 10-year fixed payment plan. It results in higher monthly payments but less total interest compared to extended plans." },
    { question: "Should I choose standard or extended repayment?", answer: "Standard repayment saves significantly on interest. Choose extended only if you cannot afford the standard payment. Consider refinancing if you have good credit for potentially lower rates." },
  ],
  formula: "Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1], where P = principal, r = monthly rate, n = total months",
};
