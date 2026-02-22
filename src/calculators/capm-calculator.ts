import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capmCalculator: CalculatorDefinition = {
  slug: "capm-calculator",
  title: "CAPM Calculator",
  description: "Free CAPM (Capital Asset Pricing Model) calculator. Calculate expected return on an investment based on its systematic risk.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["capm", "capital asset pricing model", "expected return", "beta", "risk premium", "systematic risk"],
  variants: [
    {
      id: "expectedReturn",
      name: "Expected Return",
      description: "Calculate expected return using CAPM",
      fields: [
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 4.5", suffix: "%" },
        { name: "beta", label: "Beta", type: "number", placeholder: "e.g. 1.2", step: 0.01 },
        { name: "marketReturn", label: "Expected Market Return (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
      ],
      calculate: (inputs) => {
        const rf = inputs.riskFreeRate as number;
        const beta = inputs.beta as number;
        const rm = inputs.marketReturn as number;
        if (rf === undefined || !beta || rm === undefined) return null;
        const marketPremium = rm - rf;
        const expectedReturn = rf + beta * marketPremium;
        return {
          primary: { label: "Expected Return", value: `${formatNumber(expectedReturn, 2)}%` },
          details: [
            { label: "Risk-free rate", value: `${formatNumber(rf, 2)}%` },
            { label: "Market risk premium", value: `${formatNumber(marketPremium, 2)}%` },
            { label: "Beta", value: formatNumber(beta, 2) },
            { label: "Risk premium (beta x MRP)", value: `${formatNumber(beta * marketPremium, 2)}%` },
          ],
        };
      },
    },
    {
      id: "solveBeta",
      name: "Solve for Beta",
      description: "Calculate beta from expected return",
      fields: [
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 4.5", suffix: "%" },
        { name: "expectedReturn", label: "Expected Return (%)", type: "number", placeholder: "e.g. 12", suffix: "%" },
        { name: "marketReturn", label: "Expected Market Return (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
      ],
      calculate: (inputs) => {
        const rf = inputs.riskFreeRate as number;
        const er = inputs.expectedReturn as number;
        const rm = inputs.marketReturn as number;
        if (rf === undefined || er === undefined || rm === undefined) return null;
        const marketPremium = rm - rf;
        if (marketPremium === 0) return null;
        const beta = (er - rf) / marketPremium;
        return {
          primary: { label: "Beta", value: formatNumber(beta, 4) },
          details: [
            { label: "Market risk premium", value: `${formatNumber(marketPremium, 2)}%` },
            { label: "Excess return", value: `${formatNumber(er - rf, 2)}%` },
            { label: "Risk level", value: beta > 1 ? "Higher than market" : beta < 1 ? "Lower than market" : "Equal to market" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beta-calculator", "sharpe-ratio-calculator", "cost-of-equity-calculator"],
  faq: [
    { question: "What is CAPM?", answer: "The Capital Asset Pricing Model (CAPM) describes the relationship between systematic risk and expected return for an asset. It states that an investment's expected return equals the risk-free rate plus a risk premium based on its beta." },
    { question: "What is beta in CAPM?", answer: "Beta measures the sensitivity of an asset's returns to market returns. A beta of 1 means the asset moves with the market, above 1 means it's more volatile, and below 1 means it's less volatile than the market." },
    { question: "What is market risk premium?", answer: "The market risk premium is the difference between the expected market return and the risk-free rate. It represents the additional return investors demand for bearing market risk instead of holding risk-free assets." },
  ],
  formula: "E(Ri) = Rf + Bi * (E(Rm) - Rf)",
};
