import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compoundTradingCalculator: CalculatorDefinition = {
  slug: "compound-trading-calculator",
  title: "Compound Trading Returns Calculator",
  description:
    "Free compound trading returns calculator. Calculate how your trading account grows over time when reinvesting profits with a consistent return per trade or per day.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["compound trading", "compound returns", "reinvesting", "trading growth", "exponential growth", "compounding"],
  variants: [
    {
      id: "dailyCompound",
      name: "Daily Compounding Returns",
      fields: [
        { name: "startingBalance", label: "Starting Balance ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "dailyReturn", label: "Average Daily Return (%)", type: "number", placeholder: "e.g. 1", step: 0.01 },
        { name: "tradingDays", label: "Trading Days", type: "number", placeholder: "e.g. 252" },
        { name: "reinvestPercent", label: "Reinvest Percentage (%)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const start = inputs.startingBalance as number;
        const dailyReturn = inputs.dailyReturn as number;
        const days = inputs.tradingDays as number;
        const reinvest = (inputs.reinvestPercent as number) || 100;

        if (!start || !dailyReturn || !days) return null;

        const effectiveDaily = dailyReturn * (reinvest / 100);
        const finalBalance = start * Math.pow(1 + effectiveDaily / 100, days);
        const totalProfit = finalBalance - start;
        const totalReturn = (totalProfit / start) * 100;
        const monthlyEquiv = (Math.pow(finalBalance / start, 1 / (days / 21)) - 1) * 100;

        return {
          primary: { label: "Final Balance", value: `$${formatNumber(finalBalance, 2)}` },
          details: [
            { label: "Total Profit", value: `$${formatNumber(totalProfit, 2)}` },
            { label: "Total Return", value: `${formatNumber(totalReturn, 2)}%` },
            { label: "Daily Return (effective)", value: `${formatNumber(effectiveDaily, 4)}%` },
            { label: "Monthly Equivalent Return", value: `${formatNumber(monthlyEquiv, 2)}%` },
            { label: "Trading Days", value: formatNumber(days, 0) },
            { label: "Reinvestment Rate", value: `${formatNumber(reinvest, 0)}%` },
          ],
        };
      },
    },
    {
      id: "perTradeCompound",
      name: "Per-Trade Compounding",
      fields: [
        { name: "startingBalance", label: "Starting Balance ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "returnPerTrade", label: "Average Return per Trade (%)", type: "number", placeholder: "e.g. 2", step: 0.01 },
        { name: "numTrades", label: "Number of Trades", type: "number", placeholder: "e.g. 100" },
        { name: "winRate", label: "Win Rate (%)", type: "number", placeholder: "e.g. 60", step: 0.1 },
        { name: "lossPercent", label: "Average Loss per Losing Trade (%)", type: "number", placeholder: "e.g. 1", step: 0.01 },
      ],
      calculate: (inputs) => {
        const start = inputs.startingBalance as number;
        const returnPerTrade = inputs.returnPerTrade as number;
        const numTrades = inputs.numTrades as number;
        const winRate = (inputs.winRate as number) / 100;
        const lossPercent = inputs.lossPercent as number;

        if (!start || !returnPerTrade || !numTrades || !winRate || !lossPercent) return null;

        const wins = Math.round(numTrades * winRate);
        const losses = numTrades - wins;

        let balance = start;
        for (let i = 0; i < wins; i++) {
          balance *= (1 + returnPerTrade / 100);
        }
        for (let i = 0; i < losses; i++) {
          balance *= (1 - lossPercent / 100);
        }

        const totalProfit = balance - start;
        const totalReturn = (totalProfit / start) * 100;
        const avgReturnPerTrade = (Math.pow(balance / start, 1 / numTrades) - 1) * 100;

        return {
          primary: { label: "Final Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Total Profit", value: `$${formatNumber(totalProfit, 2)}` },
            { label: "Total Return", value: `${formatNumber(totalReturn, 2)}%` },
            { label: "Winning Trades", value: formatNumber(wins, 0) },
            { label: "Losing Trades", value: formatNumber(losses, 0) },
            { label: "Avg Compound Return/Trade", value: `${formatNumber(avgReturnPerTrade, 4)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "profit-factor-calculator", "drawdown-calculator"],
  faq: [
    { question: "How does compound trading work?", answer: "Compound trading means reinvesting your profits so that each subsequent trade is placed with a larger account balance. This creates exponential growth - your gains generate further gains." },
    { question: "Is 1% daily return realistic?", answer: "A consistent 1% daily return is extremely ambitious and unrealistic for most traders over long periods. Even 0.1-0.3% daily compounded can lead to significant returns over a year. Be cautious of strategies claiming very high daily returns." },
    { question: "Why is compounding so powerful in trading?", answer: "With compounding, a $1,000 account earning 0.5% per trading day (252 days) grows to about $3,520 - a 252% return. Without compounding, simple interest would yield only $1,260 (126% return)." },
  ],
  formula: "Final Balance = Starting Balance x (1 + Daily Return%)^Trading Days",
};
