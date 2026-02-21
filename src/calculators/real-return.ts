import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const realReturnCalculator: CalculatorDefinition = {
  slug: "real-return-calculator",
  title: "Real Return Calculator",
  description:
    "Free real return calculator. Calculate inflation-adjusted investment returns to understand the true purchasing power of your gains.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["real return", "inflation adjusted", "purchasing power", "nominal return", "inflation"],
  variants: [
    {
      id: "realReturn",
      name: "Inflation-Adjusted Return",
      fields: [
        { name: "nominalReturn", label: "Nominal Return (%)", type: "number", placeholder: "e.g. 10" },
        { name: "inflationRate", label: "Inflation Rate (%)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const nominalReturn = inputs.nominalReturn as number;
        const inflationRate = inputs.inflationRate as number;

        if (nominalReturn === undefined || nominalReturn === null || !inflationRate) return null;

        const nominal = nominalReturn / 100;
        const inflation = inflationRate / 100;

        // Fisher equation: (1 + real) = (1 + nominal) / (1 + inflation)
        const realReturn = ((1 + nominal) / (1 + inflation)) - 1;
        const realReturnPct = realReturn * 100;

        // Simple approximation
        const simpleApprox = nominalReturn - inflationRate;

        // Purchasing power example: $10,000 after 10 years
        const investment = 10000;
        const nominalFV = investment * Math.pow(1 + nominal, 10);
        const realFV = investment * Math.pow(1 + realReturn, 10);
        const purchasingPowerLoss = nominalFV - realFV;

        return {
          primary: { label: "Real Return", value: `${formatNumber(realReturnPct, 4)}%` },
          details: [
            { label: "Nominal Return", value: `${formatNumber(nominalReturn, 2)}%` },
            { label: "Inflation Rate", value: `${formatNumber(inflationRate, 2)}%` },
            { label: "Simple Approximation", value: `${formatNumber(simpleApprox, 2)}%` },
            { label: "$10K Nominal Value (10yr)", value: `$${formatNumber(nominalFV, 2)}` },
            { label: "$10K Real Value (10yr)", value: `$${formatNumber(realFV, 2)}` },
            { label: "Purchasing Power Lost (10yr)", value: `$${formatNumber(purchasingPowerLoss, 2)}` },
          ],
        };
      },
    },
    {
      id: "requiredNominal",
      name: "Required Nominal Return",
      fields: [
        { name: "targetRealReturn", label: "Target Real Return (%)", type: "number", placeholder: "e.g. 5" },
        { name: "inflationRate", label: "Expected Inflation (%)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const targetRealReturn = inputs.targetRealReturn as number;
        const inflationRate = inputs.inflationRate as number;

        if (targetRealReturn === undefined || targetRealReturn === null || !inflationRate) return null;

        const real = targetRealReturn / 100;
        const inflation = inflationRate / 100;

        // Required nominal = (1 + real)(1 + inflation) - 1
        const requiredNominal = ((1 + real) * (1 + inflation)) - 1;
        const requiredNominalPct = requiredNominal * 100;

        // To double purchasing power
        const doublingYears = Math.log(2) / Math.log(1 + real);

        // Investment example
        const investment = 10000;
        const realFV10 = investment * Math.pow(1 + real, 10);
        const nominalFV10 = investment * Math.pow(1 + requiredNominal, 10);

        return {
          primary: { label: "Required Nominal Return", value: `${formatNumber(requiredNominalPct, 4)}%` },
          details: [
            { label: "Target Real Return", value: `${formatNumber(targetRealReturn, 2)}%` },
            { label: "Expected Inflation", value: `${formatNumber(inflationRate, 2)}%` },
            { label: "Years to Double Purchasing Power", value: formatNumber(doublingYears, 1) },
            { label: "$10K Real Value (10yr)", value: `$${formatNumber(realFV10, 2)}` },
            { label: "$10K Nominal Value (10yr)", value: `$${formatNumber(nominalFV10, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["future-value-calculator", "present-value-calculator", "401k-calculator"],
  faq: [
    { question: "What is real return?", answer: "Real return is your investment return after adjusting for inflation. It represents the actual increase in your purchasing power, not just the nominal dollar growth." },
    { question: "Why is the Fisher equation more accurate?", answer: "The Fisher equation (Real = (1+Nominal)/(1+Inflation) - 1) accounts for the compounding interaction between nominal returns and inflation. The simple approximation (Nominal - Inflation) is close but slightly overestimates real returns, especially at higher rates." },
  ],
  formula: "Real Return = [(1 + Nominal Return) / (1 + Inflation Rate)] - 1 (Fisher Equation)",
};
