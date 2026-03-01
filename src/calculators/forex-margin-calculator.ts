import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forexMarginCalculator: CalculatorDefinition = {
  slug: "forex-margin-calculator",
  title: "Forex Margin Calculator",
  description: "Calculate the required margin for a forex position based on leverage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["forex margin calculator", "margin requirement", "forex leverage margin"],
  variants: [{
    id: "standard",
    name: "Forex Margin",
    description: "Calculate the required margin for a forex position based on leverage",
    fields: [
      { name: "positionSize", label: "Position Size (units)", type: "number", min: 100, max: 10000000, defaultValue: 100000 },
      { name: "leverage", label: "Leverage Ratio", type: "select", options: [{value:"50",label:"50:1"},{value:"100",label:"100:1"},{value:"200",label:"200:1"},{value:"500",label:"500:1"}], defaultValue: "100" },
      { name: "exchangeRate", label: "Exchange Rate", type: "number", min: 0.001, max: 200, step: 0.0001, defaultValue: 1.1000 },
    ],
    calculate: (inputs) => {
      const size = inputs.positionSize as number;
      const leverage = parseInt(inputs.leverage as string);
      const rate = inputs.exchangeRate as number;
      if (!size || size <= 0 || !leverage || !rate) return null;
      const notionalValue = size * rate;
      const requiredMargin = notionalValue / leverage;
      const marginPercent = (1 / leverage) * 100;
      const lots = size / 100000;
      return {
        primary: { label: "Required Margin", value: "$" + formatNumber(requiredMargin, 2) },
        details: [
          { label: "Notional Value", value: "$" + formatNumber(notionalValue) },
          { label: "Margin Percentage", value: marginPercent.toFixed(2) + "%" },
          { label: "Leverage", value: leverage + ":1" },
          { label: "Position", value: formatNumber(lots, 2) + " standard lots" },
        ],
      };
    },
  }],
  relatedSlugs: ["forex-position-size-calculator", "forex-profit-loss-calculator"],
  faq: [
    { question: "What is margin in forex trading?", answer: "Margin is the amount of money required in your account to open and maintain a leveraged position." },
    { question: "What happens if margin runs out?", answer: "If your account equity falls below the maintenance margin, you will receive a margin call and positions may be liquidated automatically." },
  ],
  formula: "Required Margin = (Position Size x Exchange Rate) / Leverage",
};
