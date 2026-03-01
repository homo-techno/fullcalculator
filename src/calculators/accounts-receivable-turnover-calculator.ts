import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const accountsReceivableTurnoverCalculator: CalculatorDefinition = {
  slug: "accounts-receivable-turnover-calculator",
  title: "Accounts Receivable Turnover Calculator",
  description: "Measure how efficiently a business collects payments from customers by calculating the AR turnover ratio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["accounts receivable turnover","AR collection","receivables ratio"],
  variants: [{
    id: "standard",
    name: "Accounts Receivable Turnover",
    description: "Measure how efficiently a business collects payments from customers by calculating the AR turnover ratio.",
    fields: [
      { name: "netCreditSales", label: "Net Credit Sales", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 1000000 },
      { name: "beginningAR", label: "Beginning Accounts Receivable", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 100000 },
      { name: "endingAR", label: "Ending Accounts Receivable", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 150000 },
    ],
    calculate: (inputs) => {
      const sales = inputs.netCreditSales as number;
      const beginAR = inputs.beginningAR as number;
      const endAR = inputs.endingAR as number;
      if (!sales || (beginAR + endAR) <= 0) return null;
      const avgAR = (beginAR + endAR) / 2;
      const turnoverRatio = sales / avgAR;
      const daysToCollect = 365 / turnoverRatio;
      return {
        primary: { label: "AR Turnover Ratio", value: formatNumber(Math.round(turnoverRatio * 100) / 100) + "x" },
        details: [
          { label: "Days Sales Outstanding", value: formatNumber(Math.round(daysToCollect)) + " days" },
          { label: "Average Accounts Receivable", value: "$" + formatNumber(Math.round(avgAR)) },
          { label: "Net Credit Sales", value: "$" + formatNumber(Math.round(sales)) },
        ],
      };
    },
  }],
  relatedSlugs: ["inventory-turnover-calculator","churn-rate-calculator"],
  faq: [
    { question: "What is a good accounts receivable turnover ratio?", answer: "A higher ratio indicates faster collection. Most businesses aim for a ratio between 7 and 12, meaning they collect receivables every 30 to 50 days. The ideal ratio depends on industry payment norms." },
    { question: "What does a low AR turnover ratio indicate?", answer: "A low ratio suggests that a business is taking too long to collect payments. This can lead to cash flow problems and may indicate weak credit policies or issues with customer payment behavior." },
  ],
  formula: "AR Turnover = Net Credit Sales / Average Accounts Receivable; DSO = 365 / AR Turnover",
};
