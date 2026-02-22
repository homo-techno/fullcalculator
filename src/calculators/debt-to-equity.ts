import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const debtToEquityCalculator: CalculatorDefinition = {
  slug: "debt-to-equity-calculator",
  title: "Debt-to-Equity Ratio Calculator",
  description: "Free debt-to-equity ratio calculator. Analyze a company's financial leverage and compare it against industry benchmarks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt to equity", "D/E ratio", "leverage ratio", "financial leverage", "solvency ratio"],
  variants: [
    {
      id: "basic",
      name: "Debt-to-Equity Ratio",
      description: "Calculate D/E ratio from balance sheet data",
      fields: [
        { name: "totalDebt", label: "Total Liabilities (Debt)", type: "number", prefix: "$", placeholder: "e.g. 5000000" },
        { name: "totalEquity", label: "Total Shareholders' Equity", type: "number", prefix: "$", placeholder: "e.g. 10000000" },
      ],
      calculate: (inputs) => {
        const debt = inputs.totalDebt as number;
        const equity = inputs.totalEquity as number;
        if (!debt || !equity) return null;
        const deRatio = debt / equity;
        const debtPercent = (debt / (debt + equity)) * 100;
        const equityPercent = (equity / (debt + equity)) * 100;
        return {
          primary: { label: "Debt-to-Equity Ratio", value: formatNumber(deRatio, 2) },
          details: [
            { label: "Debt as % of capital", value: `${formatNumber(debtPercent, 1)}%` },
            { label: "Equity as % of capital", value: `${formatNumber(equityPercent, 1)}%` },
            { label: "Leverage assessment", value: deRatio < 1 ? "Conservative" : deRatio < 2 ? "Moderate" : "Highly leveraged" },
            { label: "Total capital", value: `$${formatNumber(debt + equity)}` },
          ],
        };
      },
    },
    {
      id: "longTermOnly",
      name: "Long-Term D/E Ratio",
      description: "Calculate D/E using only long-term debt",
      fields: [
        { name: "longTermDebt", label: "Long-Term Debt", type: "number", prefix: "$", placeholder: "e.g. 3000000" },
        { name: "totalEquity", label: "Total Shareholders' Equity", type: "number", prefix: "$", placeholder: "e.g. 10000000" },
      ],
      calculate: (inputs) => {
        const ltDebt = inputs.longTermDebt as number;
        const equity = inputs.totalEquity as number;
        if (!ltDebt || !equity) return null;
        const ratio = ltDebt / equity;
        return {
          primary: { label: "Long-Term D/E Ratio", value: formatNumber(ratio, 2) },
          details: [
            { label: "Long-term debt", value: `$${formatNumber(ltDebt)}` },
            { label: "Equity", value: `$${formatNumber(equity)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["enterprise-value-calculator", "wacc-calculator", "market-cap-calculator"],
  faq: [
    { question: "What is the debt-to-equity ratio?", answer: "The debt-to-equity (D/E) ratio measures how much debt a company uses to finance its operations relative to shareholders' equity. A ratio of 1.5 means the company has $1.50 of debt for every $1 of equity." },
    { question: "What is a good debt-to-equity ratio?", answer: "A D/E ratio below 1.0 is generally considered conservative. However, optimal leverage varies by industry. Capital-intensive industries like utilities often have higher D/E ratios (1.5-2.0), while tech companies may have lower ones." },
    { question: "Why does leverage matter?", answer: "Higher leverage amplifies both gains and losses. While debt can improve returns through the tax shield and leverage effect, excessive debt increases bankruptcy risk and financial distress costs." },
  ],
  formula: "D/E Ratio = Total Liabilities / Shareholders' Equity",
};
