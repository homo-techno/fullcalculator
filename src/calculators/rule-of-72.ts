import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ruleOf72Calculator: CalculatorDefinition = {
  slug: "rule-of-72-calculator",
  title: "Rule of 72 Calculator",
  description: "Free Rule of 72 calculator. Quickly estimate how long it takes to double your money at a given interest rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rule of 72", "doubling time", "double money calculator", "investment doubling", "rule of 72 calculator"],
  variants: [
    {
      id: "timeToDouble",
      name: "Time to Double",
      fields: [
        { name: "rate", label: "Annual Interest Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 8" },
        { name: "amount", label: "Starting Amount (optional)", type: "number", prefix: "$", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const rate = inputs.rate as number;
        const amount = (inputs.amount as number) || 10000;
        if (!rate) return null;
        const rule72 = 72 / rate;
        const exact = Math.log(2) / Math.log(1 + rate / 100);
        return {
          primary: { label: "Years to Double", value: `≈ ${formatNumber(rule72, 1)} years` },
          details: [
            { label: "Rule of 72 estimate", value: `${formatNumber(rule72, 1)} years` },
            { label: "Exact (compound)", value: `${formatNumber(exact, 2)} years` },
            { label: "Starting amount", value: `$${formatNumber(amount, 2)}` },
            { label: "Doubled amount", value: `$${formatNumber(amount * 2, 2)}` },
            { label: "Time to 4×", value: `≈ ${formatNumber(rule72 * 2, 1)} years` },
            { label: "Time to 8×", value: `≈ ${formatNumber(rule72 * 3, 1)} years` },
          ],
        };
      },
    },
    {
      id: "rateNeeded",
      name: "Rate Needed to Double",
      fields: [
        { name: "years", label: "Years to Double", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const years = inputs.years as number;
        if (!years) return null;
        const rule72Rate = 72 / years;
        const exactRate = (Math.pow(2, 1 / years) - 1) * 100;
        return {
          primary: { label: "Rate Needed", value: `≈ ${formatNumber(rule72Rate, 2)}%` },
          details: [
            { label: "Rule of 72 estimate", value: `${formatNumber(rule72Rate, 2)}%` },
            { label: "Exact rate", value: `${formatNumber(exactRate, 4)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "cagr-calculator", "investment-calculator"],
  faq: [{ question: "What is the Rule of 72?", answer: "The Rule of 72 is a quick way to estimate how long it takes to double your money: Years = 72 / Interest Rate. At 8% return, money doubles in ~9 years. At 6%, ~12 years. It's most accurate for rates between 6-10%." }],
  formula: "Years to double ≈ 72 / Rate%",
};
