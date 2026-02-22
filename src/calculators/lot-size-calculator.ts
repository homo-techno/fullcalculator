import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lotSizeCalculator: CalculatorDefinition = {
  slug: "lot-size-calculator",
  title: "Lot Size Calculator",
  description:
    "Free lot size calculator for forex trading. Determine the optimal lot size based on account balance, risk percentage, stop loss distance, and pip value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lot size", "forex", "position size", "risk management", "standard lot", "mini lot", "micro lot"],
  variants: [
    {
      id: "lotFromRisk",
      name: "Lot Size from Risk",
      fields: [
        { name: "accountBalance", label: "Account Balance ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "riskPercent", label: "Risk per Trade (%)", type: "number", placeholder: "e.g. 2", step: 0.1 },
        { name: "stopLossPips", label: "Stop Loss (pips)", type: "number", placeholder: "e.g. 50" },
        { name: "pipValue", label: "Pip Value per Standard Lot ($)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const riskPct = inputs.riskPercent as number;
        const slPips = inputs.stopLossPips as number;
        const pipVal = inputs.pipValue as number;

        if (!balance || !riskPct || !slPips || !pipVal) return null;

        const riskAmount = balance * (riskPct / 100);
        const lotSize = riskAmount / (slPips * pipVal);
        const standardLots = lotSize;
        const miniLots = lotSize * 10;
        const microLots = lotSize * 100;
        const units = lotSize * 100000;

        return {
          primary: { label: "Lot Size", value: `${formatNumber(standardLots, 4)} standard lots` },
          details: [
            { label: "Mini Lots (10K units)", value: formatNumber(miniLots, 4) },
            { label: "Micro Lots (1K units)", value: formatNumber(microLots, 4) },
            { label: "Units", value: formatNumber(units, 0) },
            { label: "Risk Amount", value: `$${formatNumber(riskAmount, 2)}` },
            { label: "Risk per Pip", value: `$${formatNumber(riskAmount / slPips, 4)}` },
          ],
        };
      },
    },
    {
      id: "riskFromLot",
      name: "Risk from Lot Size",
      fields: [
        { name: "accountBalance", label: "Account Balance ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "lotSize", label: "Lot Size (standard lots)", type: "number", placeholder: "e.g. 0.5", step: 0.01 },
        { name: "stopLossPips", label: "Stop Loss (pips)", type: "number", placeholder: "e.g. 50" },
        { name: "pipValue", label: "Pip Value per Standard Lot ($)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const lots = inputs.lotSize as number;
        const slPips = inputs.stopLossPips as number;
        const pipVal = inputs.pipValue as number;

        if (!balance || !lots || !slPips || !pipVal) return null;

        const riskAmount = lots * slPips * pipVal;
        const riskPercent = (riskAmount / balance) * 100;
        const positionValue = lots * 100000;

        return {
          primary: { label: "Risk Percentage", value: `${formatNumber(riskPercent, 2)}%` },
          details: [
            { label: "Risk Amount", value: `$${formatNumber(riskAmount, 2)}` },
            { label: "Lot Size", value: `${formatNumber(lots, 4)} standard lots` },
            { label: "Position Value", value: `$${formatNumber(positionValue, 2)}` },
            { label: "Stop Loss", value: `${formatNumber(slPips, 1)} pips` },
            { label: "Account Balance", value: `$${formatNumber(balance, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pip-calculator", "position-size-calculator", "leverage-calculator"],
  faq: [
    { question: "What is a lot in forex?", answer: "A lot is a standardized unit of measurement in forex. A standard lot is 100,000 units of the base currency, a mini lot is 10,000 units, and a micro lot is 1,000 units." },
    { question: "How do I calculate the right lot size?", answer: "Lot Size = Risk Amount / (Stop Loss in Pips x Pip Value). First determine how much you are willing to risk (e.g., 2% of account), then divide by the potential loss per pip." },
    { question: "Why is lot size important?", answer: "Correct lot sizing is crucial for risk management. Trading too large can lead to rapid account depletion, while trading too small may not justify the time and effort." },
  ],
  formula: "Lot Size = (Account Balance x Risk%) / (Stop Loss Pips x Pip Value)",
};
