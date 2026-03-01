import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forexProfitLossCalculator: CalculatorDefinition = {
  slug: "forex-profit-loss-calculator",
  title: "Forex Profit Loss Calculator",
  description: "Calculate the profit or loss of a forex trade based on entry and exit prices.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["forex profit loss", "forex P&L", "trade profit calculator"],
  variants: [{
    id: "standard",
    name: "Forex Profit Loss",
    description: "Calculate the profit or loss of a forex trade based on entry and exit prices",
    fields: [
      { name: "entryPrice", label: "Entry Price", type: "number", min: 0.001, max: 200, step: 0.0001, defaultValue: 1.1000 },
      { name: "exitPrice", label: "Exit Price", type: "number", min: 0.001, max: 200, step: 0.0001, defaultValue: 1.1050 },
      { name: "positionSize", label: "Position Size (units)", type: "number", min: 100, max: 10000000, defaultValue: 100000 },
      { name: "direction", label: "Direction", type: "select", options: [{value:"long",label:"Long (Buy)"},{value:"short",label:"Short (Sell)"}], defaultValue: "long" },
    ],
    calculate: (inputs) => {
      const entry = inputs.entryPrice as number;
      const exit = inputs.exitPrice as number;
      const size = inputs.positionSize as number;
      const dir = inputs.direction as string;
      if (!entry || !exit || !size) return null;
      const priceDiff = dir === "long" ? exit - entry : entry - exit;
      const profitLoss = priceDiff * size;
      const pips = priceDiff / 0.0001;
      const returnPct = (priceDiff / entry) * 100;
      return {
        primary: { label: "Profit / Loss", value: "$" + formatNumber(profitLoss, 2) },
        details: [
          { label: "Pips", value: formatNumber(pips, 1) },
          { label: "Return", value: returnPct.toFixed(3) + "%" },
          { label: "Direction", value: dir === "long" ? "Long" : "Short" },
          { label: "Position Size", value: formatNumber(size / 100000, 2) + " lots" },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-pip-value-calculator", "forex-position-size-calculator"],
  faq: [
    { question: "How is forex profit calculated?", answer: "Profit equals the price difference multiplied by the position size. For long trades, profit comes from price increases." },
    { question: "What is a pip worth in dollars?", answer: "For a standard lot of 100,000 units on most USD pairs, one pip is worth approximately $10." },
  ],
  formula: "P/L = (Exit Price - Entry Price) x Position Size (adjusted for direction)",
};
