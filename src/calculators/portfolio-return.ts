import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const portfolioReturnCalculator: CalculatorDefinition = {
  slug: "portfolio-return-calculator",
  title: "Portfolio Return Calculator",
  description: "Free portfolio return calculator. Calculate weighted portfolio returns, time-weighted returns, and compare portfolio performance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["portfolio return", "portfolio performance", "weighted return", "investment return", "time weighted return"],
  variants: [
    {
      id: "simpleReturn",
      name: "Simple Portfolio Return",
      description: "Calculate overall portfolio return",
      fields: [
        { name: "startValue", label: "Starting Portfolio Value", type: "number", prefix: "$", placeholder: "e.g. 100000" },
        { name: "endValue", label: "Ending Portfolio Value", type: "number", prefix: "$", placeholder: "e.g. 125000" },
        { name: "contributions", label: "Total Contributions", type: "number", prefix: "$", placeholder: "e.g. 10000", defaultValue: 0 },
        { name: "withdrawals", label: "Total Withdrawals", type: "number", prefix: "$", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "years", label: "Time Period (years)", type: "number", placeholder: "e.g. 3", step: 0.1 },
      ],
      calculate: (inputs) => {
        const start = inputs.startValue as number;
        const end = inputs.endValue as number;
        const contributions = (inputs.contributions as number) || 0;
        const withdrawals = (inputs.withdrawals as number) || 0;
        const years = inputs.years as number;
        if (!start || !end || !years) return null;
        const netFlow = contributions - withdrawals;
        const gain = end - start - netFlow;
        const avgInvestment = start + netFlow / 2;
        const totalReturn = (gain / avgInvestment) * 100;
        const annualizedReturn = (Math.pow(1 + gain / avgInvestment, 1 / years) - 1) * 100;
        return {
          primary: { label: "Total Return", value: `${formatNumber(totalReturn, 2)}%` },
          details: [
            { label: "Annualized return", value: `${formatNumber(annualizedReturn, 2)}%` },
            { label: "Dollar gain/loss", value: `$${formatNumber(gain, 2)}` },
            { label: "Net contributions", value: `$${formatNumber(netFlow, 2)}` },
            { label: "Ending value", value: `$${formatNumber(end, 2)}` },
          ],
        };
      },
    },
    {
      id: "weightedReturn",
      name: "Weighted Return (3 Assets)",
      description: "Calculate weighted portfolio return from 3 assets",
      fields: [
        { name: "weight1", label: "Asset 1 Weight (%)", type: "number", placeholder: "e.g. 50", suffix: "%" },
        { name: "return1", label: "Asset 1 Return (%)", type: "number", placeholder: "e.g. 12", suffix: "%" },
        { name: "weight2", label: "Asset 2 Weight (%)", type: "number", placeholder: "e.g. 30", suffix: "%" },
        { name: "return2", label: "Asset 2 Return (%)", type: "number", placeholder: "e.g. 8", suffix: "%" },
        { name: "weight3", label: "Asset 3 Weight (%)", type: "number", placeholder: "e.g. 20", suffix: "%" },
        { name: "return3", label: "Asset 3 Return (%)", type: "number", placeholder: "e.g. 4", suffix: "%" },
      ],
      calculate: (inputs) => {
        const w1 = (inputs.weight1 as number) / 100;
        const r1 = inputs.return1 as number;
        const w2 = (inputs.weight2 as number) / 100;
        const r2 = inputs.return2 as number;
        const w3 = (inputs.weight3 as number) / 100;
        const r3 = inputs.return3 as number;
        if (!w1 || r1 === undefined || !w2 || r2 === undefined || !w3 || r3 === undefined) return null;
        const totalWeight = w1 + w2 + w3;
        const weightedReturn = w1 * r1 + w2 * r2 + w3 * r3;
        return {
          primary: { label: "Portfolio Return", value: `${formatNumber(weightedReturn, 2)}%` },
          details: [
            { label: "Asset 1 contribution", value: `${formatNumber(w1 * r1, 2)}%` },
            { label: "Asset 2 contribution", value: `${formatNumber(w2 * r2, 2)}%` },
            { label: "Asset 3 contribution", value: `${formatNumber(w3 * r3, 2)}%` },
            { label: "Total weight", value: `${formatNumber(totalWeight * 100, 1)}%` },
            { label: "Weights valid?", value: Math.abs(totalWeight - 1) < 0.01 ? "Yes (sums to 100%)" : "No (does not sum to 100%)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sharpe-ratio-calculator", "compound-interest-calculator", "roi-calculator"],
  faq: [
    { question: "How do you calculate portfolio return?", answer: "Simple portfolio return = (Ending Value - Beginning Value - Net Contributions) / Average Investment. Weighted portfolio return = Sum of (Weight x Return) for each asset in the portfolio." },
    { question: "What is time-weighted return?", answer: "Time-weighted return (TWR) eliminates the impact of cash flows (deposits/withdrawals) to measure pure investment performance. It chains together sub-period returns and is the industry standard for comparing fund managers." },
    { question: "How do cash flows affect portfolio return?", answer: "Cash flows (contributions and withdrawals) impact dollar-weighted returns. The Modified Dietz method approximates the timing of cash flows by assuming they occur at the midpoint of the period." },
  ],
  formula: "Total Return = (End - Start - Net Flows) / Avg Investment | Weighted Return = Sum(wi * ri)",
};
