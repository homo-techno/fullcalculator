import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stockSplitCalculator: CalculatorDefinition = {
  slug: "stock-split-calculator",
  title: "Stock Split Calculator",
  description: "Free stock split calculator. Calculate new share count, adjusted price, and cost basis after a forward or reverse stock split.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stock split", "forward split", "reverse split", "share count", "adjusted price", "stock split calculator"],
  variants: [
    {
      id: "forwardSplit",
      name: "Forward Stock Split",
      description: "Calculate results of a forward stock split",
      fields: [
        { name: "currentShares", label: "Current Number of Shares", type: "number", placeholder: "e.g. 100" },
        { name: "currentPrice", label: "Current Price per Share", type: "number", prefix: "$", placeholder: "e.g. 300" },
        { name: "splitRatioNew", label: "Split Ratio (new shares)", type: "number", placeholder: "e.g. 4" },
        { name: "splitRatioOld", label: "Split Ratio (for every old share)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const shares = inputs.currentShares as number;
        const price = inputs.currentPrice as number;
        const newRatio = inputs.splitRatioNew as number;
        const oldRatio = (inputs.splitRatioOld as number) || 1;
        if (!shares || !price || !newRatio || !oldRatio) return null;
        const splitFactor = newRatio / oldRatio;
        const newShares = shares * splitFactor;
        const newPrice = price / splitFactor;
        const totalValueBefore = shares * price;
        const totalValueAfter = newShares * newPrice;
        return {
          primary: { label: "New Share Count", value: formatNumber(newShares) },
          details: [
            { label: "Split ratio", value: `${newRatio}:${oldRatio}` },
            { label: "New price per share", value: `$${formatNumber(newPrice, 2)}` },
            { label: "Total value before", value: `$${formatNumber(totalValueBefore, 2)}` },
            { label: "Total value after", value: `$${formatNumber(totalValueAfter, 2)}` },
            { label: "Additional shares received", value: formatNumber(newShares - shares) },
          ],
        };
      },
    },
    {
      id: "reverseSplit",
      name: "Reverse Stock Split",
      description: "Calculate results of a reverse stock split",
      fields: [
        { name: "currentShares", label: "Current Number of Shares", type: "number", placeholder: "e.g. 1000" },
        { name: "currentPrice", label: "Current Price per Share", type: "number", prefix: "$", placeholder: "e.g. 2.50" },
        { name: "reverseRatioOld", label: "Old Shares (consolidating)", type: "number", placeholder: "e.g. 10" },
        { name: "reverseRatioNew", label: "Into New Shares", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const shares = inputs.currentShares as number;
        const price = inputs.currentPrice as number;
        const oldRatio = inputs.reverseRatioOld as number;
        const newRatio = (inputs.reverseRatioNew as number) || 1;
        if (!shares || !price || !oldRatio || !newRatio) return null;
        const consolidationFactor = newRatio / oldRatio;
        const newShares = shares * consolidationFactor;
        const newPrice = price / consolidationFactor;
        return {
          primary: { label: "New Share Count", value: formatNumber(Math.floor(newShares)) },
          details: [
            { label: "Reverse split ratio", value: `${oldRatio}:${newRatio}` },
            { label: "New price per share", value: `$${formatNumber(newPrice, 2)}` },
            { label: "Shares eliminated", value: formatNumber(shares - Math.floor(newShares)) },
            { label: "Fractional shares", value: newShares % 1 > 0 ? `${formatNumber((newShares % 1), 4)} shares (cashed out)` : "None" },
          ],
        };
      },
    },
    {
      id: "costBasis",
      name: "Adjusted Cost Basis",
      description: "Calculate adjusted cost basis after split",
      fields: [
        { name: "originalShares", label: "Original Shares Purchased", type: "number", placeholder: "e.g. 50" },
        { name: "originalCostPerShare", label: "Original Cost per Share", type: "number", prefix: "$", placeholder: "e.g. 200" },
        { name: "splitRatioNew", label: "Split Ratio (new)", type: "number", placeholder: "e.g. 4" },
        { name: "splitRatioOld", label: "Split Ratio (old)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const origShares = inputs.originalShares as number;
        const origCost = inputs.originalCostPerShare as number;
        const newRatio = inputs.splitRatioNew as number;
        const oldRatio = (inputs.splitRatioOld as number) || 1;
        if (!origShares || !origCost || !newRatio || !oldRatio) return null;
        const splitFactor = newRatio / oldRatio;
        const totalCostBasis = origShares * origCost;
        const newShares = origShares * splitFactor;
        const adjustedCostPerShare = origCost / splitFactor;
        return {
          primary: { label: "Adjusted Cost per Share", value: `$${formatNumber(adjustedCostPerShare, 2)}` },
          details: [
            { label: "New total shares", value: formatNumber(newShares) },
            { label: "Total cost basis (unchanged)", value: `$${formatNumber(totalCostBasis, 2)}` },
            { label: "Original cost per share", value: `$${formatNumber(origCost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stock-average-calculator", "cost-basis-calculator", "market-cap-calculator"],
  faq: [
    { question: "What is a stock split?", answer: "A stock split increases the number of shares while proportionally decreasing the price per share. For example, in a 2:1 split, each share becomes 2 shares at half the price. The total value of your holdings remains the same." },
    { question: "What is a reverse stock split?", answer: "A reverse stock split consolidates shares, reducing the count while increasing the price. For example, a 1:10 reverse split turns 10 shares at $1 into 1 share at $10. Companies do this to meet exchange listing requirements." },
    { question: "Does a stock split affect my cost basis?", answer: "A stock split does not change your total cost basis. The per-share cost basis is adjusted by the split ratio. For a 2:1 split, your cost per share is halved while your number of shares doubles." },
  ],
  formula: "New Shares = Old Shares x (New Ratio / Old Ratio) | New Price = Old Price / (New Ratio / Old Ratio)",
};
