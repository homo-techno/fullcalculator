import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoYieldFarmingApyCalculator: CalculatorDefinition = {
  slug: "crypto-yield-farming-apy-calculator",
  title: "Crypto Yield Farming APY Calculator",
  description: "Calculate the annual percentage yield for a crypto yield farming or staking position.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["yield farming APY", "crypto staking calculator", "DeFi APY"],
  variants: [{
    id: "standard",
    name: "Crypto Yield Farming APY",
    description: "Calculate the annual percentage yield for a crypto yield farming or staking position",
    fields: [
      { name: "principal", label: "Amount Deposited", type: "number", prefix: "$", min: 1, max: 100000000, defaultValue: 10000 },
      { name: "dailyRate", label: "Daily Reward Rate", type: "number", suffix: "%", min: 0.001, max: 10, step: 0.001, defaultValue: 0.1 },
      { name: "compoundFreq", label: "Compounding Frequency", type: "select", options: [{value:"1",label:"Daily"},{value:"7",label:"Weekly"},{value:"30",label:"Monthly"},{value:"365",label:"Yearly"}], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const principal = inputs.principal as number;
      const dailyRate = (inputs.dailyRate as number) / 100;
      const freq = parseInt(inputs.compoundFreq as string);
      if (!principal || principal <= 0 || !dailyRate) return null;
      const periodsPerYear = 365 / freq;
      const ratePerPeriod = dailyRate * freq;
      const apy = (Math.pow(1 + ratePerPeriod, periodsPerYear) - 1) * 100;
      const yearlyEarnings = principal * apy / 100;
      const monthlyEarnings = yearlyEarnings / 12;
      const dailyEarnings = principal * dailyRate;
      return {
        primary: { label: "APY", value: apy.toFixed(2) + "%" },
        details: [
          { label: "Yearly Earnings", value: "$" + formatNumber(Math.round(yearlyEarnings)) },
          { label: "Monthly Earnings", value: "$" + formatNumber(Math.round(monthlyEarnings)) },
          { label: "Daily Earnings", value: "$" + formatNumber(dailyEarnings, 2) },
          { label: "Total After 1 Year", value: "$" + formatNumber(Math.round(principal + yearlyEarnings)) },
        ],
      };
    },
  }],
  relatedSlugs: ["crypto-portfolio-rebalancing-calculator", "crypto-leverage-liquidation-calculator"],
  faq: [
    { question: "What is APY in crypto yield farming?", answer: "APY (Annual Percentage Yield) reflects the total return including compound interest over one year from staking or providing liquidity." },
    { question: "Are high APY rates sustainable?", answer: "Extremely high APY rates are often temporary and may decrease as more capital enters the pool or token prices decline." },
  ],
  formula: "APY = (1 + Daily Rate x Compound Period)^(365/Period) - 1",
};
