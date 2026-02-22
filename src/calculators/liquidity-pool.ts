import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const liquidityPoolCalculator: CalculatorDefinition = {
  slug: "liquidity-pool-calculator",
  title: "Liquidity Pool Calculator",
  description:
    "Free liquidity pool calculator. Estimate your share of a liquidity pool, expected fee earnings, and LP token value based on pool size and trading volume.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["liquidity pool", "LP", "AMM", "DeFi", "trading fees", "pool share", "uniswap"],
  variants: [
    {
      id: "poolShare",
      name: "Pool Share & Fees",
      fields: [
        { name: "depositAmount", label: "Your Deposit ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "poolSize", label: "Total Pool Size ($)", type: "number", placeholder: "e.g. 5000000" },
        { name: "dailyVolume", label: "Daily Trading Volume ($)", type: "number", placeholder: "e.g. 1000000" },
        { name: "feeRate", label: "Fee Rate (%)", type: "number", placeholder: "e.g. 0.3", step: 0.01, defaultValue: 0.3 },
        { name: "durationDays", label: "Duration (days)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const deposit = inputs.depositAmount as number;
        const poolSize = inputs.poolSize as number;
        const dailyVolume = inputs.dailyVolume as number;
        const feeRate = (inputs.feeRate as number) || 0.3;
        const days = inputs.durationDays as number;

        if (!deposit || !poolSize || !dailyVolume || !days) return null;

        const poolShare = deposit / (poolSize + deposit);
        const dailyFees = dailyVolume * (feeRate / 100);
        const yourDailyFees = dailyFees * poolShare;
        const totalFees = yourDailyFees * days;
        const apr = (yourDailyFees * 365 / deposit) * 100;

        return {
          primary: { label: "Estimated Fee Earnings", value: `$${formatNumber(totalFees, 2)}` },
          details: [
            { label: "Your Pool Share", value: `${formatNumber(poolShare * 100, 4)}%` },
            { label: "Daily Fee Income", value: `$${formatNumber(yourDailyFees, 2)}` },
            { label: "Annualized APR (from fees)", value: `${formatNumber(apr, 2)}%` },
            { label: "Total Pool Daily Fees", value: `$${formatNumber(dailyFees, 2)}` },
            { label: "Your Deposit", value: `$${formatNumber(deposit, 2)}` },
          ],
        };
      },
    },
    {
      id: "lpTokenValue",
      name: "LP Token Value",
      fields: [
        { name: "tokenAAmount", label: "Token A Amount", type: "number", placeholder: "e.g. 5" },
        { name: "tokenAPrice", label: "Token A Price ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "tokenBAmount", label: "Token B Amount", type: "number", placeholder: "e.g. 15000" },
        { name: "tokenBPrice", label: "Token B Price ($)", type: "number", placeholder: "e.g. 1" },
        { name: "totalLPTokens", label: "Total LP Tokens", type: "number", placeholder: "e.g. 1000" },
        { name: "yourLPTokens", label: "Your LP Tokens", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const tokenAAmount = inputs.tokenAAmount as number;
        const tokenAPrice = inputs.tokenAPrice as number;
        const tokenBAmount = inputs.tokenBAmount as number;
        const tokenBPrice = inputs.tokenBPrice as number;
        const totalLP = inputs.totalLPTokens as number;
        const yourLP = inputs.yourLPTokens as number;

        if (!tokenAAmount || !tokenAPrice || !tokenBAmount || !tokenBPrice || !totalLP || !yourLP) return null;

        const totalPoolValue = (tokenAAmount * tokenAPrice) + (tokenBAmount * tokenBPrice);
        const lpTokenPrice = totalPoolValue / totalLP;
        const yourValue = lpTokenPrice * yourLP;
        const yourShare = (yourLP / totalLP) * 100;

        return {
          primary: { label: "Your LP Position Value", value: `$${formatNumber(yourValue, 2)}` },
          details: [
            { label: "LP Token Price", value: `$${formatNumber(lpTokenPrice, 4)}` },
            { label: "Your Pool Share", value: `${formatNumber(yourShare, 4)}%` },
            { label: "Total Pool Value", value: `$${formatNumber(totalPoolValue, 2)}` },
            { label: "Token A Value in Pool", value: `$${formatNumber(tokenAAmount * tokenAPrice, 2)}` },
            { label: "Token B Value in Pool", value: `$${formatNumber(tokenBAmount * tokenBPrice, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["impermanent-loss-calculator", "defi-yield-calculator", "staking-rewards-calculator"],
  faq: [
    { question: "What is a liquidity pool?", answer: "A liquidity pool is a collection of funds locked in a smart contract that facilitates decentralized trading, lending, and other DeFi activities. Liquidity providers deposit token pairs and earn fees from trades." },
    { question: "How do LP fees work?", answer: "When someone trades through the pool, they pay a fee (e.g., 0.3% on Uniswap). This fee is distributed proportionally to all liquidity providers based on their share of the pool." },
    { question: "What are LP tokens?", answer: "LP tokens represent your share of the liquidity pool. They can be redeemed for your proportional share of the pool assets plus accumulated fees at any time." },
  ],
  formula: "Pool Share = Your Deposit / Total Pool; Daily Fees = Volume x Fee Rate x Pool Share; APR = Daily Fees x 365 / Deposit x 100",
};
