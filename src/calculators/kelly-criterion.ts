import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kellyCriterionCalculator: CalculatorDefinition = {
  slug: "kelly-criterion-calculator",
  title: "Kelly Criterion Calculator",
  description:
    "Free Kelly Criterion calculator. Determine the optimal bet size or position size to maximize long-term growth based on your win probability and payout ratio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["kelly criterion", "optimal bet size", "position sizing", "bankroll management", "trading", "gambling"],
  variants: [
    {
      id: "basicKelly",
      name: "Kelly Criterion",
      fields: [
        { name: "winProbability", label: "Win Probability (%)", type: "number", placeholder: "e.g. 55", step: 0.1 },
        { name: "winLossRatio", label: "Win/Loss Ratio (avg win / avg loss)", type: "number", placeholder: "e.g. 1.5", step: 0.01 },
        { name: "bankroll", label: "Bankroll / Account Size ($)", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const winProb = (inputs.winProbability as number) / 100;
        const wlRatio = inputs.winLossRatio as number;
        const bankroll = inputs.bankroll as number;

        if (!winProb || !wlRatio || !bankroll) return null;

        const lossProb = 1 - winProb;
        const kelly = winProb - lossProb / wlRatio;
        const kellyPercent = kelly * 100;
        const optimalBet = kelly * bankroll;
        const halfKelly = optimalBet / 2;
        const quarterKelly = optimalBet / 4;

        return {
          primary: { label: "Kelly Percentage", value: `${formatNumber(kellyPercent, 2)}%` },
          details: [
            { label: "Full Kelly Bet Size", value: `$${formatNumber(Math.max(0, optimalBet), 2)}` },
            { label: "Half Kelly (Conservative)", value: `$${formatNumber(Math.max(0, halfKelly), 2)}` },
            { label: "Quarter Kelly (Very Conservative)", value: `$${formatNumber(Math.max(0, quarterKelly), 2)}` },
            { label: "Win Probability", value: `${formatNumber(winProb * 100, 2)}%` },
            { label: "Edge", value: kelly > 0 ? `${formatNumber(kelly * 100, 2)}% positive edge` : "No edge (do not bet)" },
          ],
        };
      },
    },
    {
      id: "kellyFromTrades",
      name: "Kelly from Trade History",
      fields: [
        { name: "totalTrades", label: "Total Trades", type: "number", placeholder: "e.g. 100" },
        { name: "winningTrades", label: "Winning Trades", type: "number", placeholder: "e.g. 55" },
        { name: "avgWin", label: "Average Win ($)", type: "number", placeholder: "e.g. 300" },
        { name: "avgLoss", label: "Average Loss ($)", type: "number", placeholder: "e.g. 200" },
        { name: "accountSize", label: "Account Size ($)", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalTrades as number;
        const wins = inputs.winningTrades as number;
        const avgWin = inputs.avgWin as number;
        const avgLoss = inputs.avgLoss as number;
        const account = inputs.accountSize as number;

        if (!total || !wins || !avgWin || !avgLoss || !account) return null;

        const winProb = wins / total;
        const lossProb = 1 - winProb;
        const wlRatio = avgWin / avgLoss;
        const kelly = winProb - lossProb / wlRatio;
        const optimalBet = Math.max(0, kelly * account);
        const halfKelly = optimalBet / 2;

        return {
          primary: { label: "Kelly Percentage", value: `${formatNumber(kelly * 100, 2)}%` },
          details: [
            { label: "Optimal Position Size", value: `$${formatNumber(optimalBet, 2)}` },
            { label: "Half Kelly (Recommended)", value: `$${formatNumber(halfKelly, 2)}` },
            { label: "Win Rate", value: `${formatNumber(winProb * 100, 2)}%` },
            { label: "Win/Loss Ratio", value: formatNumber(wlRatio, 4) },
            { label: "Edge", value: kelly > 0 ? "Positive" : "None/Negative" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["position-size-calculator", "win-rate-calculator", "expected-value-trade-calculator"],
  faq: [
    { question: "What is the Kelly Criterion?", answer: "The Kelly Criterion is a formula that determines the optimal size of a series of bets or investments to maximize the logarithm of wealth (long-term growth rate). It was developed by John L. Kelly Jr. at Bell Labs in 1956." },
    { question: "Why use Half Kelly?", answer: "Full Kelly can be very aggressive and lead to large drawdowns. Most practitioners use Half Kelly (betting half the Kelly amount) or Quarter Kelly, which sacrifices some growth rate but significantly reduces volatility and drawdown risk." },
    { question: "What if Kelly is negative?", answer: "A negative Kelly value means you have no edge (or a negative edge). You should not bet or trade. It means your expected value is negative and you will lose money over time." },
  ],
  formula: "Kelly % = W - (1 - W) / R; where W = win probability, R = win/loss ratio (avg win / avg loss)",
};
