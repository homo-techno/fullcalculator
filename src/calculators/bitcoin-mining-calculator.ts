import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bitcoinMiningCalculator: CalculatorDefinition = {
  slug: "bitcoin-mining-calculator",
  title: "Bitcoin Mining Calculator",
  description: "Free Bitcoin mining profitability calculator. Estimate daily, monthly, and yearly mining revenue based on hashrate, power consumption, and electricity cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bitcoin mining", "mining profitability", "hashrate calculator", "mining calculator"],
  variants: [
    {
      id: "standard",
      name: "Bitcoin Mining",
      description: "Free Bitcoin mining profitability calculator. Estimate daily, monthly, and yearl",
      fields: [
        {
          name: "hashrate",
          label: "Hash Rate",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "TH/s",
          min: 0,
        },
        {
          name: "power",
          label: "Power Consumption",
          type: "number",
          placeholder: "e.g. 3250",
          suffix: "W",
          min: 0,
        },
        {
          name: "electricityCost",
          label: "Electricity Cost",
          type: "number",
          placeholder: "e.g. 0.10",
          prefix: "$",
          suffix: "/kWh",
          min: 0,
          step: 0.01,
        },
        {
          name: "btcPrice",
          label: "BTC Price",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
          min: 0,
        },
        {
          name: "poolFee",
          label: "Pool Fee",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "%",
          min: 0,
          max: 100,
          defaultValue: 2,
        }
      ],
      calculate: (inputs) => {
        const hashrate = inputs.hashrate as number;
        const power = inputs.power as number;
        const elecCost = inputs.electricityCost as number;
        const btcPrice = inputs.btcPrice as number;
        const poolFee = (inputs.poolFee as number) / 100;
        if (!hashrate || !power || !elecCost || !btcPrice) return null;
        const dailyBtc = (hashrate * 1e12 * 6.25 * 86400) / (2**32 * 50000000000000);
        const dailyBtcAfterFee = dailyBtc * (1 - poolFee);
        const dailyRevenue = dailyBtcAfterFee * btcPrice;
        const dailyElecCost = (power / 1000) * 24 * elecCost;
        const dailyProfit = dailyRevenue - dailyElecCost;
        return {
          primary: { label: "Daily Profit", value: "$" + formatNumber(dailyProfit) },
          details: [
            { label: "Daily revenue", value: "$" + formatNumber(dailyRevenue) },
            { label: "Daily electricity cost", value: "$" + formatNumber(dailyElecCost) },
            { label: "Monthly profit", value: "$" + formatNumber(dailyProfit * 30) },
            { label: "Yearly profit", value: "$" + formatNumber(dailyProfit * 365) },
            { label: "Daily BTC mined", value: formatNumber(dailyBtcAfterFee, 8) + " BTC" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "Is Bitcoin mining profitable?",
      answer: "Bitcoin mining profitability depends on your hashrate, electricity cost, and BTC price. Low electricity costs (under $0.05/kWh) are typically needed for profitability.",
    },
    {
      question: "What hashrate do I need to mine Bitcoin?",
      answer: "Modern ASIC miners produce 100-400 TH/s. Solo mining requires enormous hashrate; most miners join mining pools to receive regular payouts.",
    }
  ],
  formula: "Daily Profit = (Daily BTC Mined x BTC Price) - (Power x 24h x Electricity Cost)",
};
