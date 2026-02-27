import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ethereumStakingCalculator: CalculatorDefinition = {
  slug: "ethereum-staking-calculator",
  title: "Ethereum Staking Calculator",
  description: "Free Ethereum staking calculator. Estimate ETH staking rewards based on current APR and your stake amount.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ethereum staking", "ETH staking rewards", "ETH validator", "staking APR"],
  variants: [
    {
      id: "standard",
      name: "Ethereum Staking",
      description: "Free Ethereum staking calculator. Estimate ETH staking rewards based on current ",
      fields: [
        {
          name: "eth",
          label: "ETH Amount",
          type: "number",
          placeholder: "e.g. 32",
          suffix: "ETH",
          min: 0,
          step: 0.01,
        },
        {
          name: "price",
          label: "ETH Price",
          type: "number",
          placeholder: "e.g. 3500",
          prefix: "$",
          min: 0,
        },
        {
          name: "apr",
          label: "Staking APR",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
          defaultValue: 4,
        },
        {
          name: "years",
          label: "Period",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "years",
          min: 0.1,
          max: 30,
          step: 0.1,
        }
      ],
      calculate: (inputs) => {
        const eth = inputs.eth as number;
        const price = inputs.price as number;
        const apr = (inputs.apr as number) / 100;
        const years = inputs.years as number;
        if (!eth || !price || !apr || !years) return null;
        const rewards = eth * apr * years;
        const totalEth = eth + rewards;
        return {
          primary: { label: "ETH Rewards", value: formatNumber(rewards) + " ETH" },
          details: [
            { label: "Total ETH after staking", value: formatNumber(totalEth) + " ETH" },
            { label: "Reward value (USD)", value: "$" + formatNumber(rewards * price) },
            { label: "Total value (USD)", value: "$" + formatNumber(totalEth * price) },
            { label: "Monthly reward", value: formatNumber(rewards / (years * 12)) + " ETH" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How much can I earn staking Ethereum?",
      answer: "Ethereum staking currently yields approximately 3-5% APR. With 32 ETH staked at 4% APR, you would earn about 1.28 ETH per year.",
    },
    {
      question: "Do I need 32 ETH to stake?",
      answer: "Running your own validator requires 32 ETH. However, you can stake any amount through liquid staking services like Lido, Rocket Pool, or centralized exchanges.",
    }
  ],
  formula: "Rewards = ETH Amount x APR x Years",
};
