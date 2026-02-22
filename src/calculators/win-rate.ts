import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const winRateCalculator: CalculatorDefinition = {
  slug: "win-rate-calculator",
  title: "Win Rate Calculator",
  description:
    "Free win rate calculator. Calculate your trading win rate percentage and determine the minimum required win rate for profitability based on risk-reward ratio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["win rate", "trading", "winning percentage", "win loss ratio", "trading performance", "statistics"],
  variants: [
    {
      id: "basicWinRate",
      name: "Win Rate Calculation",
      fields: [
        { name: "totalTrades", label: "Total Trades", type: "number", placeholder: "e.g. 100" },
        { name: "winningTrades", label: "Winning Trades", type: "number", placeholder: "e.g. 55" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalTrades as number;
        const wins = inputs.winningTrades as number;

        if (!total || wins === undefined) return null;

        const losses = total - wins;
        const winRate = (wins / total) * 100;
        const lossRate = (losses / total) * 100;
        const wlRatio = losses > 0 ? wins / losses : wins;

        return {
          primary: { label: "Win Rate", value: `${formatNumber(winRate, 2)}%` },
          details: [
            { label: "Winning Trades", value: formatNumber(wins, 0) },
            { label: "Losing Trades", value: formatNumber(losses, 0) },
            { label: "Loss Rate", value: `${formatNumber(lossRate, 2)}%` },
            { label: "Win/Loss Ratio", value: formatNumber(wlRatio, 2) },
            { label: "Total Trades", value: formatNumber(total, 0) },
          ],
        };
      },
    },
    {
      id: "breakEvenWinRate",
      name: "Break-Even Win Rate",
      fields: [
        { name: "avgWin", label: "Average Win ($)", type: "number", placeholder: "e.g. 300" },
        { name: "avgLoss", label: "Average Loss ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const avgWin = inputs.avgWin as number;
        const avgLoss = inputs.avgLoss as number;

        if (!avgWin || !avgLoss) return null;

        const riskReward = avgWin / avgLoss;
        const breakEvenWR = (1 / (1 + riskReward)) * 100;
        const expectancyAt50 = 0.5 * avgWin - 0.5 * avgLoss;

        return {
          primary: { label: "Break-Even Win Rate", value: `${formatNumber(breakEvenWR, 2)}%` },
          details: [
            { label: "Risk-Reward Ratio", value: `1:${formatNumber(riskReward, 2)}` },
            { label: "Average Win", value: `$${formatNumber(avgWin, 2)}` },
            { label: "Average Loss", value: `$${formatNumber(avgLoss, 2)}` },
            { label: "Expectancy at 50% WR", value: `$${formatNumber(expectancyAt50, 2)}` },
            { label: "You need above this WR to profit", value: `${formatNumber(breakEvenWR, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["profit-factor-calculator", "expected-value-trade-calculator", "kelly-criterion-calculator"],
  faq: [
    { question: "What is win rate in trading?", answer: "Win rate is the percentage of trades that are profitable out of total trades taken. A 55% win rate means 55 out of every 100 trades are winners." },
    { question: "What is a good win rate?", answer: "A good win rate depends on your risk-reward ratio. With a 1:2 risk-reward (risking $1 to make $2), you only need a 33.3% win rate to break even. Higher risk-reward ratios allow lower win rates." },
    { question: "Is win rate the most important metric?", answer: "No. Win rate alone does not determine profitability. A system with 30% win rate but large wins and small losses can be more profitable than one with 70% win rate but small wins and large losses." },
  ],
  formula: "Win Rate = Winning Trades / Total Trades x 100; Break-Even WR = 1 / (1 + Risk-Reward Ratio) x 100",
};
