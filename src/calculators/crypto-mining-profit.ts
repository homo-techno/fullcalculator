import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoMiningProfitCalculator: CalculatorDefinition = {
  slug: "crypto-mining-profit-calculator",
  title: "Crypto Mining Profitability Calculator",
  description:
    "Free crypto mining profitability calculator. Estimate daily, monthly, and yearly mining revenue based on hash rate, power consumption, electricity cost, and coin price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crypto", "mining", "profitability", "hash rate", "bitcoin mining", "electricity cost", "revenue"],
  variants: [
    {
      id: "basicMining",
      name: "Basic Mining Profit",
      fields: [
        { name: "hashRate", label: "Hash Rate (TH/s)", type: "number", placeholder: "e.g. 100" },
        { name: "powerConsumption", label: "Power Consumption (Watts)", type: "number", placeholder: "e.g. 3250" },
        { name: "electricityCost", label: "Electricity Cost ($/kWh)", type: "number", placeholder: "e.g. 0.10", step: 0.01 },
        { name: "coinPrice", label: "Coin Price ($)", type: "number", placeholder: "e.g. 60000" },
        { name: "blockReward", label: "Block Reward (coins)", type: "number", placeholder: "e.g. 3.125", step: 0.001 },
        { name: "networkDifficulty", label: "Network Difficulty (T)", type: "number", placeholder: "e.g. 80" },
        { name: "poolFee", label: "Pool Fee (%)", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const hashRate = inputs.hashRate as number;
        const powerConsumption = inputs.powerConsumption as number;
        const electricityCost = inputs.electricityCost as number;
        const coinPrice = inputs.coinPrice as number;
        const blockReward = inputs.blockReward as number;
        const networkDifficulty = inputs.networkDifficulty as number;
        const poolFee = (inputs.poolFee as number) || 0;

        if (!hashRate || !powerConsumption || !electricityCost || !coinPrice || !blockReward || !networkDifficulty) return null;

        const dailyCoins = (hashRate * 86400 * blockReward) / (networkDifficulty * Math.pow(2, 32));
        const dailyCoinsAfterFee = dailyCoins * (1 - poolFee / 100);
        const dailyRevenue = dailyCoinsAfterFee * coinPrice;
        const dailyElectricity = (powerConsumption / 1000) * 24 * electricityCost;
        const dailyProfit = dailyRevenue - dailyElectricity;
        const monthlyProfit = dailyProfit * 30;
        const yearlyProfit = dailyProfit * 365;

        return {
          primary: { label: "Daily Profit", value: `$${formatNumber(dailyProfit, 2)}` },
          details: [
            { label: "Daily Revenue (gross)", value: `$${formatNumber(dailyRevenue, 2)}` },
            { label: "Daily Electricity Cost", value: `$${formatNumber(dailyElectricity, 2)}` },
            { label: "Daily Coins Mined", value: formatNumber(dailyCoinsAfterFee, 8) },
            { label: "Monthly Profit", value: `$${formatNumber(monthlyProfit, 2)}` },
            { label: "Yearly Profit", value: `$${formatNumber(yearlyProfit, 2)}` },
            { label: "Pool Fee Deducted", value: `${formatNumber(poolFee, 2)}%` },
          ],
        };
      },
    },
    {
      id: "roiBreakeven",
      name: "ROI / Break-Even",
      fields: [
        { name: "hardwareCost", label: "Hardware Cost ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "dailyProfit", label: "Estimated Daily Profit ($)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const hardwareCost = inputs.hardwareCost as number;
        const dailyProfit = inputs.dailyProfit as number;

        if (!hardwareCost || !dailyProfit) return null;

        const breakEvenDays = hardwareCost / dailyProfit;
        const breakEvenMonths = breakEvenDays / 30;
        const yearlyProfit = dailyProfit * 365;
        const yearlyROI = ((yearlyProfit - hardwareCost) / hardwareCost) * 100;

        return {
          primary: { label: "Break-Even", value: `${formatNumber(breakEvenDays, 0)} days` },
          details: [
            { label: "Break-Even (months)", value: formatNumber(breakEvenMonths, 1) },
            { label: "Hardware Cost", value: `$${formatNumber(hardwareCost, 2)}` },
            { label: "Yearly Profit", value: `$${formatNumber(yearlyProfit, 2)}` },
            { label: "First-Year ROI", value: `${formatNumber(yearlyROI, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-profit-calculator", "hash-rate-converter", "electricity-calculator"],
  faq: [
    { question: "How is mining profitability calculated?", answer: "Mining profitability is calculated by estimating the coins mined per day based on your hash rate and network difficulty, multiplying by the coin price, and subtracting electricity costs and pool fees." },
    { question: "What factors affect mining profitability?", answer: "Key factors include hash rate, electricity cost, hardware efficiency, coin price, network difficulty, pool fees, and block reward (which halves periodically for Bitcoin)." },
    { question: "Is crypto mining still profitable?", answer: "Profitability depends on electricity costs, hardware efficiency, and coin prices. Low electricity costs and efficient ASIC miners can still be profitable, but margins have tightened with rising difficulty." },
  ],
  formula: "Daily Coins = (Hash Rate x 86400 x Block Reward) / (Difficulty x 2^32); Daily Profit = (Daily Coins x Price) - Electricity Cost",
};
