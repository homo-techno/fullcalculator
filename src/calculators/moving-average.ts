import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingAverageCalculator: CalculatorDefinition = {
  slug: "moving-average-calculator",
  title: "Moving Average Calculator",
  description:
    "Free moving average calculator. Calculate Simple Moving Average (SMA) and Exponential Moving Average (EMA) from a set of price data.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["moving average", "SMA", "EMA", "technical analysis", "trading", "trend", "indicator"],
  variants: [
    {
      id: "sma",
      name: "Simple Moving Average (SMA)",
      fields: [
        { name: "currentPrice", label: "Current Price ($)", type: "number", placeholder: "e.g. 150" },
        { name: "sumOfPrices", label: "Sum of All Prices in Period ($)", type: "number", placeholder: "e.g. 7200" },
        { name: "period", label: "Number of Periods", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const currentPrice = inputs.currentPrice as number;
        const sumPrices = inputs.sumOfPrices as number;
        const period = inputs.period as number;

        if (!sumPrices || !period) return null;

        const sma = sumPrices / period;
        const deviation = currentPrice ? ((currentPrice - sma) / sma) * 100 : 0;
        const aboveBelow = currentPrice ? (currentPrice > sma ? "Above SMA" : "Below SMA") : "N/A";

        return {
          primary: { label: "SMA", value: `$${formatNumber(sma, 4)}` },
          details: [
            { label: "Period", value: formatNumber(period, 0) },
            { label: "Sum of Prices", value: `$${formatNumber(sumPrices, 2)}` },
            { label: "Current Price", value: currentPrice ? `$${formatNumber(currentPrice, 4)}` : "N/A" },
            { label: "Price vs SMA", value: aboveBelow },
            { label: "Deviation from SMA", value: currentPrice ? `${formatNumber(deviation, 2)}%` : "N/A" },
          ],
        };
      },
    },
    {
      id: "ema",
      name: "Exponential Moving Average (EMA)",
      fields: [
        { name: "currentPrice", label: "Current Price ($)", type: "number", placeholder: "e.g. 150" },
        { name: "previousEMA", label: "Previous EMA ($)", type: "number", placeholder: "e.g. 145" },
        { name: "period", label: "EMA Period", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const currentPrice = inputs.currentPrice as number;
        const prevEMA = inputs.previousEMA as number;
        const period = inputs.period as number;

        if (!currentPrice || !prevEMA || !period) return null;

        const multiplier = 2 / (period + 1);
        const ema = (currentPrice - prevEMA) * multiplier + prevEMA;
        const deviation = ((currentPrice - ema) / ema) * 100;
        const aboveBelow = currentPrice > ema ? "Above EMA" : "Below EMA";

        return {
          primary: { label: "Current EMA", value: `$${formatNumber(ema, 4)}` },
          details: [
            { label: "Period", value: formatNumber(period, 0) },
            { label: "Multiplier (Smoothing)", value: formatNumber(multiplier, 6) },
            { label: "Previous EMA", value: `$${formatNumber(prevEMA, 4)}` },
            { label: "Current Price", value: `$${formatNumber(currentPrice, 4)}` },
            { label: "Price vs EMA", value: aboveBelow },
            { label: "Deviation from EMA", value: `${formatNumber(deviation, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rsi-calculator", "fibonacci-retracement-calculator", "pivot-point-calculator"],
  faq: [
    { question: "What is a moving average?", answer: "A moving average smooths price data over a specified period to identify trends. The SMA gives equal weight to all prices, while the EMA gives more weight to recent prices, making it more responsive to new information." },
    { question: "What is the difference between SMA and EMA?", answer: "SMA calculates the arithmetic mean of prices over a period. EMA applies a weighting multiplier that gives more importance to recent prices, making it react faster to price changes." },
    { question: "Which moving average periods are most common?", answer: "Common SMA periods are 20, 50, 100, and 200. The 50-day and 200-day SMAs are widely watched; a golden cross (50 crosses above 200) is considered bullish, and a death cross is bearish." },
  ],
  formula: "SMA = Sum of Prices / Period; EMA = (Price - Previous EMA) x Multiplier + Previous EMA; Multiplier = 2 / (Period + 1)",
};
