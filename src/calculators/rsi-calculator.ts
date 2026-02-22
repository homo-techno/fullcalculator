import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rsiCalculator: CalculatorDefinition = {
  slug: "rsi-calculator",
  title: "RSI Calculator",
  description:
    "Free RSI (Relative Strength Index) calculator. Calculate the RSI indicator from average gains and losses to identify overbought or oversold conditions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["RSI", "relative strength index", "overbought", "oversold", "technical analysis", "momentum", "indicator"],
  variants: [
    {
      id: "rsiFromAvg",
      name: "RSI from Average Gains/Losses",
      fields: [
        { name: "avgGain", label: "Average Gain (over period)", type: "number", placeholder: "e.g. 1.5", step: 0.01 },
        { name: "avgLoss", label: "Average Loss (over period)", type: "number", placeholder: "e.g. 0.8", step: 0.01 },
        { name: "period", label: "RSI Period", type: "number", placeholder: "e.g. 14", defaultValue: 14 },
      ],
      calculate: (inputs) => {
        const avgGain = inputs.avgGain as number;
        const avgLoss = inputs.avgLoss as number;
        const period = inputs.period as number;

        if (!avgGain || !avgLoss || !period) return null;

        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);

        let signal: string;
        if (rsi >= 70) signal = "Overbought";
        else if (rsi <= 30) signal = "Oversold";
        else signal = "Neutral";

        return {
          primary: { label: "RSI", value: formatNumber(rsi, 2) },
          details: [
            { label: "Signal", value: signal },
            { label: "Relative Strength (RS)", value: formatNumber(rs, 4) },
            { label: "Average Gain", value: formatNumber(avgGain, 4) },
            { label: "Average Loss", value: formatNumber(avgLoss, 4) },
            { label: "Period", value: formatNumber(period, 0) },
          ],
        };
      },
    },
    {
      id: "rsiSmoothed",
      name: "Smoothed RSI Update",
      fields: [
        { name: "prevAvgGain", label: "Previous Avg Gain", type: "number", placeholder: "e.g. 1.5", step: 0.01 },
        { name: "prevAvgLoss", label: "Previous Avg Loss", type: "number", placeholder: "e.g. 0.8", step: 0.01 },
        { name: "currentGain", label: "Current Period Gain", type: "number", placeholder: "e.g. 2.0", step: 0.01, defaultValue: 0 },
        { name: "currentLoss", label: "Current Period Loss", type: "number", placeholder: "e.g. 0", step: 0.01, defaultValue: 0 },
        { name: "period", label: "RSI Period", type: "number", placeholder: "e.g. 14", defaultValue: 14 },
      ],
      calculate: (inputs) => {
        const prevAvgGain = inputs.prevAvgGain as number;
        const prevAvgLoss = inputs.prevAvgLoss as number;
        const currentGain = (inputs.currentGain as number) || 0;
        const currentLoss = (inputs.currentLoss as number) || 0;
        const period = inputs.period as number;

        if (!prevAvgGain || !prevAvgLoss || !period) return null;

        const smoothedAvgGain = (prevAvgGain * (period - 1) + currentGain) / period;
        const smoothedAvgLoss = (prevAvgLoss * (period - 1) + currentLoss) / period;
        const rs = smoothedAvgGain / smoothedAvgLoss;
        const rsi = 100 - 100 / (1 + rs);

        let signal: string;
        if (rsi >= 70) signal = "Overbought";
        else if (rsi <= 30) signal = "Oversold";
        else signal = "Neutral";

        return {
          primary: { label: "Updated RSI", value: formatNumber(rsi, 2) },
          details: [
            { label: "Signal", value: signal },
            { label: "Smoothed Avg Gain", value: formatNumber(smoothedAvgGain, 4) },
            { label: "Smoothed Avg Loss", value: formatNumber(smoothedAvgLoss, 4) },
            { label: "RS", value: formatNumber(rs, 4) },
            { label: "Period", value: formatNumber(period, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["moving-average-calculator", "fibonacci-retracement-calculator", "pivot-point-calculator"],
  faq: [
    { question: "What is RSI?", answer: "The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of price changes on a scale of 0 to 100. It was developed by J. Welles Wilder Jr." },
    { question: "How do I interpret RSI values?", answer: "RSI above 70 is generally considered overbought (potential sell signal). RSI below 30 is considered oversold (potential buy signal). These thresholds can be adjusted based on market conditions." },
    { question: "What period should I use for RSI?", answer: "The default and most common period is 14. Shorter periods (e.g., 7) make RSI more sensitive, while longer periods (e.g., 21) make it smoother with fewer signals." },
  ],
  formula: "RS = Average Gain / Average Loss; RSI = 100 - 100 / (1 + RS)",
};
