import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const helocCalculator: CalculatorDefinition = {
  slug: "heloc-calculator",
  title: "HELOC Calculator",
  description:
    "Free HELOC calculator. Estimate your home equity line of credit amount, monthly payments, and interest costs during draw and repayment periods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "HELOC calculator",
    "home equity line of credit",
    "HELOC payment calculator",
    "HELOC interest calculator",
    "home equity credit line",
  ],
  variants: [
    {
      id: "credit-limit",
      name: "HELOC Credit Limit",
      description: "Estimate your maximum HELOC borrowing amount",
      fields: [
        { name: "homeValue", label: "Home Value", type: "number", placeholder: "e.g. 500000", prefix: "$", min: 0 },
        { name: "mortgageBalance", label: "Mortgage Balance", type: "number", placeholder: "e.g. 250000", prefix: "$", min: 0 },
        {
          name: "ltvLimit",
          label: "Max Combined LTV",
          type: "select",
          options: [
            { label: "80%", value: "80" },
            { label: "85%", value: "85" },
            { label: "90%", value: "90" },
          ],
          defaultValue: "80",
        },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const balance = (inputs.mortgageBalance as number) || 0;
        const ltvLimit = parseInt(inputs.ltvLimit as string) || 80;
        if (!homeValue) return null;

        const maxBorrow = homeValue * (ltvLimit / 100);
        const equity = homeValue - balance;
        const helocLimit = Math.max(0, maxBorrow - balance);
        const equityPercent = (equity / homeValue) * 100;

        return {
          primary: { label: "Max HELOC Amount", value: `$${formatNumber(helocLimit)}` },
          details: [
            { label: "Home equity", value: `$${formatNumber(equity)}` },
            { label: "Equity percentage", value: `${formatNumber(equityPercent)}%` },
            { label: "Max borrowable (at LTV)", value: `$${formatNumber(maxBorrow)}` },
            { label: "Current mortgage balance", value: `$${formatNumber(balance)}` },
          ],
          note: equityPercent < 20 ? "You may need at least 20% equity to qualify for a HELOC." : undefined,
        };
      },
    },
    {
      id: "payment",
      name: "HELOC Payment Estimate",
      description: "Estimate monthly payments on a HELOC draw",
      fields: [
        { name: "drawAmount", label: "Amount Drawn", type: "number", placeholder: "e.g. 50000", prefix: "$", min: 0 },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 8.5", suffix: "%", min: 0, max: 30, step: 0.01 },
        {
          name: "period",
          label: "Payment Phase",
          type: "select",
          options: [
            { label: "Draw period (interest only)", value: "draw" },
            { label: "Repayment period (P+I)", value: "repayment" },
          ],
          defaultValue: "draw",
        },
        {
          name: "repaymentYears",
          label: "Repayment Term",
          type: "select",
          options: [
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "20",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.drawAmount as number;
        const rate = inputs.rate as number;
        const period = inputs.period as string;
        const repayYears = parseInt(inputs.repaymentYears as string) || 20;
        if (!amount || !rate) return null;

        const monthlyRate = rate / 100 / 12;

        if (period === "draw") {
          const interestOnly = amount * monthlyRate;
          const annualInterest = interestOnly * 12;
          return {
            primary: { label: "Monthly Payment (Interest Only)", value: `$${formatNumber(interestOnly)}` },
            details: [
              { label: "Annual interest cost", value: `$${formatNumber(annualInterest)}` },
              { label: "Draw amount", value: `$${formatNumber(amount)}` },
              { label: "Principal paid", value: "$0" },
            ],
            note: "During the draw period you pay only interest. The full balance remains.",
          };
        }

        const n = repayYears * 12;
        const monthly = (amount * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - amount;

        return {
          primary: { label: "Monthly Payment (P+I)", value: `$${formatNumber(monthly)}` },
          details: [
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Repayment term", value: `${repayYears} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-equity-calculator", "mortgage-calculator", "home-value-calculator"],
  faq: [
    {
      question: "How is a HELOC different from a home equity loan?",
      answer:
        "A HELOC is a revolving credit line (like a credit card) secured by your home, with variable rates and a draw period. A home equity loan provides a lump sum with fixed monthly payments and a fixed rate.",
    },
    {
      question: "How much HELOC can I get?",
      answer:
        "Most lenders allow a combined loan-to-value (CLTV) ratio of 80-90%. If your home is worth $500,000 and you owe $300,000, at 80% CLTV you can borrow up to $100,000 via HELOC ($500K × 80% − $300K).",
    },
    {
      question: "What are the draw and repayment periods?",
      answer:
        "A typical HELOC has a 5-10 year draw period where you can borrow and make interest-only payments, followed by a 10-20 year repayment period where you pay principal plus interest on the outstanding balance.",
    },
  ],
  formula:
    "HELOC Limit = (Home Value × Max LTV%) − Mortgage Balance | Interest-Only Payment = Balance × (APR / 12) | P+I Payment = Balance × [r(1+r)^n] / [(1+r)^n − 1]",
};
