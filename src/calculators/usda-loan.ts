import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usdaLoanCalculator: CalculatorDefinition = {
  slug: "usda-loan-calculator",
  title: "USDA Loan Calculator",
  description:
    "Free USDA loan calculator. Estimate monthly payments for USDA rural development loans with zero down payment, including guarantee and annual fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "usda loan calculator",
    "usda mortgage calculator",
    "rural development loan",
    "usda home loan",
    "zero down mortgage",
  ],
  variants: [
    {
      id: "usda-payment",
      name: "USDA Loan Payment",
      description: "Calculate monthly payment for a USDA loan",
      fields: [
        {
          name: "homePrice",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment (optional)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.25",
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
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.homePrice as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.rate as number;
        const years = parseInt(inputs.term as string) || 30;
        if (!price || !rate) return null;

        const baseLoan = price - down;
        const guaranteeFee = baseLoan * 0.01;
        const loan = baseLoan + guaranteeFee;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const monthly =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const annualFee = baseLoan * 0.0035 / 12;
        const totalMonthly = monthly + annualFee;
        const totalPaid = totalMonthly * payments;
        const totalInterest = totalPaid - baseLoan;

        return {
          primary: {
            label: "Total Monthly Payment",
            value: `$${formatNumber(totalMonthly)}`,
          },
          details: [
            { label: "Principal & interest", value: `$${formatNumber(monthly)}` },
            { label: "Monthly guarantee fee", value: `$${formatNumber(annualFee)}` },
            { label: "Upfront guarantee fee (1%)", value: `$${formatNumber(guaranteeFee)}` },
            { label: "Total loan (with fee)", value: `$${formatNumber(loan)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "fha-loan-calculator"],
  faq: [
    {
      question: "What is a USDA loan?",
      answer:
        "A USDA loan is a zero-down-payment mortgage for eligible rural and suburban homebuyers backed by the U.S. Department of Agriculture with competitive rates and low mortgage insurance costs.",
    },
    {
      question: "What are USDA loan fees?",
      answer:
        "USDA loans have a 1% upfront guarantee fee (which can be rolled into the loan) and an annual fee of 0.35% of the remaining balance, paid monthly.",
    },
    {
      question: "Who qualifies for a USDA loan?",
      answer:
        "You must buy in an eligible rural area, meet income limits (typically 115% of area median income), have a credit score of 640+, and use the home as your primary residence.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1] + annual fee / 12",
};
