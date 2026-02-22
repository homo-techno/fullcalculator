import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const peRatioCalculator: CalculatorDefinition = {
  slug: "pe-ratio-calculator",
  title: "P/E Ratio Calculator",
  description: "Free P/E ratio calculator. Calculate price-to-earnings ratio, compare stock valuations, and estimate fair price from earnings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pe ratio", "price to earnings", "stock valuation", "earnings multiple", "PE ratio calculator"],
  variants: [
    {
      id: "basic",
      name: "P/E Ratio",
      description: "Calculate price-to-earnings ratio",
      fields: [
        { name: "stockPrice", label: "Stock Price", type: "number", prefix: "$", placeholder: "e.g. 150" },
        { name: "eps", label: "Earnings Per Share (EPS)", type: "number", prefix: "$", placeholder: "e.g. 6.50" },
      ],
      calculate: (inputs) => {
        const price = inputs.stockPrice as number;
        const eps = inputs.eps as number;
        if (!price || !eps) return null;
        const peRatio = price / eps;
        const earningsYield = (eps / price) * 100;
        return {
          primary: { label: "P/E Ratio", value: formatNumber(peRatio, 2) },
          details: [
            { label: "Earnings yield", value: `${formatNumber(earningsYield, 2)}%` },
            { label: "Interpretation", value: peRatio < 15 ? "Potentially undervalued" : peRatio > 25 ? "Potentially overvalued" : "Moderate valuation" },
          ],
        };
      },
    },
    {
      id: "fairPrice",
      name: "Fair Price from P/E",
      description: "Estimate fair stock price from target P/E and EPS",
      fields: [
        { name: "eps", label: "Earnings Per Share (EPS)", type: "number", prefix: "$", placeholder: "e.g. 6.50" },
        { name: "targetPE", label: "Target P/E Ratio", type: "number", placeholder: "e.g. 20" },
        { name: "currentPrice", label: "Current Stock Price (optional)", type: "number", prefix: "$", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const eps = inputs.eps as number;
        const targetPE = inputs.targetPE as number;
        const currentPrice = inputs.currentPrice as number;
        if (!eps || !targetPE) return null;
        const fairPrice = eps * targetPE;
        const details: { label: string; value: string }[] = [
          { label: "EPS", value: `$${formatNumber(eps, 2)}` },
          { label: "Target P/E", value: formatNumber(targetPE, 1) },
        ];
        if (currentPrice) {
          const upside = ((fairPrice - currentPrice) / currentPrice) * 100;
          details.push({ label: "Current price", value: `$${formatNumber(currentPrice, 2)}` });
          details.push({ label: "Upside/Downside", value: `${formatNumber(upside, 2)}%` });
        }
        return {
          primary: { label: "Fair Price", value: `$${formatNumber(fairPrice, 2)}` },
          details,
        };
      },
    },
    {
      id: "forwardPE",
      name: "Forward P/E",
      description: "Calculate forward P/E using estimated future earnings",
      fields: [
        { name: "stockPrice", label: "Current Stock Price", type: "number", prefix: "$", placeholder: "e.g. 150" },
        { name: "forwardEps", label: "Estimated Forward EPS", type: "number", prefix: "$", placeholder: "e.g. 7.00" },
      ],
      calculate: (inputs) => {
        const price = inputs.stockPrice as number;
        const forwardEps = inputs.forwardEps as number;
        if (!price || !forwardEps) return null;
        const forwardPE = price / forwardEps;
        return {
          primary: { label: "Forward P/E", value: formatNumber(forwardPE, 2) },
          details: [
            { label: "Forward earnings yield", value: `${formatNumber((forwardEps / price) * 100, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["eps-calculator", "earnings-yield-calculator", "price-to-book-calculator"],
  faq: [
    { question: "What is the P/E ratio?", answer: "The Price-to-Earnings (P/E) ratio measures a stock's price relative to its earnings per share. A P/E of 20 means investors pay $20 for every $1 of earnings. It is one of the most widely used valuation metrics." },
    { question: "What is a good P/E ratio?", answer: "There is no universal 'good' P/E ratio. It varies by industry, growth rate, and market conditions. Growth stocks typically have higher P/E ratios (25-50+), while value stocks may have lower ones (5-15). Always compare within the same industry." },
    { question: "What is the difference between trailing and forward P/E?", answer: "Trailing P/E uses the last 12 months of actual earnings, while forward P/E uses estimated future earnings. Forward P/E is often preferred for growing companies but depends on the accuracy of analyst estimates." },
  ],
  formula: "P/E Ratio = Stock Price / Earnings Per Share (EPS)",
};
