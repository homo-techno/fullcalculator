import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const polkadotStakingCalculator: CalculatorDefinition = {
  slug: "polkadot-staking-calculator",
  title: "Polkadot Staking Calculator",
  description: "Free polkadot staking calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["polkadot staking calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Polkadot Staking",
      description: "Calculate polkadot staking",
      fields: [
        {
          name: "amount",
          label: "Token Amount",
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
          label: "APY / Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 1000,
          step: 0.1,
        }
      ],
      calculate: (inputs) => {
        const amt = inputs.amount as number;
        const price = inputs.price as number;
        const apy = (inputs.apy as number) / 100;
        if (!amt || !price) return null;
        const value = amt * price;
        const yearlyReward = amt * (apy || 0);
        const rewardValue = yearlyReward * price;
        return {
          primary: { label: "Portfolio Value", value: "$" + formatNumber(value) },
          details: [
            { label: "Yearly rewards", value: formatNumber(yearlyReward) + " tokens" },
            { label: "Reward value", value: "$" + formatNumber(rewardValue) },
            { label: "Monthly rewards", value: formatNumber(yearlyReward / 12) + " tokens" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the polkadot staking calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
