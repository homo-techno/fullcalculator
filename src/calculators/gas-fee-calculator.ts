import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasFeeCalculator: CalculatorDefinition = {
  slug: "gas-fee-calculator",
  title: "Ethereum Gas Fee Calculator",
  description:
    "Free Ethereum gas fee calculator. Estimate transaction costs based on gas limit, gas price in gwei, and current ETH price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gas fee", "ethereum", "gwei", "transaction cost", "ETH", "gas limit", "gas price"],
  variants: [
    {
      id: "basicGas",
      name: "Transaction Gas Cost",
      fields: [
        { name: "gasLimit", label: "Gas Limit (units)", type: "number", placeholder: "e.g. 21000", defaultValue: 21000 },
        { name: "gasPrice", label: "Gas Price (Gwei)", type: "number", placeholder: "e.g. 30", step: 0.1 },
        { name: "ethPrice", label: "ETH Price ($)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const gasLimit = inputs.gasLimit as number;
        const gasPrice = inputs.gasPrice as number;
        const ethPrice = inputs.ethPrice as number;

        if (!gasLimit || !gasPrice || !ethPrice) return null;

        const gasCostETH = (gasLimit * gasPrice) / 1e9;
        const gasCostUSD = gasCostETH * ethPrice;

        return {
          primary: { label: "Transaction Cost", value: `$${formatNumber(gasCostUSD, 4)}` },
          details: [
            { label: "Cost in ETH", value: `${formatNumber(gasCostETH, 8)} ETH` },
            { label: "Cost in Gwei", value: `${formatNumber(gasLimit * gasPrice, 0)} Gwei` },
            { label: "Gas Limit", value: formatNumber(gasLimit, 0) },
            { label: "Gas Price", value: `${formatNumber(gasPrice, 2)} Gwei` },
            { label: "ETH Price", value: `$${formatNumber(ethPrice, 2)}` },
          ],
        };
      },
    },
    {
      id: "eip1559",
      name: "EIP-1559 Fee Estimation",
      fields: [
        { name: "gasLimit", label: "Gas Limit (units)", type: "number", placeholder: "e.g. 21000", defaultValue: 21000 },
        { name: "baseFee", label: "Base Fee (Gwei)", type: "number", placeholder: "e.g. 20", step: 0.1 },
        { name: "priorityFee", label: "Priority Fee / Tip (Gwei)", type: "number", placeholder: "e.g. 2", step: 0.1 },
        { name: "ethPrice", label: "ETH Price ($)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const gasLimit = inputs.gasLimit as number;
        const baseFee = inputs.baseFee as number;
        const priorityFee = inputs.priorityFee as number;
        const ethPrice = inputs.ethPrice as number;

        if (!gasLimit || !baseFee || !ethPrice) return null;

        const totalGasPrice = baseFee + (priorityFee || 0);
        const gasCostETH = (gasLimit * totalGasPrice) / 1e9;
        const gasCostUSD = gasCostETH * ethPrice;
        const burnedETH = (gasLimit * baseFee) / 1e9;
        const tipETH = (gasLimit * (priorityFee || 0)) / 1e9;

        return {
          primary: { label: "Total Transaction Cost", value: `$${formatNumber(gasCostUSD, 4)}` },
          details: [
            { label: "Cost in ETH", value: `${formatNumber(gasCostETH, 8)} ETH` },
            { label: "Effective Gas Price", value: `${formatNumber(totalGasPrice, 2)} Gwei` },
            { label: "ETH Burned (Base Fee)", value: `${formatNumber(burnedETH, 8)} ETH` },
            { label: "Validator Tip", value: `${formatNumber(tipETH, 8)} ETH` },
            { label: "Burned USD Value", value: `$${formatNumber(burnedETH * ethPrice, 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-profit-calculator", "defi-yield-calculator", "bitcoin-profit-calculator"],
  faq: [
    { question: "What is gas in Ethereum?", answer: "Gas is a unit measuring the computational effort required to execute operations on the Ethereum network. Every transaction and smart contract interaction requires gas, and you pay for gas using ETH." },
    { question: "What is Gwei?", answer: "Gwei is a denomination of ETH. 1 Gwei = 0.000000001 ETH (10^-9 ETH). Gas prices are typically quoted in Gwei." },
    { question: "What is EIP-1559?", answer: "EIP-1559 introduced a base fee (burned) plus a priority fee (tip to validators). The base fee adjusts dynamically based on network demand, making fees more predictable." },
  ],
  formula: "Gas Cost (ETH) = Gas Limit x Gas Price / 10^9; Gas Cost ($) = Gas Cost (ETH) x ETH Price",
};
