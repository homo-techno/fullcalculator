import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoStakingCalculator: CalculatorDefinition = {
  slug: "crypto-staking-calculator",
  title: "Crypto Staking Calculator",
  description: "Free crypto staking calculator. Estimate your staking rewards based on APY, token amount, and staking duration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crypto staking", "staking rewards", "staking calculator", "APY calculator"],
  variants: [
    {
      id: "standard",
      name: "Crypto Staking",
      description: "Free crypto staking calculator. Estimate your staking rewards based on APY, toke",
      fields: [
        {
          name: "amount",
          label: "Tokens Staked",
          type: "number",
          placeholder: "e.g. 1000",
          min: 0,
        },
        {
          name: "price",
          label: "Token Price",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "apy",
          label: "Annual Percentage Yield",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 1000,
          step: 0.1,
        },
        {
          name: "months",
          label: "Staking Period",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "months",
          min: 1,
          max: 120,
        }
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const price = inputs.price as number;
        const apy = (inputs.apy as number) / 100;
        const months = inputs.months as number;
        if (!amount || !price || !apy || !months) return null;
        const years = months / 12;
        const finalTokens = amount * Math.pow(1 + apy / 365, 365 * years);
        const earned = finalTokens - amount;
        const initialValue = amount * price;
        const finalValue = finalTokens * price;
        return {
          primary: { label: "Total Rewards", value: formatNumber(earned) + " tokens" },
          details: [
            { label: "Final token balance", value: formatNumber(finalTokens) },
            { label: "Initial value", value: "$" + formatNumber(initialValue) },
            { label: "Final value (same price)", value: "$" + formatNumber(finalValue) },
            { label: "Reward value", value: "$" + formatNumber(earned * price) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does crypto staking work?",
      answer: "Staking involves locking your cryptocurrency to support network operations like transaction validation. In return, you earn rewards, similar to earning interest on a savings account.",
    },
    {
      question: "Is crypto staking safe?",
      answer: "Staking carries risks including price volatility, lock-up periods, slashing penalties, and smart contract vulnerabilities. Always research the protocol before staking.",
    }
  ],
  formula: "Rewards = Tokens x (1 + APY/365)^(365 x Years) - Tokens",
};
