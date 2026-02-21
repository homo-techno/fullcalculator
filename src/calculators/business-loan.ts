import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessLoanCalculator: CalculatorDefinition = {
  slug: "business-loan-calculator",
  title: "Business Loan Calculator",
  description:
    "Free business loan calculator. Estimate monthly payments, total cost, and effective APR including origination fees for business financing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["business loan", "SBA loan", "commercial loan", "loan payment", "APR"],
  variants: [
    {
      id: "standard",
      name: "Loan Payment",
      fields: [
        { name: "loanAmount", label: "Loan Amount ($)", type: "number", placeholder: "e.g. 250000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 7" },
        { name: "loanTerm", label: "Loan Term (years)", type: "number", placeholder: "e.g. 10" },
        { name: "originationFee", label: "Origination Fee (%)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const loanAmount = inputs.loanAmount as number;
        const interestRate = inputs.interestRate as number;
        const loanTerm = inputs.loanTerm as number;
        const originationFee = inputs.originationFee as number || 0;

        if (!loanAmount || !interestRate || !loanTerm) return null;

        const monthlyRate = (interestRate / 100) / 12;
        const totalMonths = loanTerm * 12;
        const feeAmount = loanAmount * (originationFee / 100);
        const netProceeds = loanAmount - feeAmount;

        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

        const totalPaid = monthlyPayment * totalMonths;
        const totalInterest = totalPaid - loanAmount;
        const totalCost = totalInterest + feeAmount;

        // Effective APR: actual rate considering fees (approximate using Newton's method)
        // The effective rate is the rate that makes PV of payments = net proceeds
        let effRate = monthlyRate;
        for (let i = 0; i < 100; i++) {
          const pvPayments = monthlyPayment * ((1 - Math.pow(1 + effRate, -totalMonths)) / effRate);
          const pvDeriv = monthlyPayment * (
            (-totalMonths * Math.pow(1 + effRate, -totalMonths - 1) * effRate - (1 - Math.pow(1 + effRate, -totalMonths))) /
            (effRate * effRate)
          );
          const diff = pvPayments - netProceeds;
          if (Math.abs(diff) < 0.01) break;
          effRate = effRate - diff / pvDeriv;
        }
        const effectiveAPR = effRate * 12 * 100;

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(monthlyPayment, 2)}` },
          details: [
            { label: "Total Interest", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Origination Fee", value: `$${formatNumber(feeAmount, 2)}` },
            { label: "Net Loan Proceeds", value: `$${formatNumber(netProceeds, 2)}` },
            { label: "Total Cost of Borrowing", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Total Amount Paid", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Effective APR", value: `${formatNumber(effectiveAPR, 2)}%` },
            { label: "Stated Rate", value: `${formatNumber(interestRate, 2)}%` },
          ],
        };
      },
    },
    {
      id: "affordability",
      name: "How Much Can I Borrow?",
      fields: [
        { name: "monthlyBudget", label: "Monthly Payment Budget ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 7" },
        { name: "loanTerm", label: "Loan Term (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const monthlyBudget = inputs.monthlyBudget as number;
        const interestRate = inputs.interestRate as number;
        const loanTerm = inputs.loanTerm as number;

        if (!monthlyBudget || !interestRate || !loanTerm) return null;

        const monthlyRate = (interestRate / 100) / 12;
        const totalMonths = loanTerm * 12;

        // PV of annuity = PMT × [(1 - (1+r)^-n) / r]
        const maxLoan = monthlyBudget * ((1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate);
        const totalPaid = monthlyBudget * totalMonths;
        const totalInterest = totalPaid - maxLoan;

        return {
          primary: { label: "Maximum Loan Amount", value: `$${formatNumber(maxLoan, 2)}` },
          details: [
            { label: "Monthly Payment", value: `$${formatNumber(monthlyBudget, 2)}` },
            { label: "Total Amount Paid", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Total Interest", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Loan Term", value: `${loanTerm} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-loan-calculator", "depreciation-calculator", "npv-calculator"],
  faq: [
    { question: "What is an origination fee?", answer: "An origination fee is an upfront charge by the lender to process the loan, typically 1-5% of the loan amount. It reduces your net proceeds but doesn't change the monthly payment, increasing the effective APR." },
    { question: "What is effective APR?", answer: "Effective APR accounts for all fees and costs of borrowing, not just the interest rate. It reflects the true cost of the loan and is always equal to or higher than the stated interest rate." },
  ],
  formula: "Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]; Effective APR includes origination fees in the cost calculation",
};
