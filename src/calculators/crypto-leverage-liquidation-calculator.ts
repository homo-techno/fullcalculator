import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cryptoLeverageLiquidationCalculator: CalculatorDefinition = {
  slug: "crypto-leverage-liquidation-calculator",
  title: "Crypto Leverage Liquidation Calculator",
  description: "Calculate the liquidation price for a leveraged cryptocurrency position.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["crypto liquidation price", "leverage liquidation", "margin call crypto"],
  variants: [{
    id: "standard",
    name: "Crypto Leverage Liquidation",
    description: "Calculate the liquidation price for a leveraged cryptocurrency position",
    fields: [
      { name: "entryPrice", label: "Entry Price", type: "number", prefix: "$", min: 0.01, max: 1000000, defaultValue: 30000 },
      { name: "leverage", label: "Leverage", type: "select", options: [{value:"2",label:"2x"},{value:"5",label:"5x"},{value:"10",label:"10x"},{value:"20",label:"20x"},{value:"50",label:"50x"},{value:"100",label:"100x"}], defaultValue: "10" },
      { name: "direction", label: "Direction", type: "select", options: [{value:"long",label:"Long"},{value:"short",label:"Short"}], defaultValue: "long" },
      { name: "positionSize", label: "Position Size", type: "number", prefix: "$", min: 10, max: 10000000, defaultValue: 1000 },
    ],
    calculate: (inputs) => {
      const entry = inputs.entryPrice as number;
      const lev = parseInt(inputs.leverage as string);
      const dir = inputs.direction as string;
      const size = inputs.positionSize as number;
      if (!entry || entry <= 0 || !lev || !size) return null;
      const margin = size / lev;
      const maintenanceMargin = 0.005;
      let liqPrice;
      if (dir === "long") {
        liqPrice = entry * (1 - 1 / lev + maintenanceMargin);
      } else {
        liqPrice = entry * (1 + 1 / lev - maintenanceMargin);
      }
      const liqDistance = Math.abs(entry - liqPrice);
      const liqPercent = (liqDistance / entry) * 100;
      return {
        primary: { label: "Liquidation Price", value: "$" + formatNumber(liqPrice, 2) },
        details: [
          { label: "Entry Price", value: "$" + formatNumber(entry) },
          { label: "Margin Used", value: "$" + formatNumber(margin) },
          { label: "Distance to Liquidation", value: liqPercent.toFixed(2) + "%" },
          { label: "Max Loss", value: "$" + formatNumber(margin) },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-margin-calculator", "crypto-portfolio-rebalancing-calculator"],
  faq: [
    { question: "What is liquidation in crypto trading?", answer: "Liquidation occurs when your margin balance can no longer support the leveraged position, and the exchange closes it automatically." },
    { question: "How can I avoid liquidation?", answer: "Use lower leverage, set stop-loss orders, and maintain extra margin in your account to buffer against price swings." },
  ],
  formula: "Liquidation Price (Long) = Entry x (1 - 1/Leverage + Maintenance Margin)",
};
