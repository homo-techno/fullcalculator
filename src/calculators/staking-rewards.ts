import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stakingRewardsCalculator: CalculatorDefinition = {
  slug: "staking-rewards-calculator",
  title: "Staking Rewards Calculator",
  description:
    "Free staking rewards calculator. Estimate your crypto staking earnings based on amount staked, APY, compounding frequency, and staking duration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["staking", "rewards", "APY", "crypto staking", "proof of stake", "yield", "passive income"],
  variants: [
    {
      id: "simpleStaking",
      name: "Simple Staking Rewards",
      fields: [
        { name: "amountStaked", label: "Amount Staked ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "apy", label: "Annual Percentage Yield (APY %)", type: "number", placeholder: "e.g. 5", step: 0.1 },
        { name: "duration", label: "Staking Duration", type: "number", placeholder: "e.g. 12" },
        {
          name: "durationUnit",
          label: "Duration Unit",
          type: "select",
          options: [
            { label: "Months", value: "months" },
            { label: "Years", value: "years" },
          ],
          defaultValue: "months",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amountStaked as number;
        const apy = inputs.apy as number;
        const duration = inputs.duration as number;
        const unit = inputs.durationUnit as string;

        if (!amount || !apy || !duration) return null;

        const years = unit === "years" ? duration : duration / 12;
        const finalValue = amount * Math.pow(1 + apy / 100, years);
        const totalRewards = finalValue - amount;
        const monthlyReward = totalRewards / (years * 12);

        return {
          primary: { label: "Total Rewards", value: `$${formatNumber(totalRewards, 2)}` },
          details: [
            { label: "Final Value", value: `$${formatNumber(finalValue, 2)}` },
            { label: "Initial Stake", value: `$${formatNumber(amount, 2)}` },
            { label: "APY", value: `${formatNumber(apy, 2)}%` },
            { label: "Average Monthly Reward", value: `$${formatNumber(monthlyReward, 2)}` },
            { label: "Duration", value: `${formatNumber(years, 2)} years` },
          ],
        };
      },
    },
    {
      id: "compoundedStaking",
      name: "Compounded Staking",
      fields: [
        { name: "amountStaked", label: "Amount Staked ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "apr", label: "Annual Percentage Rate (APR %)", type: "number", placeholder: "e.g. 5", step: 0.1 },
        {
          name: "compounding",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Daily", value: "365" },
            { label: "Weekly", value: "52" },
            { label: "Monthly", value: "12" },
            { label: "Quarterly", value: "4" },
            { label: "Yearly", value: "1" },
          ],
          defaultValue: "365",
        },
        { name: "durationYears", label: "Duration (years)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const amount = inputs.amountStaked as number;
        const apr = inputs.apr as number;
        const n = Number(inputs.compounding);
        const years = inputs.durationYears as number;

        if (!amount || !apr || !n || !years) return null;

        const finalValue = amount * Math.pow(1 + apr / 100 / n, n * years);
        const totalRewards = finalValue - amount;
        const effectiveAPY = (Math.pow(1 + apr / 100 / n, n) - 1) * 100;

        return {
          primary: { label: "Total Rewards", value: `$${formatNumber(totalRewards, 2)}` },
          details: [
            { label: "Final Value", value: `$${formatNumber(finalValue, 2)}` },
            { label: "Initial Stake", value: `$${formatNumber(amount, 2)}` },
            { label: "APR", value: `${formatNumber(apr, 2)}%` },
            { label: "Effective APY", value: `${formatNumber(effectiveAPY, 2)}%` },
            { label: "Compounding Periods/Year", value: formatNumber(n, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["defi-yield-calculator", "compound-interest-calculator", "crypto-profit-calculator"],
  faq: [
    { question: "What is the difference between APR and APY?", answer: "APR is the simple annual interest rate without compounding. APY includes the effect of compounding, so it is always equal to or higher than APR depending on how often rewards are compounded." },
    { question: "How often are staking rewards paid?", answer: "It depends on the blockchain. Some pay every epoch (e.g., every 6.4 minutes for Ethereum), others daily, weekly, or after an unbonding period." },
    { question: "Are staking rewards taxable?", answer: "In most jurisdictions, staking rewards are considered taxable income at the time they are received. Consult a tax professional for your specific situation." },
  ],
  formula: "Compounded Value = Principal x (1 + APR / n)^(n x t); APY = (1 + APR / n)^n - 1",
};
