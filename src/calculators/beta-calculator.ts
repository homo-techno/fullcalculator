import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const betaCalculator: CalculatorDefinition = {
  slug: "beta-calculator",
  title: "Stock Beta Calculator",
  description: "Free stock beta calculator. Calculate a stock's beta coefficient to measure its systematic risk relative to the market.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stock beta", "beta coefficient", "systematic risk", "market risk", "volatility", "beta calculator"],
  variants: [
    {
      id: "fromCovariance",
      name: "Beta from Covariance",
      description: "Calculate beta using covariance and variance",
      fields: [
        { name: "covarianceStockMarket", label: "Covariance (Stock, Market)", type: "number", placeholder: "e.g. 0.0025", step: 0.0001 },
        { name: "varianceMarket", label: "Variance of Market Returns", type: "number", placeholder: "e.g. 0.0020", step: 0.0001 },
      ],
      calculate: (inputs) => {
        const cov = inputs.covarianceStockMarket as number;
        const varM = inputs.varianceMarket as number;
        if (cov === undefined || !varM) return null;
        const beta = cov / varM;
        let riskLevel = "Defensive";
        if (beta > 1.5) riskLevel = "Very Aggressive";
        else if (beta > 1) riskLevel = "Aggressive";
        else if (beta === 1) riskLevel = "Market-level";
        return {
          primary: { label: "Beta", value: formatNumber(beta, 4) },
          details: [
            { label: "Risk classification", value: riskLevel },
            { label: "Covariance", value: formatNumber(cov, 6) },
            { label: "Market variance", value: formatNumber(varM, 6) },
          ],
        };
      },
    },
    {
      id: "fromCorrelation",
      name: "Beta from Correlation",
      description: "Calculate beta using correlation and standard deviations",
      fields: [
        { name: "correlation", label: "Correlation (Stock, Market)", type: "number", placeholder: "e.g. 0.75", step: 0.01, min: -1, max: 1 },
        { name: "stdDevStock", label: "Stock Std Deviation (%)", type: "number", placeholder: "e.g. 25", suffix: "%" },
        { name: "stdDevMarket", label: "Market Std Deviation (%)", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const corr = inputs.correlation as number;
        const sigmaS = inputs.stdDevStock as number;
        const sigmaM = inputs.stdDevMarket as number;
        if (corr === undefined || !sigmaS || !sigmaM) return null;
        const beta = corr * (sigmaS / sigmaM);
        return {
          primary: { label: "Beta", value: formatNumber(beta, 4) },
          details: [
            { label: "Correlation", value: formatNumber(corr, 4) },
            { label: "Stock volatility", value: `${formatNumber(sigmaS, 2)}%` },
            { label: "Market volatility", value: `${formatNumber(sigmaM, 2)}%` },
            { label: "Relative volatility", value: `${formatNumber(sigmaS / sigmaM, 2)}x` },
          ],
        };
      },
    },
    {
      id: "leveredUnlevered",
      name: "Levered / Unlevered Beta",
      description: "Convert between levered and unlevered beta",
      fields: [
        { name: "direction", label: "Convert", type: "select", options: [{ label: "Unlevered to Levered", value: "lever" }, { label: "Levered to Unlevered", value: "unlever" }] },
        { name: "beta", label: "Input Beta", type: "number", placeholder: "e.g. 1.2", step: 0.01 },
        { name: "debtEquity", label: "Debt-to-Equity Ratio", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
        { name: "taxRate", label: "Tax Rate (%)", type: "number", placeholder: "e.g. 21", suffix: "%" },
      ],
      calculate: (inputs) => {
        const direction = inputs.direction as string;
        const beta = inputs.beta as number;
        const de = inputs.debtEquity as number;
        const tc = (inputs.taxRate as number) / 100;
        if (!beta || de === undefined || tc === undefined) return null;
        if (direction === "lever") {
          const leveredBeta = beta * (1 + (1 - tc) * de);
          return {
            primary: { label: "Levered Beta", value: formatNumber(leveredBeta, 4) },
            details: [
              { label: "Unlevered (asset) beta", value: formatNumber(beta, 4) },
              { label: "D/E ratio", value: formatNumber(de, 2) },
              { label: "Tax rate", value: `${formatNumber(tc * 100, 1)}%` },
            ],
          };
        } else {
          const unleveredBeta = beta / (1 + (1 - tc) * de);
          return {
            primary: { label: "Unlevered Beta", value: formatNumber(unleveredBeta, 4) },
            details: [
              { label: "Levered (equity) beta", value: formatNumber(beta, 4) },
              { label: "D/E ratio", value: formatNumber(de, 2) },
              { label: "Tax rate", value: `${formatNumber(tc * 100, 1)}%` },
            ],
          };
        }
      },
    },
  ],
  relatedSlugs: ["capm-calculator", "sharpe-ratio-calculator", "risk-reward-calculator"],
  faq: [
    { question: "What is stock beta?", answer: "Beta measures a stock's sensitivity to market movements. A beta of 1 means the stock moves with the market, above 1 means it's more volatile, and below 1 means it's less volatile. Negative beta (rare) means the stock moves opposite to the market." },
    { question: "What is the difference between levered and unlevered beta?", answer: "Levered beta includes the effect of a company's debt (financial risk), while unlevered beta isolates pure business risk by removing the impact of leverage. Unlevered beta is used to compare companies with different capital structures." },
    { question: "How is beta used in investing?", answer: "Beta is used in the CAPM to calculate expected return, in portfolio construction to manage risk, and in valuation to determine appropriate discount rates. Defensive investors prefer low-beta stocks while aggressive investors may seek high-beta stocks." },
  ],
  formula: "Beta = Cov(Ri, Rm) / Var(Rm) | Beta = Correlation * (sigma_stock / sigma_market) | Levered Beta = Unlevered Beta * (1 + (1-Tc)*D/E)",
};
