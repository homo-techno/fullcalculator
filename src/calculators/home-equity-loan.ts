import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeEquityLoanCalculator: CalculatorDefinition = {
  slug: "home-equity-loan-calculator",
  title: "Home Equity Loan Calculator",
  description:
    "Free home equity loan calculator. Estimate monthly payments and total interest on a home equity loan based on your available equity, rate, and term.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home equity loan calculator",
    "second mortgage calculator",
    "equity loan payment",
    "home equity borrowing",
    "HEL calculator",
  ],
  variants: [
    {
      id: "equity-payment",
      name: "Equity Loan Payment",
      description: "Calculate monthly payment on a home equity loan",
      fields: [
        {
          name: "homeValue",
          label: "Current Home Value",
          type: "number",
          placeholder: "e.g. 450000",
          prefix: "$",
          min: 0,
        },
        {
          name: "mortgageBalance",
          label: "Current Mortgage Balance",
          type: "number",
          placeholder: "e.g. 280000",
          prefix: "$",
          min: 0,
        },
        {
          name: "loanAmount",
          label: "Desired Loan Amount",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 8.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const balance = (inputs.mortgageBalance as number) || 0;
        const loan = inputs.loanAmount as number;
        const rate = inputs.rate as number;
        const years = parseInt(inputs.term as string) || 10;
        if (!homeValue || !loan || !rate) return null;

        const equity = homeValue - balance;
        const maxBorrow = homeValue * 0.85 - balance;
        const ltv = ((balance + loan) / homeValue) * 100;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const monthly =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const totalPaid = monthly * payments;
        const totalInterest = totalPaid - loan;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Available equity", value: `$${formatNumber(equity)}` },
            { label: "Max borrowable (85% LTV)", value: `$${formatNumber(maxBorrow)}` },
            { label: "Combined LTV", value: `${formatNumber(ltv)}` + "%" },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heloc-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "What is a home equity loan?",
      answer:
        "A home equity loan is a fixed-rate, lump-sum loan secured by your home equity. Unlike a HELOC, it provides all funds upfront with fixed monthly payments over a set term.",
    },
    {
      question: "How much can I borrow?",
      answer:
        "Most lenders allow you to borrow up to 85% of your home value minus your mortgage balance. Some may go up to 90% for well-qualified borrowers.",
    },
    {
      question: "Home equity loan vs HELOC?",
      answer:
        "A home equity loan gives a lump sum at a fixed rate. A HELOC is a revolving credit line with variable rates. Choose a loan for one-time expenses and a HELOC for ongoing needs.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
