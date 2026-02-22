import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marketCapCalculator: CalculatorDefinition = {
  slug: "market-cap-calculator",
  title: "Market Capitalization Calculator",
  description: "Free market cap calculator. Calculate market capitalization, determine company size classification, and compare valuations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["market cap", "market capitalization", "company valuation", "stock market cap", "market cap calculator"],
  variants: [
    {
      id: "basic",
      name: "Market Cap",
      description: "Calculate market capitalization",
      fields: [
        { name: "sharePrice", label: "Current Share Price", type: "number", prefix: "$", placeholder: "e.g. 150" },
        { name: "sharesOutstanding", label: "Total Shares Outstanding", type: "number", placeholder: "e.g. 1500000000" },
      ],
      calculate: (inputs) => {
        const price = inputs.sharePrice as number;
        const shares = inputs.sharesOutstanding as number;
        if (!price || !shares) return null;
        const marketCap = price * shares;
        let classification = "Nano Cap";
        if (marketCap >= 200e9) classification = "Mega Cap";
        else if (marketCap >= 10e9) classification = "Large Cap";
        else if (marketCap >= 2e9) classification = "Mid Cap";
        else if (marketCap >= 300e6) classification = "Small Cap";
        else if (marketCap >= 50e6) classification = "Micro Cap";
        return {
          primary: { label: "Market Capitalization", value: `$${formatNumber(marketCap)}` },
          details: [
            { label: "Classification", value: classification },
            { label: "Share price", value: `$${formatNumber(price, 2)}` },
            { label: "Shares outstanding", value: formatNumber(shares) },
          ],
        };
      },
    },
    {
      id: "impliedPrice",
      name: "Implied Share Price",
      description: "Calculate share price from target market cap",
      fields: [
        { name: "targetMarketCap", label: "Target Market Cap", type: "number", prefix: "$", placeholder: "e.g. 100000000000" },
        { name: "sharesOutstanding", label: "Shares Outstanding", type: "number", placeholder: "e.g. 1500000000" },
      ],
      calculate: (inputs) => {
        const targetCap = inputs.targetMarketCap as number;
        const shares = inputs.sharesOutstanding as number;
        if (!targetCap || !shares) return null;
        const impliedPrice = targetCap / shares;
        return {
          primary: { label: "Implied Share Price", value: `$${formatNumber(impliedPrice, 2)}` },
          details: [
            { label: "Target market cap", value: `$${formatNumber(targetCap)}` },
            { label: "Shares outstanding", value: formatNumber(shares) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["enterprise-value-calculator", "pe-ratio-calculator", "eps-calculator"],
  faq: [
    { question: "What is market capitalization?", answer: "Market capitalization (market cap) is the total market value of a company's outstanding shares. It is calculated by multiplying the current share price by the total number of shares outstanding." },
    { question: "What are market cap classifications?", answer: "Companies are classified by size: Mega Cap ($200B+), Large Cap ($10B-$200B), Mid Cap ($2B-$10B), Small Cap ($300M-$2B), Micro Cap ($50M-$300M), and Nano Cap (under $50M)." },
    { question: "Why is market cap important?", answer: "Market cap helps investors assess a company's size, risk profile, and growth potential. Larger companies tend to be more stable but offer slower growth, while smaller companies may offer higher growth potential with greater risk." },
  ],
  formula: "Market Cap = Share Price x Shares Outstanding",
};
