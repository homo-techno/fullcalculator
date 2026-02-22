import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fibonacciRetracementCalculator: CalculatorDefinition = {
  slug: "fibonacci-retracement-calculator",
  title: "Fibonacci Retracement Levels Calculator",
  description:
    "Free Fibonacci retracement calculator. Calculate key Fibonacci levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) for support and resistance in trading.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fibonacci", "retracement", "support", "resistance", "technical analysis", "trading", "levels"],
  variants: [
    {
      id: "uptrend",
      name: "Uptrend Retracement",
      fields: [
        { name: "swingLow", label: "Swing Low ($)", type: "number", placeholder: "e.g. 100" },
        { name: "swingHigh", label: "Swing High ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const low = inputs.swingLow as number;
        const high = inputs.swingHigh as number;

        if (low === undefined || high === undefined || low >= high) return null;

        const diff = high - low;
        const level236 = high - diff * 0.236;
        const level382 = high - diff * 0.382;
        const level500 = high - diff * 0.5;
        const level618 = high - diff * 0.618;
        const level786 = high - diff * 0.786;

        return {
          primary: { label: "61.8% Level (Golden Ratio)", value: `$${formatNumber(level618, 4)}` },
          details: [
            { label: "23.6% Level", value: `$${formatNumber(level236, 4)}` },
            { label: "38.2% Level", value: `$${formatNumber(level382, 4)}` },
            { label: "50.0% Level", value: `$${formatNumber(level500, 4)}` },
            { label: "61.8% Level", value: `$${formatNumber(level618, 4)}` },
            { label: "78.6% Level", value: `$${formatNumber(level786, 4)}` },
            { label: "Price Range", value: `$${formatNumber(diff, 4)}` },
          ],
        };
      },
    },
    {
      id: "downtrend",
      name: "Downtrend Retracement",
      fields: [
        { name: "swingHigh", label: "Swing High ($)", type: "number", placeholder: "e.g. 200" },
        { name: "swingLow", label: "Swing Low ($)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const high = inputs.swingHigh as number;
        const low = inputs.swingLow as number;

        if (low === undefined || high === undefined || low >= high) return null;

        const diff = high - low;
        const level236 = low + diff * 0.236;
        const level382 = low + diff * 0.382;
        const level500 = low + diff * 0.5;
        const level618 = low + diff * 0.618;
        const level786 = low + diff * 0.786;

        return {
          primary: { label: "61.8% Level (Golden Ratio)", value: `$${formatNumber(level618, 4)}` },
          details: [
            { label: "23.6% Level", value: `$${formatNumber(level236, 4)}` },
            { label: "38.2% Level", value: `$${formatNumber(level382, 4)}` },
            { label: "50.0% Level", value: `$${formatNumber(level500, 4)}` },
            { label: "61.8% Level", value: `$${formatNumber(level618, 4)}` },
            { label: "78.6% Level", value: `$${formatNumber(level786, 4)}` },
            { label: "Price Range", value: `$${formatNumber(diff, 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pivot-point-calculator", "moving-average-calculator", "rsi-calculator"],
  faq: [
    { question: "What are Fibonacci retracement levels?", answer: "Fibonacci retracement levels are horizontal lines based on the Fibonacci sequence that indicate potential support and resistance levels. The key ratios are 23.6%, 38.2%, 50%, 61.8%, and 78.6%." },
    { question: "How do I use Fibonacci levels?", answer: "In an uptrend, draw from the swing low to the swing high. The retracement levels show potential support areas where price might bounce. In a downtrend, draw from swing high to swing low for resistance levels." },
    { question: "Why is 61.8% important?", answer: "The 61.8% level is known as the Golden Ratio and is considered the most significant Fibonacci level. Price often finds strong support or resistance at this level." },
  ],
  formula: "Uptrend Level = High - (High - Low) x Ratio; Downtrend Level = Low + (High - Low) x Ratio",
};
