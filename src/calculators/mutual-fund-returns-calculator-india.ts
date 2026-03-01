import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mutualFundReturnsCalculatorIndiaCalculator: CalculatorDefinition = {
  slug: "mutual-fund-returns-calculator-india",
  title: "Mutual Fund Returns Calculator India",
  description: "Calculate mutual fund returns in India accounting for expense ratio and exit load on investment performance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mutual fund returns india", "mf calculator india", "mutual fund expense ratio impact"],
  variants: [{
    id: "standard",
    name: "Mutual Fund Returns India",
    description: "Calculate mutual fund returns in India accounting for expense ratio and exit load on investment performance",
    fields: [
      { name: "investment", label: "Investment Amount", type: "number", prefix: "Rs.", min: 1000, max: 50000000, step: 1000, defaultValue: 100000 },
      { name: "years", label: "Holding Period", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 5 },
      { name: "grossReturn", label: "Gross Annual Return", type: "number", suffix: "%", min: 1, max: 30, step: 0.5, defaultValue: 14 },
      { name: "expenseRatio", label: "Expense Ratio", type: "number", suffix: "%", min: 0, max: 3, step: 0.05, defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
      const invest = inputs.investment as number;
      const years = inputs.years as number;
      const gross = inputs.grossReturn as number;
      const expense = inputs.expenseRatio as number;
      if (!invest || !years || !gross || invest <= 0) return null;
      const netReturn = gross - expense;
      const grossValue = invest * Math.pow(1 + gross / 100, years);
      const netValue = invest * Math.pow(1 + netReturn / 100, years);
      const costOfExpenses = grossValue - netValue;
      const netGains = netValue - invest;
      return {
        primary: { label: "Net Future Value", value: "Rs. " + formatNumber(Math.round(netValue)) },
        details: [
          { label: "Gross Value (before expenses)", value: "Rs. " + formatNumber(Math.round(grossValue)) },
          { label: "Cost of Expense Ratio", value: "Rs. " + formatNumber(Math.round(costOfExpenses)) },
          { label: "Net Annual Return", value: formatNumber(Math.round(netReturn * 100) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sip-step-up-calculator", "elss-tax-saving-calculator"],
  faq: [
    { question: "What is a good expense ratio for mutual funds in India?", answer: "For actively managed equity funds, an expense ratio below 1.5 percent is considered reasonable. Index funds and ETFs typically have expense ratios below 0.5 percent, making them cost-effective options." },
    { question: "How does the expense ratio affect long-term returns?", answer: "Even a small difference in expense ratio can significantly impact long-term returns due to compounding. A 1 percent higher expense ratio on a Rs. 10 lakh investment over 20 years can cost several lakhs in lost returns." },
  ],
  formula: "Net Return = Gross Return - Expense Ratio; Net Value = Investment x (1 + Net Return) ^ Years",
};
