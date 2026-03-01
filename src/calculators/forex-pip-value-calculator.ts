import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forexPipValueCalculator: CalculatorDefinition = {
  slug: "forex-pip-value-calculator",
  title: "Forex Pip Value Calculator",
  description: "Calculate the value of a pip for any forex currency pair and position size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pip value calculator", "forex pip calculator", "pip worth"],
  variants: [{
    id: "standard",
    name: "Forex Pip Value",
    description: "Calculate the value of a pip for any forex currency pair and position size",
    fields: [
      { name: "positionSize", label: "Position Size (units)", type: "number", min: 100, max: 10000000, defaultValue: 100000 },
      { name: "pipSize", label: "Pip Size", type: "select", options: [{value:"0.0001",label:"0.0001 (Most Pairs)"},{value:"0.01",label:"0.01 (JPY Pairs)"}], defaultValue: "0.0001" },
      { name: "exchangeRate", label: "Exchange Rate", type: "number", min: 0.001, max: 200, step: 0.0001, defaultValue: 1.1000 },
    ],
    calculate: (inputs) => {
      const size = inputs.positionSize as number;
      const pip = parseFloat(inputs.pipSize as string);
      const rate = inputs.exchangeRate as number;
      if (!size || size <= 0 || !pip || !rate || rate <= 0) return null;
      const pipValue = (pip / rate) * size;
      const tenPips = pipValue * 10;
      const fiftyPips = pipValue * 50;
      const lots = size / 100000;
      return {
        primary: { label: "Pip Value", value: "$" + formatNumber(pipValue, 2) },
        details: [
          { label: "10 Pips", value: "$" + formatNumber(tenPips, 2) },
          { label: "50 Pips", value: "$" + formatNumber(fiftyPips, 2) },
          { label: "Position Size", value: formatNumber(lots, 2) + " lots" },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-position-size-calculator", "forex-profit-loss-calculator"],
  faq: [
    { question: "What is a pip in forex?", answer: "A pip is the smallest standard price move in a currency pair, typically 0.0001 for most pairs or 0.01 for JPY pairs." },
    { question: "How do you calculate pip value?", answer: "Pip value equals the pip size divided by the exchange rate, multiplied by the position size in units." },
  ],
  formula: "Pip Value = (Pip Size / Exchange Rate) x Position Size",
};
