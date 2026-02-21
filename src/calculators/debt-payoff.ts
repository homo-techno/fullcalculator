import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const debtPayoffCalculator: CalculatorDefinition = {
  slug: "debt-payoff-calculator",
  title: "Debt Payoff Calculator",
  description: "Free debt payoff calculator. Calculate how long it will take to pay off your debt and how much interest you'll pay. Compare payoff strategies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt payoff calculator", "debt calculator", "credit card payoff calculator", "debt repayment calculator", "how long to pay off debt"],
  variants: [
    {
      id: "payoff",
      name: "Debt Payoff Timeline",
      description: "Calculate how long to pay off debt with fixed monthly payments",
      fields: [
        { name: "balance", label: "Current Balance", type: "number", placeholder: "e.g. 15000", prefix: "$" },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 18.9", suffix: "%" },
        { name: "payment", label: "Monthly Payment", type: "number", placeholder: "e.g. 400", prefix: "$" },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = (inputs.rate as number) || 0;
        const payment = inputs.payment as number;
        if (!balance || !payment) return null;

        if (apr === 0) {
          const months = Math.ceil(balance / payment);
          return {
            primary: { label: "Payoff Time", value: `${months} months` },
            details: [
              { label: "Total paid", value: `$${formatNumber(balance)}` },
              { label: "Interest paid", value: "$0" },
            ],
          };
        }

        const r = apr / 100 / 12;
        const minPayment = balance * r;
        if (payment <= minPayment) {
          return {
            primary: { label: "Payoff Time", value: "Never" },
            details: [
              { label: "Monthly interest charge", value: `$${formatNumber(minPayment)}` },
              { label: "Minimum payment needed", value: `$${formatNumber(minPayment + 1)}` },
            ],
            note: "Your payment doesn't cover the monthly interest. Increase your payment to start paying down the principal.",
          };
        }

        const months = Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
        const totalPaid = payment * months;
        const totalInterest = totalPaid - balance;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        const timeStr = years > 0 ? `${years} yr ${remainingMonths} mo` : `${months} months`;

        return {
          primary: { label: "Payoff Time", value: timeStr },
          details: [
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Interest as % of debt", value: `${formatNumber((totalInterest / balance) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Payment to Hit Target Date",
      description: "Calculate the monthly payment needed to pay off debt by a target date",
      fields: [
        { name: "balance", label: "Current Balance", type: "number", placeholder: "e.g. 15000", prefix: "$" },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 18.9", suffix: "%" },
        { name: "months", label: "Payoff Goal (Months)", type: "number", placeholder: "e.g. 24", min: 1 },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = (inputs.rate as number) || 0;
        const months = inputs.months as number;
        if (!balance || !months) return null;

        let payment: number;
        if (apr === 0) {
          payment = balance / months;
        } else {
          const r = apr / 100 / 12;
          payment = balance * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        }
        const totalPaid = payment * months;
        const totalInterest = totalPaid - balance;

        return {
          primary: { label: "Required Monthly Payment", value: `$${formatNumber(payment)}` },
          details: [
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Payoff in", value: `${months} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["loan-calculator", "compound-interest-calculator", "savings-goal-calculator"],
  faq: [
    { question: "Should I pay off debt or save money?", answer: "Generally, pay off high-interest debt first (above 7-8%). The guaranteed 'return' from eliminating 18% credit card debt exceeds typical investment returns. Keep a small emergency fund ($1,000) while paying off debt." },
    { question: "What is the debt snowball vs avalanche method?", answer: "Snowball: pay off smallest balances first for psychological wins. Avalanche: pay off highest interest rates first to minimize total interest. Avalanche saves more money, but snowball keeps you motivated." },
  ],
  formula: "Months = -ln(1 - Br/P) / ln(1+r) where B=balance, r=monthly rate, P=payment",
};
