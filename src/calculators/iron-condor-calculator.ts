import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ironCondorCalculator: CalculatorDefinition = {
  slug: "iron-condor-calculator",
  title: "Iron Condor Calculator",
  description: "Calculate the max profit, max loss, and breakeven points for an iron condor options strategy.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["iron condor calculator", "options iron condor", "iron condor profit"],
  variants: [{
    id: "standard",
    name: "Iron Condor",
    description: "Calculate the max profit, max loss, and breakeven points for an iron condor options strategy",
    fields: [
      { name: "netCredit", label: "Net Credit Received", type: "number", prefix: "$", min: 0.01, max: 10000, step: 0.01, defaultValue: 2.50 },
      { name: "wingWidth", label: "Wing Width (Strike Spread)", type: "number", prefix: "$", min: 1, max: 100, defaultValue: 5 },
      { name: "contracts", label: "Number of Contracts", type: "number", min: 1, max: 1000, defaultValue: 10 },
      { name: "shortPutStrike", label: "Short Put Strike", type: "number", prefix: "$", min: 1, max: 100000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const credit = inputs.netCredit as number;
      const width = inputs.wingWidth as number;
      const contracts = inputs.contracts as number;
      const shortPut = inputs.shortPutStrike as number;
      if (!credit || !width || !contracts || !shortPut) return null;
      const maxProfit = credit * contracts * 100;
      const maxLoss = (width - credit) * contracts * 100;
      const lowerBE = shortPut - credit;
      const upperBE = shortPut + width + credit;
      const riskReward = maxProfit / maxLoss;
      return {
        primary: { label: "Max Profit", value: "$" + formatNumber(maxProfit) },
        details: [
          { label: "Max Loss", value: "$" + formatNumber(maxLoss) },
          { label: "Lower Breakeven", value: "$" + formatNumber(lowerBE) },
          { label: "Upper Breakeven", value: "$" + formatNumber(upperBE) },
          { label: "Risk/Reward Ratio", value: "1:" + (1 / riskReward).toFixed(2) },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-profit-loss-calculator", "crypto-leverage-liquidation-calculator"],
  faq: [
    { question: "What is an iron condor?", answer: "An iron condor is an options strategy that combines a bull put spread and a bear call spread to profit from low volatility within a price range." },
    { question: "When is an iron condor profitable?", answer: "An iron condor is profitable when the underlying price stays between the two breakeven points at expiration." },
  ],
  formula: "Max Profit = Net Credit x Contracts x 100; Max Loss = (Wing Width - Net Credit) x Contracts x 100",
};
