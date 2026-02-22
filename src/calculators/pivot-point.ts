import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pivotPointCalculator: CalculatorDefinition = {
  slug: "pivot-point-calculator",
  title: "Pivot Point Calculator",
  description:
    "Free pivot point calculator. Calculate standard, Fibonacci, Woodie, and Camarilla pivot points with support and resistance levels for day trading.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pivot point", "support", "resistance", "day trading", "technical analysis", "S1", "R1"],
  variants: [
    {
      id: "standard",
      name: "Standard Pivot Points",
      fields: [
        { name: "high", label: "Previous High ($)", type: "number", placeholder: "e.g. 150" },
        { name: "low", label: "Previous Low ($)", type: "number", placeholder: "e.g. 140" },
        { name: "close", label: "Previous Close ($)", type: "number", placeholder: "e.g. 147" },
      ],
      calculate: (inputs) => {
        const high = inputs.high as number;
        const low = inputs.low as number;
        const close = inputs.close as number;

        if (!high || !low || !close) return null;

        const pp = (high + low + close) / 3;
        const s1 = 2 * pp - high;
        const s2 = pp - (high - low);
        const s3 = low - 2 * (high - pp);
        const r1 = 2 * pp - low;
        const r2 = pp + (high - low);
        const r3 = high + 2 * (pp - low);

        return {
          primary: { label: "Pivot Point (PP)", value: `$${formatNumber(pp, 4)}` },
          details: [
            { label: "Resistance 3 (R3)", value: `$${formatNumber(r3, 4)}` },
            { label: "Resistance 2 (R2)", value: `$${formatNumber(r2, 4)}` },
            { label: "Resistance 1 (R1)", value: `$${formatNumber(r1, 4)}` },
            { label: "Support 1 (S1)", value: `$${formatNumber(s1, 4)}` },
            { label: "Support 2 (S2)", value: `$${formatNumber(s2, 4)}` },
            { label: "Support 3 (S3)", value: `$${formatNumber(s3, 4)}` },
          ],
        };
      },
    },
    {
      id: "fibonacci",
      name: "Fibonacci Pivot Points",
      fields: [
        { name: "high", label: "Previous High ($)", type: "number", placeholder: "e.g. 150" },
        { name: "low", label: "Previous Low ($)", type: "number", placeholder: "e.g. 140" },
        { name: "close", label: "Previous Close ($)", type: "number", placeholder: "e.g. 147" },
      ],
      calculate: (inputs) => {
        const high = inputs.high as number;
        const low = inputs.low as number;
        const close = inputs.close as number;

        if (!high || !low || !close) return null;

        const pp = (high + low + close) / 3;
        const range = high - low;
        const s1 = pp - 0.382 * range;
        const s2 = pp - 0.618 * range;
        const s3 = pp - 1.0 * range;
        const r1 = pp + 0.382 * range;
        const r2 = pp + 0.618 * range;
        const r3 = pp + 1.0 * range;

        return {
          primary: { label: "Pivot Point (PP)", value: `$${formatNumber(pp, 4)}` },
          details: [
            { label: "R3 (100%)", value: `$${formatNumber(r3, 4)}` },
            { label: "R2 (61.8%)", value: `$${formatNumber(r2, 4)}` },
            { label: "R1 (38.2%)", value: `$${formatNumber(r1, 4)}` },
            { label: "S1 (38.2%)", value: `$${formatNumber(s1, 4)}` },
            { label: "S2 (61.8%)", value: `$${formatNumber(s2, 4)}` },
            { label: "S3 (100%)", value: `$${formatNumber(s3, 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fibonacci-retracement-calculator", "moving-average-calculator", "rsi-calculator"],
  faq: [
    { question: "What are pivot points?", answer: "Pivot points are technical analysis indicators used to determine potential support and resistance levels. They are calculated using the previous period's high, low, and close prices." },
    { question: "How are standard pivot points calculated?", answer: "The pivot point (PP) = (High + Low + Close) / 3. Support and resistance levels are calculated from this pivot: R1 = 2*PP - Low, S1 = 2*PP - High, etc." },
    { question: "Which pivot point method is best?", answer: "Standard pivot points are most widely used. Fibonacci pivots are preferred by traders who use Fibonacci analysis. The best method depends on the market and your trading style." },
  ],
  formula: "PP = (High + Low + Close) / 3; R1 = 2*PP - Low; S1 = 2*PP - High; R2 = PP + (High - Low); S2 = PP - (High - Low)",
};
