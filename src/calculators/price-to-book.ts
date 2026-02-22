import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const priceToBookCalculator: CalculatorDefinition = {
  slug: "price-to-book-calculator",
  title: "Price-to-Book Ratio Calculator",
  description: "Free price-to-book (P/B) ratio calculator. Compare a stock's market value to its book value for value investing analysis.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["price to book", "P/B ratio", "book value", "value investing", "stock valuation", "PB ratio"],
  variants: [
    {
      id: "fromPrice",
      name: "P/B from Stock Price",
      description: "Calculate P/B ratio from price and book value per share",
      fields: [
        { name: "stockPrice", label: "Stock Price", type: "number", prefix: "$", placeholder: "e.g. 50" },
        { name: "bookValuePerShare", label: "Book Value Per Share", type: "number", prefix: "$", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const price = inputs.stockPrice as number;
        const bvps = inputs.bookValuePerShare as number;
        if (!price || !bvps) return null;
        const pbRatio = price / bvps;
        return {
          primary: { label: "P/B Ratio", value: formatNumber(pbRatio, 2) },
          details: [
            { label: "Stock price", value: `$${formatNumber(price, 2)}` },
            { label: "Book value per share", value: `$${formatNumber(bvps, 2)}` },
            { label: "Premium/Discount to book", value: `${formatNumber((pbRatio - 1) * 100, 1)}%` },
            { label: "Interpretation", value: pbRatio < 1 ? "Trading below book value" : pbRatio < 3 ? "Moderate valuation" : "Trading at premium" },
          ],
        };
      },
    },
    {
      id: "fromTotals",
      name: "P/B from Total Values",
      description: "Calculate P/B from market cap and total book value",
      fields: [
        { name: "marketCap", label: "Market Capitalization", type: "number", prefix: "$", placeholder: "e.g. 50000000000" },
        { name: "totalAssets", label: "Total Assets", type: "number", prefix: "$", placeholder: "e.g. 80000000000" },
        { name: "totalLiabilities", label: "Total Liabilities", type: "number", prefix: "$", placeholder: "e.g. 50000000000" },
      ],
      calculate: (inputs) => {
        const mc = inputs.marketCap as number;
        const assets = inputs.totalAssets as number;
        const liabilities = inputs.totalLiabilities as number;
        if (!mc || !assets || liabilities === undefined) return null;
        const bookValue = assets - liabilities;
        if (bookValue <= 0) return { primary: { label: "P/B Ratio", value: "N/A (negative book value)" }, details: [] };
        const pbRatio = mc / bookValue;
        return {
          primary: { label: "P/B Ratio", value: formatNumber(pbRatio, 2) },
          details: [
            { label: "Total book value", value: `$${formatNumber(bookValue)}` },
            { label: "Market cap", value: `$${formatNumber(mc)}` },
            { label: "Market premium", value: `$${formatNumber(mc - bookValue)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pe-ratio-calculator", "market-cap-calculator", "intrinsic-value-calculator"],
  faq: [
    { question: "What is the price-to-book ratio?", answer: "The P/B ratio compares a stock's market price to its book value per share. A P/B of 2 means the market values the company at twice its accounting (book) value. It is commonly used in value investing." },
    { question: "What does a P/B ratio below 1 mean?", answer: "A P/B below 1 means the stock is trading below its book value, which could indicate the stock is undervalued, or that the market believes the company's assets are overvalued on its balance sheet." },
    { question: "When is P/B most useful?", answer: "P/B is most useful for asset-heavy companies like banks, insurance firms, and real estate companies. It is less meaningful for tech or service companies where intangible assets and intellectual property drive value." },
  ],
  formula: "P/B Ratio = Market Price Per Share / Book Value Per Share | Book Value = Total Assets - Total Liabilities",
};
