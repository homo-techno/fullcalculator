import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marginCallCalculator: CalculatorDefinition = {
  slug: "margin-call-calculator",
  title: "Margin Call Calculator",
  description: "Free margin call calculator. Calculate the stock price that triggers a margin call and the amount needed to meet maintenance requirements.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["margin call", "margin trading", "maintenance margin", "margin requirement", "leverage trading"],
  variants: [
    {
      id: "marginCallPrice",
      name: "Margin Call Trigger Price",
      description: "Calculate the price at which a margin call occurs",
      fields: [
        { name: "purchasePrice", label: "Purchase Price per Share", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "shares", label: "Number of Shares", type: "number", placeholder: "e.g. 200" },
        { name: "initialMargin", label: "Initial Margin (%)", type: "number", placeholder: "e.g. 50", suffix: "%", defaultValue: 50 },
        { name: "maintenanceMargin", label: "Maintenance Margin (%)", type: "number", placeholder: "e.g. 25", suffix: "%", defaultValue: 25 },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const shares = inputs.shares as number;
        const initialMarginPct = (inputs.initialMargin as number) / 100;
        const maintenancePct = (inputs.maintenanceMargin as number) / 100;
        if (!price || !shares || !initialMarginPct || !maintenancePct) return null;
        const totalValue = price * shares;
        const loanAmount = totalValue * (1 - initialMarginPct);
        const marginCallPrice = loanAmount / (shares * (1 - maintenancePct));
        const equityAtPurchase = totalValue * initialMarginPct;
        const dropPercent = ((price - marginCallPrice) / price) * 100;
        return {
          primary: { label: "Margin Call Price", value: `$${formatNumber(marginCallPrice, 2)}` },
          details: [
            { label: "Initial investment (equity)", value: `$${formatNumber(equityAtPurchase, 2)}` },
            { label: "Loan amount", value: `$${formatNumber(loanAmount, 2)}` },
            { label: "Price drop to trigger", value: `${formatNumber(dropPercent, 2)}%` },
            { label: "Total position value", value: `$${formatNumber(totalValue, 2)}` },
          ],
        };
      },
    },
    {
      id: "depositNeeded",
      name: "Deposit Needed",
      description: "Calculate how much to deposit to meet a margin call",
      fields: [
        { name: "currentPrice", label: "Current Stock Price", type: "number", prefix: "$", placeholder: "e.g. 70" },
        { name: "shares", label: "Number of Shares", type: "number", placeholder: "e.g. 200" },
        { name: "loanBalance", label: "Margin Loan Balance", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "maintenanceMargin", label: "Maintenance Margin (%)", type: "number", placeholder: "e.g. 25", suffix: "%", defaultValue: 25 },
      ],
      calculate: (inputs) => {
        const price = inputs.currentPrice as number;
        const shares = inputs.shares as number;
        const loan = inputs.loanBalance as number;
        const maintPct = (inputs.maintenanceMargin as number) / 100;
        if (!price || !shares || !loan || !maintPct) return null;
        const portfolioValue = price * shares;
        const equity = portfolioValue - loan;
        const equityRatio = equity / portfolioValue;
        const requiredEquity = portfolioValue * maintPct;
        const deposit = requiredEquity - equity;
        return {
          primary: { label: "Deposit Required", value: deposit > 0 ? `$${formatNumber(deposit, 2)}` : "$0 (no margin call)" },
          details: [
            { label: "Portfolio value", value: `$${formatNumber(portfolioValue, 2)}` },
            { label: "Current equity", value: `$${formatNumber(equity, 2)}` },
            { label: "Current equity ratio", value: `${formatNumber(equityRatio * 100, 2)}%` },
            { label: "Required equity", value: `$${formatNumber(requiredEquity, 2)}` },
            { label: "Margin call?", value: deposit > 0 ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["risk-reward-calculator", "options-profit-calculator", "stock-return-calculator"],
  faq: [
    { question: "What is a margin call?", answer: "A margin call occurs when the equity in a margin account falls below the maintenance margin requirement. The broker demands the investor deposit additional funds or sell securities to bring the account back to the required level." },
    { question: "How is margin call price calculated?", answer: "Margin Call Price = Loan Amount / (Shares x (1 - Maintenance Margin %)). This is the price at which your equity ratio drops to exactly the maintenance margin level." },
    { question: "What is the typical maintenance margin?", answer: "The standard maintenance margin is 25% set by FINRA regulations, though brokers may require higher margins (30-40%) for volatile stocks or concentrated positions." },
  ],
  formula: "Margin Call Price = Loan / (Shares x (1 - Maintenance Margin %)) | Equity Ratio = (Portfolio Value - Loan) / Portfolio Value",
};
