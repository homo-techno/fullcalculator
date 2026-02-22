import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leverageCalculator: CalculatorDefinition = {
  slug: "leverage-calculator",
  title: "Leverage Calculator",
  description:
    "Free leverage calculator for margin trading. Calculate required margin, position size, liquidation price, and risk based on leverage ratio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["leverage", "margin trading", "margin", "liquidation", "position size", "crypto", "forex"],
  variants: [
    {
      id: "marginRequired",
      name: "Margin Required",
      fields: [
        { name: "positionSize", label: "Position Size ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "leverage", label: "Leverage (x)", type: "number", placeholder: "e.g. 10" },
        { name: "entryPrice", label: "Entry Price ($)", type: "number", placeholder: "e.g. 40000" },
      ],
      calculate: (inputs) => {
        const positionSize = inputs.positionSize as number;
        const leverage = inputs.leverage as number;
        const entryPrice = inputs.entryPrice as number;

        if (!positionSize || !leverage || !entryPrice) return null;

        const marginRequired = positionSize / leverage;
        const liquidationLong = entryPrice * (1 - 1 / leverage);
        const liquidationShort = entryPrice * (1 + 1 / leverage);
        const maxLoss = marginRequired;
        const priceToLiq = ((entryPrice - liquidationLong) / entryPrice) * 100;

        return {
          primary: { label: "Margin Required", value: `$${formatNumber(marginRequired, 2)}` },
          details: [
            { label: "Position Size", value: `$${formatNumber(positionSize, 2)}` },
            { label: "Leverage", value: `${formatNumber(leverage, 0)}x` },
            { label: "Liquidation (Long)", value: `$${formatNumber(liquidationLong, 2)}` },
            { label: "Liquidation (Short)", value: `$${formatNumber(liquidationShort, 2)}` },
            { label: "Max Loss (= Margin)", value: `$${formatNumber(maxLoss, 2)}` },
            { label: "Price Move to Liquidation", value: `${formatNumber(priceToLiq, 2)}%` },
          ],
        };
      },
    },
    {
      id: "positionFromMargin",
      name: "Position Size from Margin",
      fields: [
        { name: "availableMargin", label: "Available Margin ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "leverage", label: "Leverage (x)", type: "number", placeholder: "e.g. 20" },
        { name: "entryPrice", label: "Entry Price ($)", type: "number", placeholder: "e.g. 40000" },
      ],
      calculate: (inputs) => {
        const margin = inputs.availableMargin as number;
        const leverage = inputs.leverage as number;
        const entryPrice = inputs.entryPrice as number;

        if (!margin || !leverage || !entryPrice) return null;

        const positionSize = margin * leverage;
        const units = positionSize / entryPrice;
        const liquidationLong = entryPrice * (1 - 1 / leverage);
        const liquidationShort = entryPrice * (1 + 1 / leverage);

        return {
          primary: { label: "Maximum Position Size", value: `$${formatNumber(positionSize, 2)}` },
          details: [
            { label: "Units / Contracts", value: formatNumber(units, 6) },
            { label: "Available Margin", value: `$${formatNumber(margin, 2)}` },
            { label: "Leverage", value: `${formatNumber(leverage, 0)}x` },
            { label: "Liquidation (Long)", value: `$${formatNumber(liquidationLong, 2)}` },
            { label: "Liquidation (Short)", value: `$${formatNumber(liquidationShort, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["futures-pnl-calculator", "position-size-calculator", "margin-call-calculator"],
  faq: [
    { question: "What is leverage in trading?", answer: "Leverage allows you to control a larger position than your capital. With 10x leverage, $1,000 in margin controls a $10,000 position. Gains and losses are both amplified." },
    { question: "What is liquidation?", answer: "Liquidation occurs when your unrealized losses approach your margin (collateral). The exchange automatically closes your position to prevent further losses beyond your deposited margin." },
    { question: "Is higher leverage always better?", answer: "No. Higher leverage amplifies both gains and losses and brings your liquidation price closer to entry. A small adverse move can wipe out your entire margin with high leverage." },
  ],
  formula: "Margin = Position Size / Leverage; Liquidation (Long) = Entry x (1 - 1/Leverage); Liquidation (Short) = Entry x (1 + 1/Leverage)",
};
