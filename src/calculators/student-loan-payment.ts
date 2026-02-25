import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentLoanPaymentCalculator: CalculatorDefinition = {
  slug: "student-loan-payment-calculator",
  title: "Student Loan Monthly Payment",
  description:
    "Free student loan monthly payment calculator. Calculate your monthly student loan payment, total interest, and payoff timeline.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "student loan payment calculator",
    "student loan monthly payment",
    "loan repayment calculator",
    "student debt payment",
    "federal loan payment",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Repayment",
      description: "Calculate monthly payment on the standard 10-year repayment plan",
      fields: [
        { name: "loanAmount", label: "Total Loan Amount ($)", type: "number", placeholder: "e.g. 30000", min: 0 },
        { name: "interestRate", label: "Annual Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", min: 0, max: 20, step: 0.1 },
        { name: "loanTerm", label: "Repayment Term (years)", type: "number", placeholder: "e.g. 10", min: 1, max: 30, defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const principal = inputs.loanAmount as number;
        const annualRate = inputs.interestRate as number;
        const years = (inputs.loanTerm as number) || 10;
        if (!principal || annualRate === undefined) return null;

        const monthlyRate = annualRate / 100 / 12;
        const numPayments = years * 12;

        let monthlyPayment: number;
        if (monthlyRate === 0) {
          monthlyPayment = principal / numPayments;
        } else {
          monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const totalPaid = monthlyPayment * numPayments;
        const totalInterest = totalPaid - principal;
        const interestPercent = (totalInterest / principal) * 100;

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(monthlyPayment, 2)}` },
          details: [
            { label: "Total amount paid", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Interest as % of principal", value: `${formatNumber(interestPercent, 1)}%` },
            { label: "Number of payments", value: formatNumber(numPayments, 0) },
          ],
        };
      },
    },
    {
      id: "extra-payment",
      name: "Extra Payment Impact",
      description: "See how extra monthly payments can reduce your payoff time and interest",
      fields: [
        { name: "loanAmount", label: "Loan Amount ($)", type: "number", placeholder: "e.g. 30000", min: 0 },
        { name: "interestRate", label: "Annual Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", min: 0, max: 20, step: 0.1 },
        { name: "currentPayment", label: "Current Monthly Payment ($)", type: "number", placeholder: "e.g. 325", min: 0 },
        { name: "extraPayment", label: "Extra Monthly Payment ($)", type: "number", placeholder: "e.g. 100", min: 0 },
      ],
      calculate: (inputs) => {
        const principal = inputs.loanAmount as number;
        const annualRate = inputs.interestRate as number;
        const payment = inputs.currentPayment as number;
        const extra = (inputs.extraPayment as number) || 0;
        if (!principal || annualRate === undefined || !payment) return null;

        const monthlyRate = annualRate / 100 / 12;

        // Standard payoff
        let balance = principal;
        let standardMonths = 0;
        let standardInterest = 0;
        while (balance > 0 && standardMonths < 600) {
          const interest = balance * monthlyRate;
          standardInterest += interest;
          balance = balance + interest - payment;
          standardMonths++;
          if (balance < 0) balance = 0;
        }

        // With extra payment
        balance = principal;
        let extraMonths = 0;
        let extraInterest = 0;
        const totalPayment = payment + extra;
        while (balance > 0 && extraMonths < 600) {
          const interest = balance * monthlyRate;
          extraInterest += interest;
          balance = balance + interest - totalPayment;
          extraMonths++;
          if (balance < 0) balance = 0;
        }

        const monthsSaved = standardMonths - extraMonths;
        const interestSaved = standardInterest - extraInterest;

        return {
          primary: { label: "Time Saved", value: `${formatNumber(monthsSaved, 0)} months` },
          details: [
            { label: "Interest saved", value: `$${formatNumber(interestSaved, 2)}` },
            { label: "New payoff time", value: `${formatNumber(extraMonths, 0)} months (${formatNumber(extraMonths / 12, 1)} yrs)` },
            { label: "Original payoff time", value: `${formatNumber(standardMonths, 0)} months (${formatNumber(standardMonths / 12, 1)} yrs)` },
            { label: "New monthly payment", value: `$${formatNumber(totalPayment, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-loan-calculator", "loan-calculator"],
  faq: [
    {
      question: "What is the standard student loan repayment plan?",
      answer:
        "The standard federal student loan repayment plan is 10 years with fixed monthly payments. Income-driven plans can extend to 20-25 years with lower payments.",
    },
    {
      question: "Should I pay extra on my student loans?",
      answer:
        "Paying extra can save thousands in interest and shorten your repayment. Even $50-$100 extra per month makes a significant difference. Always verify extra payments go toward principal.",
    },
  ],
  formula: "Monthly Payment = P x [r(1+r)^n] / [(1+r)^n - 1]",
};
