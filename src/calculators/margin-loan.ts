import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marginLoanCalculator: CalculatorDefinition = {
  slug: "margin-loan-calculator",
  title: "Margin Loan Calculator",
  description:
    "Free margin loan calculator. Estimate the cost of borrowing on margin, calculate interest charges, and understand margin call thresholds for your investment portfolio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "margin loan calculator",
    "margin interest calculator",
    "margin call calculator",
    "brokerage margin",
    "securities lending",
    "portfolio margin",
  ],
  variants: [
    {
      id: "margin-loan-cost",
      name: "Margin Loan Cost",
      description: "Calculate margin loan interest and margin call levels",
      fields: [
        {
          name: "portfolioValue",
          label: "Portfolio Value",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "marginBorrowed",
          label: "Amount Borrowed on Margin",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "marginRate",
          label: "Margin Interest Rate",
          type: "number",
          placeholder: "e.g. 9.5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.01,
        },
        {
          name: "holdingPeriod",
          label: "Expected Holding Period",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
            { label: "12 months", value: "12" },
            { label: "24 months", value: "24" },
          ],
          defaultValue: "12",
        },
        {
          name: "maintenanceMargin",
          label: "Maintenance Margin Requirement",
          type: "select",
          options: [
            { label: "25%", value: "25" },
            { label: "30%", value: "30" },
            { label: "35%", value: "35" },
            { label: "40%", value: "40" },
          ],
          defaultValue: "25",
        },
      ],
      calculate: (inputs) => {
        const portfolio = inputs.portfolioValue as number;
        const borrowed = inputs.marginBorrowed as number;
        const rate = inputs.marginRate as number;
        const months = parseInt(inputs.holdingPeriod as string) || 12;
        const maintenancePct = parseFloat(inputs.maintenanceMargin as string) || 25;
        if (!portfolio || !borrowed || !rate) return null;

        const equity = portfolio - borrowed;
        const currentMarginPct = (equity / portfolio) * 100;
        const monthlyInterest = borrowed * (rate / 100 / 12);
        const totalInterest = monthlyInterest * months;

        // Margin call price level: when equity = maintenance% * portfolio value
        // equity = portfolio - borrowed, so margin call when
        // (portfolioValue - borrowed) / portfolioValue = maintenancePct/100
        // portfolioValue * (1 - maintenancePct/100) = borrowed
        // portfolioValue = borrowed / (1 - maintenancePct/100)
        const marginCallPortfolioValue = borrowed / (1 - maintenancePct / 100);
        const dropToMarginCall = portfolio - marginCallPortfolioValue;
        const dropPct = (dropToMarginCall / portfolio) * 100;

        const breakEvenReturn = (totalInterest / portfolio) * 100;

        return {
          primary: {
            label: "Monthly Interest Cost",
            value: `$${formatNumber(monthlyInterest)}`,
          },
          details: [
            { label: "Current equity", value: `$${formatNumber(equity)}` },
            { label: "Current margin percentage", value: `${formatNumber(currentMarginPct)}%` },
            { label: `Total interest (${months} months)`, value: `$${formatNumber(totalInterest)}` },
            { label: "Margin call at portfolio value", value: `$${formatNumber(marginCallPortfolioValue)}` },
            { label: "Portfolio can drop by", value: `$${formatNumber(Math.max(0, dropToMarginCall))} (${formatNumber(Math.max(0, dropPct))}%)` },
            { label: "Break-even return needed", value: `${formatNumber(breakEvenReturn)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["personal-loan-calculator", "401k-loan-calculator"],
  faq: [
    {
      question: "What is a margin loan?",
      answer:
        "A margin loan lets you borrow money from your broker using your investment portfolio as collateral. You can use the funds to buy more securities or for other purposes. Interest accrues daily on the borrowed amount.",
    },
    {
      question: "What is a margin call?",
      answer:
        "A margin call occurs when your equity falls below the maintenance margin requirement (typically 25-40%). You must deposit more cash or securities, or the broker may sell your holdings to meet the requirement.",
    },
    {
      question: "Is margin interest tax deductible?",
      answer:
        "Margin interest is generally tax-deductible up to the amount of net investment income you earn. You must itemize deductions to claim it. Consult a tax professional for your specific situation.",
    },
  ],
  formula:
    "Monthly Interest = Borrowed x (Rate / 12). Margin Call Level = Borrowed / (1 - Maintenance%).",
};
