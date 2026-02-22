import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const optionsProfitCalculator: CalculatorDefinition = {
  slug: "options-profit-calculator",
  title: "Options Profit Calculator",
  description: "Free options profit/loss calculator. Calculate potential profit, loss, and break-even points for call and put options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["options profit", "options loss", "call option profit", "put option profit", "break even", "options calculator"],
  variants: [
    {
      id: "longCall",
      name: "Long Call",
      description: "Profit/loss for buying a call option",
      fields: [
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "premium", label: "Premium Paid (per share)", type: "number", prefix: "$", placeholder: "e.g. 5.00" },
        { name: "contracts", label: "Number of Contracts", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "expiryPrice", label: "Stock Price at Expiry", type: "number", prefix: "$", placeholder: "e.g. 115" },
      ],
      calculate: (inputs) => {
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const contracts = (inputs.contracts as number) || 1;
        const expiryPrice = inputs.expiryPrice as number;
        if (!strike || !premium || !expiryPrice) return null;
        const sharesPerContract = 100;
        const totalShares = contracts * sharesPerContract;
        const intrinsicValue = Math.max(0, expiryPrice - strike);
        const profitPerShare = intrinsicValue - premium;
        const totalProfit = profitPerShare * totalShares;
        const breakeven = strike + premium;
        const roi = (profitPerShare / premium) * 100;
        return {
          primary: { label: "Total Profit/Loss", value: `$${formatNumber(totalProfit, 2)}` },
          details: [
            { label: "Profit per share", value: `$${formatNumber(profitPerShare, 2)}` },
            { label: "Break-even price", value: `$${formatNumber(breakeven, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
            { label: "Max loss", value: `$${formatNumber(premium * totalShares, 2)}` },
          ],
        };
      },
    },
    {
      id: "longPut",
      name: "Long Put",
      description: "Profit/loss for buying a put option",
      fields: [
        { name: "strikePrice", label: "Strike Price", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "premium", label: "Premium Paid (per share)", type: "number", prefix: "$", placeholder: "e.g. 4.00" },
        { name: "contracts", label: "Number of Contracts", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "expiryPrice", label: "Stock Price at Expiry", type: "number", prefix: "$", placeholder: "e.g. 85" },
      ],
      calculate: (inputs) => {
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const contracts = (inputs.contracts as number) || 1;
        const expiryPrice = inputs.expiryPrice as number;
        if (!strike || !premium || expiryPrice === undefined) return null;
        const totalShares = contracts * 100;
        const intrinsicValue = Math.max(0, strike - expiryPrice);
        const profitPerShare = intrinsicValue - premium;
        const totalProfit = profitPerShare * totalShares;
        const breakeven = strike - premium;
        const roi = (profitPerShare / premium) * 100;
        return {
          primary: { label: "Total Profit/Loss", value: `$${formatNumber(totalProfit, 2)}` },
          details: [
            { label: "Profit per share", value: `$${formatNumber(profitPerShare, 2)}` },
            { label: "Break-even price", value: `$${formatNumber(breakeven, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
            { label: "Max loss", value: `$${formatNumber(premium * totalShares, 2)}` },
            { label: "Max profit", value: `$${formatNumber((strike - premium) * totalShares, 2)}` },
          ],
        };
      },
    },
    {
      id: "coveredCall",
      name: "Covered Call",
      description: "Profit/loss for a covered call strategy",
      fields: [
        { name: "purchasePrice", label: "Stock Purchase Price", type: "number", prefix: "$", placeholder: "e.g. 95" },
        { name: "strikePrice", label: "Call Strike Price", type: "number", prefix: "$", placeholder: "e.g. 105" },
        { name: "premium", label: "Premium Received (per share)", type: "number", prefix: "$", placeholder: "e.g. 3.00" },
        { name: "shares", label: "Number of Shares", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "expiryPrice", label: "Stock Price at Expiry", type: "number", prefix: "$", placeholder: "e.g. 110" },
      ],
      calculate: (inputs) => {
        const purchase = inputs.purchasePrice as number;
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const shares = (inputs.shares as number) || 100;
        const expiryPrice = inputs.expiryPrice as number;
        if (!purchase || !strike || !premium || !expiryPrice) return null;
        const effectiveExit = expiryPrice > strike ? strike : expiryPrice;
        const stockPL = (effectiveExit - purchase) * shares;
        const premiumIncome = premium * shares;
        const totalProfit = stockPL + premiumIncome;
        const maxProfit = (strike - purchase + premium) * shares;
        const breakeven = purchase - premium;
        return {
          primary: { label: "Total Profit/Loss", value: `$${formatNumber(totalProfit, 2)}` },
          details: [
            { label: "Stock P/L", value: `$${formatNumber(stockPL, 2)}` },
            { label: "Premium income", value: `$${formatNumber(premiumIncome, 2)}` },
            { label: "Break-even price", value: `$${formatNumber(breakeven, 2)}` },
            { label: "Max profit", value: `$${formatNumber(maxProfit, 2)}` },
            { label: "Called away?", value: expiryPrice > strike ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["black-scholes-calculator", "put-call-parity-calculator", "risk-reward-calculator"],
  faq: [
    { question: "How do you calculate options profit?", answer: "For a long call: Profit = (Stock Price - Strike Price - Premium) x 100 per contract. For a long put: Profit = (Strike Price - Stock Price - Premium) x 100 per contract. Each standard contract represents 100 shares." },
    { question: "What is the break-even point for options?", answer: "For a call option, break-even = Strike Price + Premium Paid. For a put option, break-even = Strike Price - Premium Paid. The stock must move beyond the break-even for the option buyer to profit." },
    { question: "What is a covered call?", answer: "A covered call involves owning the underlying stock and selling a call option against it. It generates premium income but caps the upside if the stock rises above the strike price. It lowers the effective cost basis." },
  ],
  formula: "Long Call P/L = max(0, S-K) - Premium | Long Put P/L = max(0, K-S) - Premium | Each contract = 100 shares",
};
