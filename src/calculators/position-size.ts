import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const positionSizeCalculator: CalculatorDefinition = {
  slug: "position-size-calculator",
  title: "Position Size Calculator",
  description:
    "Free position size calculator. Determine the optimal position size based on account balance, risk percentage, entry price, and stop loss.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["position size", "risk management", "stop loss", "trading", "forex", "crypto", "risk"],
  variants: [
    {
      id: "riskBased",
      name: "Risk-Based Position Size",
      fields: [
        { name: "accountBalance", label: "Account Balance ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "riskPercent", label: "Risk per Trade (%)", type: "number", placeholder: "e.g. 2", step: 0.1 },
        { name: "entryPrice", label: "Entry Price ($)", type: "number", placeholder: "e.g. 40000" },
        { name: "stopLoss", label: "Stop Loss Price ($)", type: "number", placeholder: "e.g. 38000" },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const riskPct = inputs.riskPercent as number;
        const entry = inputs.entryPrice as number;
        const stopLoss = inputs.stopLoss as number;

        if (!balance || !riskPct || !entry || !stopLoss) return null;

        const riskAmount = balance * (riskPct / 100);
        const stopDistance = Math.abs(entry - stopLoss);
        const stopPct = (stopDistance / entry) * 100;
        const units = riskAmount / stopDistance;
        const positionValue = units * entry;
        const impliedLeverage = positionValue / balance;

        return {
          primary: { label: "Position Size", value: `$${formatNumber(positionValue, 2)}` },
          details: [
            { label: "Units / Quantity", value: formatNumber(units, 6) },
            { label: "Risk Amount ($)", value: `$${formatNumber(riskAmount, 2)}` },
            { label: "Stop Distance", value: `$${formatNumber(stopDistance, 2)} (${formatNumber(stopPct, 2)}%)` },
            { label: "Implied Leverage", value: `${formatNumber(impliedLeverage, 2)}x` },
            { label: "Account Balance", value: `$${formatNumber(balance, 2)}` },
          ],
        };
      },
    },
    {
      id: "fixedUnits",
      name: "Risk from Fixed Position",
      fields: [
        { name: "accountBalance", label: "Account Balance ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "positionSize", label: "Position Size ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "entryPrice", label: "Entry Price ($)", type: "number", placeholder: "e.g. 40000" },
        { name: "stopLoss", label: "Stop Loss Price ($)", type: "number", placeholder: "e.g. 38000" },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const posSize = inputs.positionSize as number;
        const entry = inputs.entryPrice as number;
        const stopLoss = inputs.stopLoss as number;

        if (!balance || !posSize || !entry || !stopLoss) return null;

        const units = posSize / entry;
        const stopDistance = Math.abs(entry - stopLoss);
        const riskAmount = units * stopDistance;
        const riskPercent = (riskAmount / balance) * 100;

        return {
          primary: { label: "Risk Percentage", value: `${formatNumber(riskPercent, 2)}%` },
          details: [
            { label: "Risk Amount ($)", value: `$${formatNumber(riskAmount, 2)}` },
            { label: "Position Size", value: `$${formatNumber(posSize, 2)}` },
            { label: "Units / Quantity", value: formatNumber(units, 6) },
            { label: "Stop Distance", value: `$${formatNumber(stopDistance, 2)}` },
            { label: "Account Balance", value: `$${formatNumber(balance, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["leverage-calculator", "risk-reward-calculator", "futures-pnl-calculator"],
  faq: [
    { question: "What is position sizing?", answer: "Position sizing determines how large your trade should be based on your account size and risk tolerance. It ensures no single trade can cause catastrophic losses to your account." },
    { question: "What is the recommended risk per trade?", answer: "Most professional traders risk 1-2% of their account per trade. This allows for a series of losing trades without significantly depleting the account." },
    { question: "How does stop loss affect position size?", answer: "A tighter stop loss allows for a larger position size at the same risk level. A wider stop requires a smaller position to maintain the same dollar risk." },
  ],
  formula: "Position Size = (Account x Risk%) / |Entry - Stop Loss|; Risk% = (Units x Stop Distance) / Account x 100",
};
