import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const expectedValueTradeCalculator: CalculatorDefinition = {
  slug: "expected-value-trade-calculator",
  title: "Expected Value (Trading) Calculator",
  description:
    "Free expected value calculator for trading. Calculate the expected value per trade based on win rate, average win, and average loss to evaluate trading edge.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["expected value", "EV", "trading", "edge", "expectancy", "risk reward", "per trade"],
  variants: [
    {
      id: "evPerTrade",
      name: "Expected Value per Trade",
      fields: [
        { name: "winRate", label: "Win Rate (%)", type: "number", placeholder: "e.g. 55", step: 0.1 },
        { name: "avgWin", label: "Average Win ($)", type: "number", placeholder: "e.g. 300" },
        { name: "avgLoss", label: "Average Loss ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const winRate = (inputs.winRate as number) / 100;
        const avgWin = inputs.avgWin as number;
        const avgLoss = inputs.avgLoss as number;

        if (!winRate || !avgWin || !avgLoss) return null;

        const lossRate = 1 - winRate;
        const ev = (winRate * avgWin) - (lossRate * avgLoss);
        const riskReward = avgWin / avgLoss;
        const expectancyRatio = ev / avgLoss;

        return {
          primary: { label: "Expected Value per Trade", value: `$${formatNumber(ev, 2)}` },
          details: [
            { label: "Edge", value: ev > 0 ? "Positive" : "Negative" },
            { label: "Win Rate", value: `${formatNumber(winRate * 100, 2)}%` },
            { label: "Risk-Reward Ratio", value: `1:${formatNumber(riskReward, 2)}` },
            { label: "Expectancy Ratio (EV/Avg Loss)", value: formatNumber(expectancyRatio, 4) },
            { label: "EV per 100 Trades", value: `$${formatNumber(ev * 100, 2)}` },
          ],
        };
      },
    },
    {
      id: "evFromHistory",
      name: "EV from Trade History",
      fields: [
        { name: "totalTrades", label: "Total Trades", type: "number", placeholder: "e.g. 200" },
        { name: "winningTrades", label: "Winning Trades", type: "number", placeholder: "e.g. 110" },
        { name: "totalProfit", label: "Total Profit from Winners ($)", type: "number", placeholder: "e.g. 33000" },
        { name: "totalLoss", label: "Total Loss from Losers ($)", type: "number", placeholder: "e.g. 18000" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalTrades as number;
        const wins = inputs.winningTrades as number;
        const totalProfit = inputs.totalProfit as number;
        const totalLoss = inputs.totalLoss as number;

        if (!total || !wins || !totalProfit || !totalLoss) return null;

        const losses = total - wins;
        const avgWin = totalProfit / wins;
        const avgLoss = losses > 0 ? totalLoss / losses : 0;
        const winRate = wins / total;
        const netProfit = totalProfit - totalLoss;
        const evPerTrade = netProfit / total;

        return {
          primary: { label: "EV per Trade", value: `$${formatNumber(evPerTrade, 2)}` },
          details: [
            { label: "Net Profit", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Win Rate", value: `${formatNumber(winRate * 100, 2)}%` },
            { label: "Average Win", value: `$${formatNumber(avgWin, 2)}` },
            { label: "Average Loss", value: `$${formatNumber(avgLoss, 2)}` },
            { label: "Profit Factor", value: formatNumber(totalProfit / totalLoss, 4) },
            { label: "Total Trades", value: formatNumber(total, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kelly-criterion-calculator", "win-rate-calculator", "profit-factor-calculator"],
  faq: [
    { question: "What is expected value in trading?", answer: "Expected value (EV) is the average amount you expect to win or lose per trade over a large number of trades. A positive EV means your trading system has a profitable edge." },
    { question: "How is trading EV calculated?", answer: "EV = (Win Rate x Average Win) - (Loss Rate x Average Loss). If the result is positive, you have a profitable system over time." },
    { question: "Why is expected value important?", answer: "EV tells you whether your trading strategy is profitable in the long run. Even with a low win rate, you can have positive EV if your average win is significantly larger than your average loss." },
  ],
  formula: "EV = (Win% x Avg Win) - (Loss% x Avg Loss); Expectancy Ratio = EV / Avg Loss",
};
