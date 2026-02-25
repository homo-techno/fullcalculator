import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bridgeLoanCalculator: CalculatorDefinition = {
  slug: "bridge-loan-calculator",
  title: "Bridge Loan Calculator",
  description:
    "Free bridge loan calculator. Estimate short-term bridge financing costs, monthly interest payments, and total fees when buying a new home before selling your current one.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "bridge loan calculator",
    "bridge financing calculator",
    "swing loan calculator",
    "interim financing",
    "bridge mortgage",
  ],
  variants: [
    {
      id: "bridge-cost",
      name: "Bridge Loan Cost",
      description: "Calculate the cost of bridge financing",
      fields: [
        {
          name: "loanAmount",
          label: "Bridge Loan Amount",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 9.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Duration",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
            { label: "9 months", value: "9" },
            { label: "12 months", value: "12" },
          ],
          defaultValue: "6",
        },
        {
          name: "originationFee",
          label: "Origination Fee",
          type: "select",
          options: [
            { label: "1%", value: "1" },
            { label: "1.5%", value: "1.5" },
            { label: "2%", value: "2" },
            { label: "3%", value: "3" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.rate as number;
        const months = parseInt(inputs.term as string) || 6;
        const origPct = parseFloat(inputs.originationFee as string) || 2;
        if (!loan || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const monthlyInterest = loan * monthlyRate;
        const totalInterest = monthlyInterest * months;
        const originationFeeAmt = loan * (origPct / 100);
        const totalCost = totalInterest + originationFeeAmt;
        const effectiveRate = (totalCost / loan) * (12 / months) * 100;

        return {
          primary: {
            label: "Monthly Interest Payment",
            value: `$${formatNumber(monthlyInterest)}`,
          },
          details: [
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Origination fee", value: `$${formatNumber(originationFeeAmt)}` },
            { label: "Total cost of bridge loan", value: `$${formatNumber(totalCost)}` },
            { label: "Effective annual rate", value: `${formatNumber(effectiveRate)}` + "%" },
            { label: "Amount due at payoff", value: `$${formatNumber(loan + totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "hard-money-loan-calculator"],
  faq: [
    {
      question: "What is a bridge loan?",
      answer:
        "A bridge loan is short-term financing that bridges the gap between buying a new home and selling your current one. It uses your current home equity as collateral and typically lasts 6-12 months.",
    },
    {
      question: "Are bridge loans expensive?",
      answer:
        "Yes, bridge loans have higher interest rates (typically 8-12%) and origination fees (1-3%). They are designed as temporary solutions and should be repaid quickly when your existing home sells.",
    },
    {
      question: "What are alternatives to bridge loans?",
      answer:
        "Alternatives include HELOCs, home equity loans, 401(k) loans, contingent offers, or selling your current home before buying. Each has trade-offs in cost, speed, and risk.",
    },
  ],
  formula: "Monthly interest = Loan x (Rate / 12). Total cost = Interest + Origination fee",
};
