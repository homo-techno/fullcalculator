import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carLoanCalculator: CalculatorDefinition = {
  slug: "car-loan-calculator",
  title: "Car Loan Calculator",
  description: "Free car loan calculator. Calculate monthly car payments, total interest, and compare auto loan options for new or used vehicles.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car loan calculator", "auto loan calculator", "car payment calculator", "vehicle loan calculator", "car finance calculator"],
  variants: [
    {
      id: "payment",
      name: "Monthly Car Payment",
      description: "Calculate monthly payment for a car loan",
      fields: [
        { name: "price", label: "Vehicle Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "tradeIn", label: "Trade-In Value", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 6.5", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "36 months (3 years)", value: "36" },
          { label: "48 months (4 years)", value: "48" },
          { label: "60 months (5 years)", value: "60" },
          { label: "72 months (6 years)", value: "72" },
          { label: "84 months (7 years)", value: "84" },
        ], defaultValue: "60" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const down = (inputs.downPayment as number) || 0;
        const tradeIn = (inputs.tradeIn as number) || 0;
        const apr = (inputs.rate as number) || 0;
        const months = parseInt(inputs.term as string) || 60;
        if (!price) return null;

        const principal = price - down - tradeIn;
        if (principal <= 0) return null;

        let payment: number;
        let totalInterest: number;
        if (apr === 0) {
          payment = principal / months;
          totalInterest = 0;
        } else {
          const r = apr / 100 / 12;
          payment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
          totalInterest = payment * months - principal;
        }

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(payment)}` },
          details: [
            { label: "Loan amount", value: `$${formatNumber(principal)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost", value: `$${formatNumber(payment * months)}` },
            { label: "Total out-of-pocket", value: `$${formatNumber(payment * months + down + tradeIn)}` },
          ],
        };
      },
    },
    {
      id: "afford",
      name: "How Much Car Can I Afford?",
      description: "Determine vehicle budget from desired monthly payment",
      fields: [
        { name: "payment", label: "Desired Monthly Payment", type: "number", placeholder: "e.g. 450", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 6.5", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "36 months", value: "36" }, { label: "48 months", value: "48" },
          { label: "60 months", value: "60" }, { label: "72 months", value: "72" },
        ], defaultValue: "60" },
      ],
      calculate: (inputs) => {
        const payment = inputs.payment as number;
        const down = (inputs.downPayment as number) || 0;
        const apr = (inputs.rate as number) || 0;
        const months = parseInt(inputs.term as string) || 60;
        if (!payment) return null;

        let loanAmount: number;
        if (apr === 0) {
          loanAmount = payment * months;
        } else {
          const r = apr / 100 / 12;
          loanAmount = payment * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
        }
        const totalBudget = loanAmount + down;

        return {
          primary: { label: "Max Vehicle Price", value: `$${formatNumber(totalBudget)}` },
          details: [
            { label: "Max loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Down payment", value: `$${formatNumber(down)}` },
            { label: "Total paid over loan", value: `$${formatNumber(payment * months + down)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["loan-calculator", "mortgage-calculator", "paycheck-calculator"],
  faq: [
    { question: "What is a good interest rate for a car loan?", answer: "As of 2024, good rates are 4-7% for new cars and 6-10% for used cars with good credit. Rates vary by credit score, lender, and loan term. Credit unions often offer lower rates." },
    { question: "How much should I put down on a car?", answer: "A common recommendation is 20% for new cars and 10% for used. A larger down payment lowers your monthly payment and total interest, and helps avoid being 'underwater' on the loan." },
  ],
  formula: "M = P × r(1+r)^n / ((1+r)^n - 1)",
};
