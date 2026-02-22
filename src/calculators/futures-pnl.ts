import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const futuresPnlCalculator: CalculatorDefinition = {
  slug: "futures-pnl-calculator",
  title: "Futures PnL Calculator",
  description:
    "Free futures PnL calculator. Calculate profit and loss for futures positions including leverage, entry price, exit price, and fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["futures", "PnL", "profit and loss", "leverage", "trading", "crypto futures", "perpetual"],
  variants: [
    {
      id: "longPosition",
      name: "Long Position PnL",
      fields: [
        { name: "entryPrice", label: "Entry Price ($)", type: "number", placeholder: "e.g. 40000" },
        { name: "exitPrice", label: "Exit Price ($)", type: "number", placeholder: "e.g. 42000" },
        { name: "positionSize", label: "Position Size ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "leverage", label: "Leverage (x)", type: "number", placeholder: "e.g. 10", defaultValue: 1 },
        { name: "feeRate", label: "Trading Fee (%)", type: "number", placeholder: "e.g. 0.06", step: 0.01, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const entry = inputs.entryPrice as number;
        const exit = inputs.exitPrice as number;
        const size = inputs.positionSize as number;
        const leverage = (inputs.leverage as number) || 1;
        const feeRate = (inputs.feeRate as number) || 0;

        if (!entry || !exit || !size) return null;

        const margin = size / leverage;
        const notional = size;
        const priceChange = ((exit - entry) / entry) * 100;
        const pnl = notional * ((exit - entry) / entry);
        const totalFees = notional * (feeRate / 100) * 2;
        const netPnl = pnl - totalFees;
        const roe = (netPnl / margin) * 100;
        const liqPrice = entry * (1 - 1 / leverage);

        return {
          primary: { label: "Net PnL", value: `$${formatNumber(netPnl, 2)}` },
          details: [
            { label: "Gross PnL", value: `$${formatNumber(pnl, 2)}` },
            { label: "Total Fees", value: `$${formatNumber(totalFees, 2)}` },
            { label: "ROE (Return on Equity)", value: `${formatNumber(roe, 2)}%` },
            { label: "Margin (Collateral)", value: `$${formatNumber(margin, 2)}` },
            { label: "Price Change", value: `${formatNumber(priceChange, 2)}%` },
            { label: "Est. Liquidation Price", value: `$${formatNumber(liqPrice, 2)}` },
          ],
        };
      },
    },
    {
      id: "shortPosition",
      name: "Short Position PnL",
      fields: [
        { name: "entryPrice", label: "Entry Price ($)", type: "number", placeholder: "e.g. 40000" },
        { name: "exitPrice", label: "Exit Price ($)", type: "number", placeholder: "e.g. 38000" },
        { name: "positionSize", label: "Position Size ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "leverage", label: "Leverage (x)", type: "number", placeholder: "e.g. 10", defaultValue: 1 },
        { name: "feeRate", label: "Trading Fee (%)", type: "number", placeholder: "e.g. 0.06", step: 0.01, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const entry = inputs.entryPrice as number;
        const exit = inputs.exitPrice as number;
        const size = inputs.positionSize as number;
        const leverage = (inputs.leverage as number) || 1;
        const feeRate = (inputs.feeRate as number) || 0;

        if (!entry || !exit || !size) return null;

        const margin = size / leverage;
        const notional = size;
        const priceChange = ((entry - exit) / entry) * 100;
        const pnl = notional * ((entry - exit) / entry);
        const totalFees = notional * (feeRate / 100) * 2;
        const netPnl = pnl - totalFees;
        const roe = (netPnl / margin) * 100;
        const liqPrice = entry * (1 + 1 / leverage);

        return {
          primary: { label: "Net PnL", value: `$${formatNumber(netPnl, 2)}` },
          details: [
            { label: "Gross PnL", value: `$${formatNumber(pnl, 2)}` },
            { label: "Total Fees", value: `$${formatNumber(totalFees, 2)}` },
            { label: "ROE (Return on Equity)", value: `${formatNumber(roe, 2)}%` },
            { label: "Margin (Collateral)", value: `$${formatNumber(margin, 2)}` },
            { label: "Price Change", value: `${formatNumber(priceChange, 2)}%` },
            { label: "Est. Liquidation Price", value: `$${formatNumber(liqPrice, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["leverage-calculator", "position-size-calculator", "crypto-profit-calculator"],
  faq: [
    { question: "What is futures PnL?", answer: "Futures PnL (Profit and Loss) is the difference between your entry and exit price multiplied by the position size. With leverage, PnL is amplified relative to your margin (collateral)." },
    { question: "What is ROE in futures trading?", answer: "ROE (Return on Equity) measures your profit relative to the margin you put up, not the full position size. With 10x leverage, a 5% price move results in 50% ROE." },
    { question: "How is liquidation price calculated?", answer: "For a long position, liquidation occurs when losses equal your margin: Liq Price = Entry x (1 - 1/Leverage). For shorts: Liq Price = Entry x (1 + 1/Leverage). Actual liquidation prices vary by exchange." },
  ],
  formula: "Long PnL = Position Size x (Exit - Entry) / Entry; Short PnL = Position Size x (Entry - Exit) / Entry; ROE = Net PnL / Margin x 100",
};
