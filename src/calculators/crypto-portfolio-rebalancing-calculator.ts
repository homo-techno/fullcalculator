import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoPortfolioRebalancingCalculator: CalculatorDefinition = {
  slug: "crypto-portfolio-rebalancing-calculator",
  title: "Crypto Portfolio Rebalancing Calculator",
  description: "Calculate the trades needed to rebalance a crypto portfolio to target allocations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crypto rebalancing", "portfolio rebalance", "crypto allocation"],
  variants: [{
    id: "standard",
    name: "Crypto Portfolio Rebalancing",
    description: "Calculate the trades needed to rebalance a crypto portfolio to target allocations",
    fields: [
      { name: "totalValue", label: "Total Portfolio Value", type: "number", prefix: "$", min: 100, max: 100000000, defaultValue: 10000 },
      { name: "btcCurrent", label: "Current BTC Allocation", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 60 },
      { name: "btcTarget", label: "Target BTC Allocation", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 50 },
      { name: "ethTarget", label: "Target ETH Allocation", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const total = inputs.totalValue as number;
      const btcCurrent = (inputs.btcCurrent as number) / 100;
      const btcTarget = (inputs.btcTarget as number) / 100;
      const ethTarget = (inputs.ethTarget as number) / 100;
      if (!total || total <= 0) return null;
      const altTarget = 1 - btcTarget - ethTarget;
      const btcCurrentVal = total * btcCurrent;
      const btcTargetVal = total * btcTarget;
      const ethTargetVal = total * ethTarget;
      const altTargetVal = total * altTarget;
      const btcTrade = btcTargetVal - btcCurrentVal;
      return {
        primary: { label: "BTC Trade Needed", value: (btcTrade >= 0 ? "Buy " : "Sell ") + "$" + formatNumber(Math.abs(btcTrade)) },
        details: [
          { label: "BTC Target Value", value: "$" + formatNumber(btcTargetVal) },
          { label: "ETH Target Value", value: "$" + formatNumber(ethTargetVal) },
          { label: "Other Target Value", value: "$" + formatNumber(altTargetVal) },
          { label: "Rebalance Amount", value: "$" + formatNumber(Math.abs(btcTrade)) },
        ],
      };
    },
  }],
  relatedSlugs: ["crypto-yield-farming-apy-calculator", "crypto-leverage-liquidation-calculator"],
  faq: [
    { question: "How often should I rebalance my crypto portfolio?", answer: "Most investors rebalance monthly or quarterly, or when allocations drift more than 5% from targets." },
    { question: "What are the tax implications of rebalancing?", answer: "Each trade during rebalancing is a taxable event that may trigger capital gains or losses." },
  ],
  formula: "Trade Needed = (Target Allocation - Current Allocation) x Total Portfolio Value",
};
