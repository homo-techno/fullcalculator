import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const loanCalculator: CalculatorDefinition = {
  slug: "loan-calculator",
  title: "Loan Calculator",
  description:
    "Free loan calculator. Calculate monthly payments, total interest, and payoff schedule for any loan — car, personal, or student loans.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "loan calculator",
    "car loan calculator",
    "personal loan calculator",
    "student loan calculator",
    "loan payment calculator",
  ],
  variants: [
    {
      id: "payment",
      name: "Loan Payment",
      description: "Calculate monthly payment for any loan",
      fields: [
        {
          name: "amount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 5.5",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term (months)",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "mo",
          min: 1,
          max: 600,
        },
      ],
      calculate: (inputs) => {
        const P = inputs.amount as number;
        const annualRate = inputs.rate as number;
        const months = inputs.term as number;
        if (!P || !annualRate || !months) return null;

        const r = annualRate / 100 / 12;
        const payment = (P * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
        const totalPaid = payment * months;
        const totalInterest = totalPaid - P;

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(payment)}` },
          details: [
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
            {
              label: "Interest / Principal ratio",
              value: `${formatNumber((totalInterest / P) * 100)}%`,
            },
          ],
        };
      },
    },
    {
      id: "payoff",
      name: "Payoff Time",
      description: "How long to pay off a loan with a fixed monthly payment",
      fields: [
        {
          name: "amount",
          label: "Remaining Balance",
          type: "number",
          placeholder: "e.g. 15000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 5.5",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.01,
        },
        {
          name: "payment",
          label: "Monthly Payment",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const P = inputs.amount as number;
        const annualRate = inputs.rate as number;
        const payment = inputs.payment as number;
        if (!P || !annualRate || !payment) return null;

        const r = annualRate / 100 / 12;
        const minPayment = P * r;

        if (payment <= minPayment) {
          return {
            primary: { label: "Result", value: "Payment too low" },
            note: `Minimum payment to cover interest is $${formatNumber(minPayment)}. Increase your monthly payment.`,
          };
        }

        const months = Math.ceil(
          -Math.log(1 - (P * r) / payment) / Math.log(1 + r)
        );
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        const totalPaid = payment * months;
        const totalInterest = totalPaid - P;

        return {
          primary: {
            label: "Payoff Time",
            value: `${years} years ${remainingMonths} months`,
          },
          details: [
            { label: "Total payments", value: `${months} months` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "compound-interest-calculator", "percentage-calculator"],
  faq: [
    {
      question: "How is a loan payment calculated?",
      answer:
        "Monthly payment = P[r(1+r)^n]/[(1+r)^n-1], where P = loan amount, r = monthly interest rate, n = number of months. This formula assumes fixed-rate, fully amortizing loans.",
    },
    {
      question: "What is a good interest rate for a personal loan?",
      answer:
        "As of 2026, good personal loan rates range from 6-12% for excellent credit (750+), 12-18% for good credit (700-749), and 18-30% for fair credit. Rates vary by lender, loan amount, and term.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
