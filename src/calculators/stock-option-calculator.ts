import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stockOptionCalculator: CalculatorDefinition = {
  slug: "stock-option-calculator",
  title: "Stock Option Calculator",
  description: "Calculate the potential value of employee stock options based on strike price, current price, and vesting schedule.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stock option value", "employee stock options", "option value calculator"],
  variants: [{
    id: "standard",
    name: "Stock Option",
    description: "Calculate the potential value of employee stock options based on strike price, current price, and vesting schedule",
    fields: [
      { name: "shares", label: "Number of Options", type: "number", suffix: "shares", min: 100, max: 1000000, defaultValue: 10000 },
      { name: "strikePrice", label: "Strike Price", type: "number", suffix: "$", min: 0.01, max: 5000, defaultValue: 5 },
      { name: "currentPrice", label: "Current or Expected Price", type: "number", suffix: "$", min: 0.01, max: 5000, defaultValue: 25 },
      { name: "vestedPct", label: "Percent Vested", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const shares = inputs.shares as number;
      const strike = inputs.strikePrice as number;
      const current = inputs.currentPrice as number;
      const vestedPct = inputs.vestedPct as number;
      if (!shares || !strike || !current) return null;
      const spreadPerShare = Math.max(current - strike, 0);
      const totalValue = shares * spreadPerShare;
      const vestedShares = Math.round(shares * (vestedPct / 100));
      const vestedValue = vestedShares * spreadPerShare;
      const unvestedValue = totalValue - vestedValue;
      const taxEstimate = vestedValue * 0.32;
      return {
        primary: { label: "Total Option Value", value: "$" + formatNumber(totalValue) },
        details: [
          { label: "Spread per Share", value: "$" + formatNumber(spreadPerShare) },
          { label: "Vested Shares", value: formatNumber(vestedShares) },
          { label: "Vested Value", value: "$" + formatNumber(vestedValue) },
          { label: "Unvested Value", value: "$" + formatNumber(unvestedValue) },
          { label: "Estimated Tax on Exercise (32%)", value: "$" + formatNumber(taxEstimate) },
        ],
      };
    },
  }],
  relatedSlugs: ["rsu-tax-calculator", "espp-calculator"],
  faq: [
    { question: "How are stock options taxed?", answer: "Incentive stock options (ISOs) may qualify for capital gains treatment if held for one year after exercise and two years after grant. Non-qualified options (NSOs) are taxed as ordinary income on the spread at exercise." },
    { question: "What is the strike price?", answer: "The strike price is the fixed price at which you can purchase company stock. If the current market price exceeds the strike price, your options are in the money and have value." },
  ],
  formula: "Option Value = (Current Price - Strike Price) x Number of Shares; Vested Value = Option Value x Vested Percent",
};
