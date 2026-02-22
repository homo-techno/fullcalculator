import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pipCalculator: CalculatorDefinition = {
  slug: "pip-calculator",
  title: "Pip Value Calculator",
  description:
    "Free pip value calculator for forex trading. Calculate the monetary value of a pip based on currency pair, lot size, and account currency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pip", "forex", "currency", "pip value", "lot size", "trading", "FX"],
  variants: [
    {
      id: "pipValue",
      name: "Pip Value Calculation",
      fields: [
        {
          name: "pair",
          label: "Currency Pair Type",
          type: "select",
          options: [
            { label: "USD is Quote (e.g. EUR/USD)", value: "usdQuote" },
            { label: "USD is Base (e.g. USD/JPY)", value: "usdBase" },
            { label: "Cross Pair (e.g. EUR/GBP)", value: "cross" },
          ],
          defaultValue: "usdQuote",
        },
        { name: "lotSize", label: "Lot Size (units)", type: "number", placeholder: "e.g. 100000", defaultValue: 100000 },
        { name: "exchangeRate", label: "Exchange Rate", type: "number", placeholder: "e.g. 1.1050", step: 0.0001 },
        { name: "pipSize", label: "Pip Size", type: "number", placeholder: "e.g. 0.0001", step: 0.0001, defaultValue: 0.0001 },
      ],
      calculate: (inputs) => {
        const pair = inputs.pair as string;
        const lotSize = inputs.lotSize as number;
        const rate = inputs.exchangeRate as number;
        const pipSize = inputs.pipSize as number;

        if (!lotSize || !rate || !pipSize) return null;

        let pipValue: number;
        if (pair === "usdQuote") {
          pipValue = lotSize * pipSize;
        } else if (pair === "usdBase") {
          pipValue = (lotSize * pipSize) / rate;
        } else {
          pipValue = (lotSize * pipSize) / rate;
        }

        const pipValueMini = pipValue / 10;
        const pipValueMicro = pipValue / 100;

        return {
          primary: { label: "Pip Value (Standard Lot)", value: `$${formatNumber(pipValue, 4)}` },
          details: [
            { label: "Pip Value (Mini Lot - 10K)", value: `$${formatNumber(pipValueMini, 4)}` },
            { label: "Pip Value (Micro Lot - 1K)", value: `$${formatNumber(pipValueMicro, 4)}` },
            { label: "Lot Size", value: formatNumber(lotSize, 0) },
            { label: "Exchange Rate", value: formatNumber(rate, 5) },
            { label: "Pip Size", value: formatNumber(pipSize, 5) },
          ],
        };
      },
    },
    {
      id: "profitFromPips",
      name: "Profit from Pips",
      fields: [
        { name: "pipsGained", label: "Pips Gained/Lost", type: "number", placeholder: "e.g. 50" },
        { name: "pipValue", label: "Pip Value ($)", type: "number", placeholder: "e.g. 10", step: 0.01 },
        { name: "numLots", label: "Number of Lots", type: "number", placeholder: "e.g. 1", step: 0.01 },
      ],
      calculate: (inputs) => {
        const pips = inputs.pipsGained as number;
        const pipVal = inputs.pipValue as number;
        const lots = inputs.numLots as number;

        if (pips === undefined || !pipVal || !lots) return null;

        const totalProfit = pips * pipVal * lots;
        const perLot = pips * pipVal;

        return {
          primary: { label: "Total Profit/Loss", value: `$${formatNumber(totalProfit, 2)}` },
          details: [
            { label: "Profit per Lot", value: `$${formatNumber(perLot, 2)}` },
            { label: "Pips", value: formatNumber(pips, 1) },
            { label: "Pip Value", value: `$${formatNumber(pipVal, 4)}` },
            { label: "Number of Lots", value: formatNumber(lots, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lot-size-calculator", "position-size-calculator", "leverage-calculator"],
  faq: [
    { question: "What is a pip?", answer: "A pip (Percentage in Point) is the smallest standard price move in forex. For most pairs it is 0.0001 (the 4th decimal). For JPY pairs it is 0.01 (the 2nd decimal)." },
    { question: "How is pip value calculated?", answer: "For pairs where USD is the quote currency (e.g., EUR/USD): Pip Value = Lot Size x Pip Size. For pairs where USD is the base currency: Pip Value = (Lot Size x Pip Size) / Exchange Rate." },
    { question: "What is the pip value of a standard lot?", answer: "For a standard lot (100,000 units) in EUR/USD, one pip is worth $10. For a mini lot (10,000 units) it is $1, and for a micro lot (1,000 units) it is $0.10." },
  ],
  formula: "Pip Value = Lot Size x Pip Size (if USD is quote); Pip Value = (Lot Size x Pip Size) / Rate (if USD is base)",
};
