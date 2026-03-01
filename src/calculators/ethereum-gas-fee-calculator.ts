import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ethereumGasFeeCalculator: CalculatorDefinition = {
  slug: "ethereum-gas-fee-calculator",
  title: "Ethereum Gas Fee Calculator",
  description: "Estimate Ethereum transaction fees based on gas limit and gas price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ethereum gas fee", "ETH gas calculator", "gwei to usd"],
  variants: [{
    id: "standard",
    name: "Ethereum Gas Fee",
    description: "Estimate Ethereum transaction fees based on gas limit and gas price",
    fields: [
      { name: "gasLimit", label: "Gas Limit", type: "number", min: 21000, max: 10000000, defaultValue: 21000 },
      { name: "gasPrice", label: "Gas Price", type: "number", suffix: "gwei", min: 1, max: 1000, defaultValue: 30 },
      { name: "ethPrice", label: "ETH Price (USD)", type: "number", prefix: "$", min: 1, max: 100000, defaultValue: 2500 },
    ],
    calculate: (inputs) => {
      const gasLimit = inputs.gasLimit as number;
      const gasPrice = inputs.gasPrice as number;
      const ethPrice = inputs.ethPrice as number;
      if (!gasLimit || !gasPrice || !ethPrice) return null;
      const gasFeeEth = (gasLimit * gasPrice) / 1e9;
      const gasFeeUsd = gasFeeEth * ethPrice;
      const erc20Gas = 65000;
      const erc20Fee = (erc20Gas * gasPrice) / 1e9 * ethPrice;
      const swapGas = 150000;
      const swapFee = (swapGas * gasPrice) / 1e9 * ethPrice;
      return {
        primary: { label: "Transaction Fee", value: "$" + formatNumber(gasFeeUsd, 2) },
        details: [
          { label: "Fee in ETH", value: gasFeeEth.toFixed(6) + " ETH" },
          { label: "ERC-20 Transfer Fee", value: "$" + formatNumber(erc20Fee, 2) },
          { label: "DEX Swap Fee", value: "$" + formatNumber(swapFee, 2) },
        ],
      };
    },
  }],
  relatedSlugs: ["crypto-leverage-liquidation-calculator", "crypto-yield-farming-apy-calculator"],
  faq: [
    { question: "What determines Ethereum gas fees?", answer: "Gas fees depend on network congestion, transaction complexity (gas limit), and the gas price you are willing to pay in gwei." },
    { question: "How can I reduce gas fees?", answer: "Transact during off-peak hours, use Layer 2 solutions, or batch transactions to reduce total gas consumption." },
  ],
  formula: "Fee = (Gas Limit x Gas Price in Gwei) / 1,000,000,000 x ETH Price",
};
