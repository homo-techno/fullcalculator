import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epsCalculator: CalculatorDefinition = {
  slug: "eps-calculator",
  title: "EPS Calculator",
  description: "Free earnings per share (EPS) calculator. Calculate basic EPS, diluted EPS, and EPS growth rate for stock analysis.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["eps", "earnings per share", "basic eps", "diluted eps", "stock earnings", "eps calculator"],
  variants: [
    {
      id: "basicEps",
      name: "Basic EPS",
      description: "Calculate basic earnings per share",
      fields: [
        { name: "netIncome", label: "Net Income", type: "number", prefix: "$", placeholder: "e.g. 5000000" },
        { name: "preferredDividends", label: "Preferred Dividends", type: "number", prefix: "$", placeholder: "e.g. 200000", defaultValue: 0 },
        { name: "sharesOutstanding", label: "Weighted Avg. Shares Outstanding", type: "number", placeholder: "e.g. 1000000" },
      ],
      calculate: (inputs) => {
        const netIncome = inputs.netIncome as number;
        const prefDiv = (inputs.preferredDividends as number) || 0;
        const shares = inputs.sharesOutstanding as number;
        if (!netIncome || !shares) return null;
        const eps = (netIncome - prefDiv) / shares;
        return {
          primary: { label: "Basic EPS", value: `$${formatNumber(eps, 2)}` },
          details: [
            { label: "Net income", value: `$${formatNumber(netIncome)}` },
            { label: "Preferred dividends", value: `$${formatNumber(prefDiv)}` },
            { label: "Earnings available to common", value: `$${formatNumber(netIncome - prefDiv)}` },
            { label: "Shares outstanding", value: formatNumber(shares) },
          ],
        };
      },
    },
    {
      id: "dilutedEps",
      name: "Diluted EPS",
      description: "Calculate diluted earnings per share",
      fields: [
        { name: "netIncome", label: "Net Income", type: "number", prefix: "$", placeholder: "e.g. 5000000" },
        { name: "preferredDividends", label: "Preferred Dividends", type: "number", prefix: "$", placeholder: "e.g. 200000", defaultValue: 0 },
        { name: "sharesOutstanding", label: "Shares Outstanding", type: "number", placeholder: "e.g. 1000000" },
        { name: "dilutiveShares", label: "Dilutive Shares (options, warrants)", type: "number", placeholder: "e.g. 50000" },
      ],
      calculate: (inputs) => {
        const netIncome = inputs.netIncome as number;
        const prefDiv = (inputs.preferredDividends as number) || 0;
        const shares = inputs.sharesOutstanding as number;
        const dilutive = (inputs.dilutiveShares as number) || 0;
        if (!netIncome || !shares) return null;
        const basicEps = (netIncome - prefDiv) / shares;
        const dilutedEps = (netIncome - prefDiv) / (shares + dilutive);
        const dilutionEffect = ((basicEps - dilutedEps) / basicEps) * 100;
        return {
          primary: { label: "Diluted EPS", value: `$${formatNumber(dilutedEps, 2)}` },
          details: [
            { label: "Basic EPS", value: `$${formatNumber(basicEps, 2)}` },
            { label: "Dilution effect", value: `${formatNumber(dilutionEffect, 2)}%` },
            { label: "Total diluted shares", value: formatNumber(shares + dilutive) },
          ],
        };
      },
    },
    {
      id: "epsGrowth",
      name: "EPS Growth",
      description: "Calculate EPS growth rate between periods",
      fields: [
        { name: "previousEps", label: "Previous EPS", type: "number", prefix: "$", placeholder: "e.g. 4.50" },
        { name: "currentEps", label: "Current EPS", type: "number", prefix: "$", placeholder: "e.g. 5.25" },
      ],
      calculate: (inputs) => {
        const prev = inputs.previousEps as number;
        const curr = inputs.currentEps as number;
        if (!prev || !curr) return null;
        const growth = ((curr - prev) / Math.abs(prev)) * 100;
        return {
          primary: { label: "EPS Growth", value: `${formatNumber(growth, 2)}%` },
          details: [
            { label: "Previous EPS", value: `$${formatNumber(prev, 2)}` },
            { label: "Current EPS", value: `$${formatNumber(curr, 2)}` },
            { label: "Change", value: `$${formatNumber(curr - prev, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pe-ratio-calculator", "earnings-yield-calculator", "dividend-calculator"],
  faq: [
    { question: "What is EPS?", answer: "Earnings Per Share (EPS) measures the portion of a company's profit allocated to each outstanding share of common stock. It is calculated as (Net Income - Preferred Dividends) / Weighted Average Shares Outstanding." },
    { question: "What is the difference between basic and diluted EPS?", answer: "Basic EPS uses the current number of shares outstanding, while diluted EPS accounts for all potentially dilutive securities like stock options, warrants, and convertible bonds. Diluted EPS is always less than or equal to basic EPS." },
    { question: "Why is EPS important?", answer: "EPS is a key profitability metric used to compare companies and calculate the P/E ratio. Higher EPS generally indicates greater profitability, and EPS growth is closely watched by investors." },
  ],
  formula: "Basic EPS = (Net Income - Preferred Dividends) / Shares Outstanding | Diluted EPS = (Net Income - Pref Div) / (Shares + Dilutive Shares)",
};
