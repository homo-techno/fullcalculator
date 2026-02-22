import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const defiYieldCalculator: CalculatorDefinition = {
  slug: "defi-yield-calculator",
  title: "DeFi Yield Calculator",
  description:
    "Free DeFi yield calculator. Estimate your decentralized finance yield farming returns including auto-compounding, gas costs, and protocol fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["defi", "yield farming", "yield", "decentralized finance", "APY", "liquidity", "farming"],
  variants: [
    {
      id: "yieldFarming",
      name: "Yield Farming Returns",
      fields: [
        { name: "deposit", label: "Deposit Amount ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "apr", label: "Farm APR (%)", type: "number", placeholder: "e.g. 25", step: 0.1 },
        {
          name: "compounding",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Daily", value: "365" },
            { label: "Weekly", value: "52" },
            { label: "Monthly", value: "12" },
            { label: "No Compounding", value: "1" },
          ],
          defaultValue: "365",
        },
        { name: "durationDays", label: "Duration (days)", type: "number", placeholder: "e.g. 365" },
        { name: "protocolFee", label: "Protocol / Performance Fee (%)", type: "number", placeholder: "e.g. 10", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const deposit = inputs.deposit as number;
        const apr = inputs.apr as number;
        const n = Number(inputs.compounding);
        const days = inputs.durationDays as number;
        const protocolFee = (inputs.protocolFee as number) || 0;

        if (!deposit || !apr || !days) return null;

        const years = days / 365;
        const effectiveAPR = apr * (1 - protocolFee / 100);
        const finalValue = deposit * Math.pow(1 + effectiveAPR / 100 / n, n * years);
        const totalYield = finalValue - deposit;
        const effectiveAPY = (Math.pow(1 + effectiveAPR / 100 / n, n) - 1) * 100;
        const dailyYield = totalYield / days;

        return {
          primary: { label: "Total Yield", value: `$${formatNumber(totalYield, 2)}` },
          details: [
            { label: "Final Value", value: `$${formatNumber(finalValue, 2)}` },
            { label: "Deposited", value: `$${formatNumber(deposit, 2)}` },
            { label: "Effective APR (after fees)", value: `${formatNumber(effectiveAPR, 2)}%` },
            { label: "Effective APY", value: `${formatNumber(effectiveAPY, 2)}%` },
            { label: "Average Daily Yield", value: `$${formatNumber(dailyYield, 2)}` },
            { label: "Protocol Fee", value: `${formatNumber(protocolFee, 2)}%` },
          ],
        };
      },
    },
    {
      id: "netAfterGas",
      name: "Net Yield After Gas Costs",
      fields: [
        { name: "deposit", label: "Deposit Amount ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "apr", label: "Farm APR (%)", type: "number", placeholder: "e.g. 25", step: 0.1 },
        { name: "harvestFreqDays", label: "Harvest Frequency (days)", type: "number", placeholder: "e.g. 7" },
        { name: "gasCostPerHarvest", label: "Gas Cost per Harvest ($)", type: "number", placeholder: "e.g. 5" },
        { name: "durationDays", label: "Total Duration (days)", type: "number", placeholder: "e.g. 365" },
      ],
      calculate: (inputs) => {
        const deposit = inputs.deposit as number;
        const apr = inputs.apr as number;
        const harvestFreq = inputs.harvestFreqDays as number;
        const gasCost = inputs.gasCostPerHarvest as number;
        const days = inputs.durationDays as number;

        if (!deposit || !apr || !harvestFreq || !days) return null;

        const totalHarvests = Math.floor(days / harvestFreq);
        const totalGas = totalHarvests * (gasCost || 0);
        const grossYield = deposit * (apr / 100) * (days / 365);
        const netYield = grossYield - totalGas;
        const netAPR = (netYield / deposit) * (365 / days) * 100;

        return {
          primary: { label: "Net Yield After Gas", value: `$${formatNumber(netYield, 2)}` },
          details: [
            { label: "Gross Yield", value: `$${formatNumber(grossYield, 2)}` },
            { label: "Total Gas Costs", value: `$${formatNumber(totalGas, 2)}` },
            { label: "Number of Harvests", value: formatNumber(totalHarvests, 0) },
            { label: "Net APR", value: `${formatNumber(netAPR, 2)}%` },
            { label: "Gas as % of Yield", value: `${formatNumber(grossYield > 0 ? (totalGas / grossYield) * 100 : 0, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["staking-rewards-calculator", "impermanent-loss-calculator", "liquidity-pool-calculator"],
  faq: [
    { question: "What is yield farming?", answer: "Yield farming involves depositing crypto assets into DeFi protocols (liquidity pools, lending platforms) to earn rewards, often in the form of additional tokens, trading fees, or interest." },
    { question: "How does auto-compounding work in DeFi?", answer: "Auto-compounding protocols automatically reinvest your earned rewards back into the pool, growing your position exponentially. This is why APY (compounded) is often much higher than APR (simple)." },
    { question: "Why do gas costs matter?", answer: "On Ethereum and other blockchains, each harvest/claim transaction costs gas. If your deposit is small or gas is high, the gas costs can eat into or exceed your farming rewards." },
  ],
  formula: "Final Value = Deposit x (1 + APR_eff / n)^(n x t); Net Yield = Gross Yield - Gas Costs",
};
