import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const riskRewardCalculator: CalculatorDefinition = {
  slug: "risk-reward-calculator",
  title: "Risk/Reward Ratio Calculator",
  description: "Free risk/reward ratio calculator. Calculate risk-to-reward ratios for trades, set stop-loss and take-profit levels.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["risk reward ratio", "risk to reward", "stop loss", "take profit", "trading calculator", "R:R ratio"],
  variants: [
    {
      id: "basic",
      name: "Risk/Reward Ratio",
      description: "Calculate risk/reward from entry, stop, and target",
      fields: [
        { name: "entryPrice", label: "Entry Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "stopLoss", label: "Stop Loss Price", type: "number", prefix: "$", placeholder: "e.g. 95" },
        { name: "takeProfit", label: "Take Profit Price", type: "number", prefix: "$", placeholder: "e.g. 115" },
        { name: "shares", label: "Number of Shares", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const entry = inputs.entryPrice as number;
        const stop = inputs.stopLoss as number;
        const target = inputs.takeProfit as number;
        const shares = (inputs.shares as number) || 100;
        if (!entry || !stop || !target) return null;
        const risk = Math.abs(entry - stop);
        const reward = Math.abs(target - entry);
        if (risk === 0) return null;
        const ratio = reward / risk;
        const riskDollars = risk * shares;
        const rewardDollars = reward * shares;
        const riskPercent = (risk / entry) * 100;
        const rewardPercent = (reward / entry) * 100;
        return {
          primary: { label: "Risk/Reward Ratio", value: `1:${formatNumber(ratio, 2)}` },
          details: [
            { label: "Risk per share", value: `$${formatNumber(risk, 2)}` },
            { label: "Reward per share", value: `$${formatNumber(reward, 2)}` },
            { label: "Total risk", value: `$${formatNumber(riskDollars, 2)}` },
            { label: "Total reward", value: `$${formatNumber(rewardDollars, 2)}` },
            { label: "Risk %", value: `${formatNumber(riskPercent, 2)}%` },
            { label: "Reward %", value: `${formatNumber(rewardPercent, 2)}%` },
            { label: "Rating", value: ratio >= 3 ? "Excellent" : ratio >= 2 ? "Good" : ratio >= 1 ? "Acceptable" : "Poor" },
          ],
        };
      },
    },
    {
      id: "breakeven",
      name: "Break-Even Win Rate",
      description: "Calculate minimum win rate needed for profitability",
      fields: [
        { name: "riskAmount", label: "Risk Amount per Trade", type: "number", prefix: "$", placeholder: "e.g. 500" },
        { name: "rewardAmount", label: "Reward Amount per Trade", type: "number", prefix: "$", placeholder: "e.g. 1000" },
      ],
      calculate: (inputs) => {
        const risk = inputs.riskAmount as number;
        const reward = inputs.rewardAmount as number;
        if (!risk || !reward) return null;
        const breakevenWinRate = (risk / (risk + reward)) * 100;
        const ratio = reward / risk;
        return {
          primary: { label: "Break-Even Win Rate", value: `${formatNumber(breakevenWinRate, 2)}%` },
          details: [
            { label: "Risk/Reward ratio", value: `1:${formatNumber(ratio, 2)}` },
            { label: "Win rate needed to profit", value: `>${formatNumber(breakevenWinRate, 1)}%` },
            { label: "Expected value at 50% wins", value: `$${formatNumber(0.5 * reward - 0.5 * risk, 2)} per trade` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sharpe-ratio-calculator", "options-profit-calculator", "margin-call-calculator"],
  faq: [
    { question: "What is the risk/reward ratio?", answer: "The risk/reward ratio compares the potential loss (risk) to the potential gain (reward) of a trade. A 1:3 ratio means you risk $1 to potentially make $3. Higher ratios indicate more favorable trade setups." },
    { question: "What is a good risk/reward ratio?", answer: "Most professional traders aim for at least a 1:2 risk/reward ratio. This means even with a 50% win rate, you remain profitable. A 1:3 ratio is considered excellent, as you only need to win 25% of trades to break even." },
    { question: "How does risk/reward relate to win rate?", answer: "Break-even win rate = Risk / (Risk + Reward). With a 1:2 R:R, you need to win only 33% of trades to break even. Higher R:R ratios allow lower win rates while still being profitable." },
  ],
  formula: "R:R Ratio = Reward / Risk | Break-even Win Rate = Risk / (Risk + Reward) | Risk = |Entry - Stop Loss| | Reward = |Target - Entry|",
};
