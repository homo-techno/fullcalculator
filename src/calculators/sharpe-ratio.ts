import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sharpeRatioCalculator: CalculatorDefinition = {
  slug: "sharpe-ratio-calculator",
  title: "Sharpe Ratio Calculator",
  description: "Free Sharpe ratio calculator. Measure risk-adjusted returns of investments and portfolios to compare performance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sharpe ratio", "risk adjusted return", "portfolio performance", "risk reward", "investment analysis"],
  variants: [
    {
      id: "basic",
      name: "Sharpe Ratio",
      description: "Calculate the Sharpe ratio of an investment",
      fields: [
        { name: "portfolioReturn", label: "Portfolio Return (%)", type: "number", placeholder: "e.g. 12", suffix: "%" },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 4", suffix: "%" },
        { name: "stdDev", label: "Standard Deviation (%)", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const rp = inputs.portfolioReturn as number;
        const rf = inputs.riskFreeRate as number;
        const sigma = inputs.stdDev as number;
        if (rp === undefined || rf === undefined || !sigma) return null;
        const sharpe = (rp - rf) / sigma;
        let rating = "Poor";
        if (sharpe >= 3) rating = "Excellent";
        else if (sharpe >= 2) rating = "Very Good";
        else if (sharpe >= 1) rating = "Good";
        else if (sharpe >= 0.5) rating = "Adequate";
        return {
          primary: { label: "Sharpe Ratio", value: formatNumber(sharpe, 4) },
          details: [
            { label: "Excess return", value: `${formatNumber(rp - rf, 2)}%` },
            { label: "Risk (std deviation)", value: `${formatNumber(sigma, 2)}%` },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Two Investments",
      description: "Compare Sharpe ratios of two investments",
      fields: [
        { name: "return1", label: "Investment A Return (%)", type: "number", placeholder: "e.g. 12", suffix: "%" },
        { name: "stdDev1", label: "Investment A Std Dev (%)", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "return2", label: "Investment B Return (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
        { name: "stdDev2", label: "Investment B Std Dev (%)", type: "number", placeholder: "e.g. 8", suffix: "%" },
        { name: "riskFreeRate", label: "Risk-Free Rate (%)", type: "number", placeholder: "e.g. 4", suffix: "%" },
      ],
      calculate: (inputs) => {
        const r1 = inputs.return1 as number;
        const s1 = inputs.stdDev1 as number;
        const r2 = inputs.return2 as number;
        const s2 = inputs.stdDev2 as number;
        const rf = inputs.riskFreeRate as number;
        if (r1 === undefined || !s1 || r2 === undefined || !s2 || rf === undefined) return null;
        const sharpe1 = (r1 - rf) / s1;
        const sharpe2 = (r2 - rf) / s2;
        const better = sharpe1 > sharpe2 ? "Investment A" : sharpe2 > sharpe1 ? "Investment B" : "Equal";
        return {
          primary: { label: "Better Risk-Adjusted Return", value: better },
          details: [
            { label: "Sharpe Ratio A", value: formatNumber(sharpe1, 4) },
            { label: "Sharpe Ratio B", value: formatNumber(sharpe2, 4) },
            { label: "Difference", value: formatNumber(Math.abs(sharpe1 - sharpe2), 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beta-calculator", "capm-calculator", "risk-reward-calculator"],
  faq: [
    { question: "What is the Sharpe ratio?", answer: "The Sharpe ratio measures the excess return per unit of risk (standard deviation). A higher Sharpe ratio indicates better risk-adjusted performance. It was developed by Nobel laureate William Sharpe." },
    { question: "What is a good Sharpe ratio?", answer: "Generally, a Sharpe ratio above 1.0 is good, above 2.0 is very good, and above 3.0 is excellent. A negative Sharpe ratio means the investment returned less than the risk-free rate." },
    { question: "What are the limitations of the Sharpe ratio?", answer: "The Sharpe ratio assumes returns are normally distributed and uses standard deviation as the only risk measure. It does not distinguish between upside and downside volatility and may be misleading for investments with non-normal return distributions." },
  ],
  formula: "Sharpe Ratio = (Rp - Rf) / sigma_p",
};
