import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const profitFactorCalculator: CalculatorDefinition = {
  slug: "profit-factor-calculator",
  title: "Profit Factor Calculator",
  description:
    "Free profit factor calculator. Calculate the ratio of gross profits to gross losses to evaluate trading system performance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["profit factor", "trading performance", "gross profit", "gross loss", "trading system", "backtesting"],
  variants: [
    {
      id: "fromTotals",
      name: "Profit Factor from Totals",
      fields: [
        { name: "grossProfit", label: "Gross Profit ($)", type: "number", placeholder: "e.g. 15000" },
        { name: "grossLoss", label: "Gross Loss ($)", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const grossProfit = inputs.grossProfit as number;
        const grossLoss = inputs.grossLoss as number;

        if (!grossProfit || !grossLoss) return null;

        const profitFactor = grossProfit / grossLoss;
        const netProfit = grossProfit - grossLoss;
        const profitPercent = (netProfit / grossLoss) * 100;

        let rating: string;
        if (profitFactor >= 2.0) rating = "Excellent";
        else if (profitFactor >= 1.5) rating = "Good";
        else if (profitFactor >= 1.0) rating = "Marginal";
        else rating = "Losing System";

        return {
          primary: { label: "Profit Factor", value: formatNumber(profitFactor, 4) },
          details: [
            { label: "Rating", value: rating },
            { label: "Gross Profit", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Gross Loss", value: `$${formatNumber(grossLoss, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Return on Loss", value: `${formatNumber(profitPercent, 2)}%` },
          ],
        };
      },
    },
    {
      id: "fromTrades",
      name: "Profit Factor from Trade Data",
      fields: [
        { name: "winningTrades", label: "Number of Winning Trades", type: "number", placeholder: "e.g. 60" },
        { name: "avgWin", label: "Average Win ($)", type: "number", placeholder: "e.g. 250" },
        { name: "losingTrades", label: "Number of Losing Trades", type: "number", placeholder: "e.g. 40" },
        { name: "avgLoss", label: "Average Loss ($)", type: "number", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const wins = inputs.winningTrades as number;
        const avgWin = inputs.avgWin as number;
        const losses = inputs.losingTrades as number;
        const avgLoss = inputs.avgLoss as number;

        if (!wins || !avgWin || !losses || !avgLoss) return null;

        const grossProfit = wins * avgWin;
        const grossLoss = losses * avgLoss;
        const profitFactor = grossProfit / grossLoss;
        const netProfit = grossProfit - grossLoss;
        const totalTrades = wins + losses;
        const winRate = (wins / totalTrades) * 100;

        return {
          primary: { label: "Profit Factor", value: formatNumber(profitFactor, 4) },
          details: [
            { label: "Gross Profit", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Gross Loss", value: `$${formatNumber(grossLoss, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Win Rate", value: `${formatNumber(winRate, 2)}%` },
            { label: "Total Trades", value: formatNumber(totalTrades, 0) },
            { label: "Avg Win / Avg Loss", value: formatNumber(avgWin / avgLoss, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["win-rate-calculator", "expected-value-trade-calculator", "drawdown-calculator"],
  faq: [
    { question: "What is profit factor?", answer: "Profit factor is the ratio of gross profits to gross losses. A profit factor above 1.0 means the system is profitable. A value of 2.0 means you earn $2 for every $1 lost." },
    { question: "What is a good profit factor?", answer: "A profit factor above 1.5 is generally considered good, above 2.0 is excellent. Below 1.0 means the trading system loses money. Values between 1.0 and 1.5 are marginal." },
    { question: "How does profit factor relate to win rate?", answer: "Profit factor combines both win rate and the average win/loss size. You can have a low win rate but high profit factor if your average win is much larger than your average loss." },
  ],
  formula: "Profit Factor = Gross Profit / Gross Loss",
};
