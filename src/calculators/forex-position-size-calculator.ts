import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forexPositionSizeCalculator: CalculatorDefinition = {
  slug: "forex-position-size-calculator",
  title: "Forex Position Size Calculator",
  description: "Calculate the optimal position size for a forex trade based on risk tolerance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["forex position size", "lot size calculator", "forex risk management"],
  variants: [{
    id: "standard",
    name: "Forex Position Size",
    description: "Calculate the optimal position size for a forex trade based on risk tolerance",
    fields: [
      { name: "accountBalance", label: "Account Balance", type: "number", prefix: "$", min: 100, max: 10000000, defaultValue: 10000 },
      { name: "riskPercent", label: "Risk Per Trade", type: "number", suffix: "%", min: 0.1, max: 10, step: 0.1, defaultValue: 2 },
      { name: "stopLossPips", label: "Stop Loss", type: "number", suffix: "pips", min: 1, max: 1000, defaultValue: 50 },
      { name: "pipValue", label: "Pip Value per Lot", type: "number", prefix: "$", min: 0.01, max: 100, step: 0.01, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const balance = inputs.accountBalance as number;
      const risk = (inputs.riskPercent as number) / 100;
      const sl = inputs.stopLossPips as number;
      const pipVal = inputs.pipValue as number;
      if (!balance || balance <= 0 || !sl || !pipVal) return null;
      const riskAmount = balance * risk;
      const positionSize = riskAmount / (sl * pipVal);
      const lots = positionSize;
      const miniLots = lots * 10;
      const microLots = lots * 100;
      return {
        primary: { label: "Position Size", value: formatNumber(lots, 2) + " standard lots" },
        details: [
          { label: "Risk Amount", value: "$" + formatNumber(riskAmount) },
          { label: "Mini Lots", value: formatNumber(miniLots, 2) },
          { label: "Micro Lots", value: formatNumber(microLots, 2) },
          { label: "Max Loss", value: "$" + formatNumber(riskAmount) },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-pip-value-calculator", "forex-margin-calculator"],
  faq: [
    { question: "What is a good risk per trade?", answer: "Most professional traders risk 1% to 2% of their account per trade to protect against drawdowns." },
    { question: "What is a standard lot in forex?", answer: "A standard lot is 100,000 units of the base currency. Mini lots are 10,000 and micro lots are 1,000 units." },
  ],
  formula: "Position Size (lots) = (Account Balance x Risk %) / (Stop Loss Pips x Pip Value)",
};
