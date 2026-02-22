import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const impermanentLossCalculator: CalculatorDefinition = {
  slug: "impermanent-loss-calculator",
  title: "Impermanent Loss Calculator",
  description:
    "Free impermanent loss calculator. Calculate the impermanent loss when providing liquidity to an AMM pool based on price changes of paired assets.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["impermanent loss", "AMM", "liquidity pool", "DeFi", "uniswap", "price change", "LP"],
  variants: [
    {
      id: "twoAsset",
      name: "Standard 50/50 Pool",
      fields: [
        { name: "initialValue", label: "Initial Deposit Value ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "priceChangeA", label: "Token A Price Change (%)", type: "number", placeholder: "e.g. 50" },
        { name: "priceChangeB", label: "Token B Price Change (%)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const initialValue = inputs.initialValue as number;
        const changeA = inputs.priceChangeA as number;
        const changeB = inputs.priceChangeB as number;

        if (!initialValue) return null;

        const ratioA = 1 + (changeA || 0) / 100;
        const ratioB = 1 + (changeB || 0) / 100;
        const priceRatio = ratioA / ratioB;
        const ilFactor = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
        const ilPercent = (ilFactor - 1) * 100;

        const holdValue = initialValue * ((ratioA + ratioB) / 2);
        const poolValue = holdValue * ilFactor;
        const ilDollar = poolValue - holdValue;

        return {
          primary: { label: "Impermanent Loss", value: `${formatNumber(ilPercent, 4)}%` },
          details: [
            { label: "Value if Held", value: `$${formatNumber(holdValue, 2)}` },
            { label: "Value in Pool", value: `$${formatNumber(poolValue, 2)}` },
            { label: "IL in Dollar Terms", value: `$${formatNumber(Math.abs(ilDollar), 2)}` },
            { label: "Token A Price Change", value: `${formatNumber(changeA || 0, 2)}%` },
            { label: "Token B Price Change", value: `${formatNumber(changeB || 0, 2)}%` },
          ],
        };
      },
    },
    {
      id: "withFees",
      name: "IL vs Trading Fees Earned",
      fields: [
        { name: "initialValue", label: "Initial Deposit Value ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "priceChangeA", label: "Token A Price Change (%)", type: "number", placeholder: "e.g. 100" },
        { name: "priceChangeB", label: "Token B Price Change (%)", type: "number", placeholder: "e.g. 0" },
        { name: "feesEarned", label: "Trading Fees Earned ($)", type: "number", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const initialValue = inputs.initialValue as number;
        const changeA = inputs.priceChangeA as number;
        const changeB = inputs.priceChangeB as number;
        const feesEarned = (inputs.feesEarned as number) || 0;

        if (!initialValue) return null;

        const ratioA = 1 + (changeA || 0) / 100;
        const ratioB = 1 + (changeB || 0) / 100;
        const priceRatio = ratioA / ratioB;
        const ilFactor = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
        const ilPercent = (ilFactor - 1) * 100;

        const holdValue = initialValue * ((ratioA + ratioB) / 2);
        const poolValue = holdValue * ilFactor;
        const ilDollar = holdValue - poolValue;
        const netResult = feesEarned - ilDollar;
        const profitable = netResult > 0;

        return {
          primary: { label: "Net Result (Fees - IL)", value: `$${formatNumber(netResult, 2)}` },
          details: [
            { label: "Impermanent Loss", value: `$${formatNumber(ilDollar, 2)}` },
            { label: "IL Percentage", value: `${formatNumber(Math.abs(ilPercent), 4)}%` },
            { label: "Trading Fees Earned", value: `$${formatNumber(feesEarned, 2)}` },
            { label: "Profitable?", value: profitable ? "Yes" : "No" },
            { label: "Pool Value (before fees)", value: `$${formatNumber(poolValue, 2)}` },
            { label: "Hold Value", value: `$${formatNumber(holdValue, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["liquidity-pool-calculator", "defi-yield-calculator", "staking-rewards-calculator"],
  faq: [
    { question: "What is impermanent loss?", answer: "Impermanent loss occurs when you provide liquidity to an AMM pool and the price ratio of your deposited tokens changes. The pool rebalances your holdings, and you end up with less value than if you had simply held the tokens." },
    { question: "Why is it called impermanent?", answer: "It is called impermanent because the loss only becomes permanent (realized) when you withdraw liquidity. If prices return to their original ratio, the loss disappears." },
    { question: "How can trading fees offset impermanent loss?", answer: "As a liquidity provider, you earn a share of trading fees. If the fees earned over time exceed the impermanent loss, providing liquidity is still more profitable than simply holding." },
  ],
  formula: "IL = 2 x sqrt(price_ratio) / (1 + price_ratio) - 1",
};
