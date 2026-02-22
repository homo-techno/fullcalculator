import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dollarCostAveragingCalculator: CalculatorDefinition = {
  slug: "dollar-cost-averaging-calculator",
  title: "Dollar Cost Averaging Calculator",
  description: "Free dollar cost averaging (DCA) calculator. Calculate your average cost per share and total return from regular periodic investments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dollar cost averaging", "DCA", "periodic investment", "average cost", "investment strategy", "DCA calculator"],
  variants: [
    {
      id: "basic",
      name: "DCA Results",
      description: "Calculate DCA results from periodic investments",
      fields: [
        { name: "investmentAmount", label: "Amount per Period", type: "number", prefix: "$", placeholder: "e.g. 500" },
        { name: "periods", label: "Number of Periods", type: "number", placeholder: "e.g. 12" },
        { name: "startPrice", label: "Starting Share Price", type: "number", prefix: "$", placeholder: "e.g. 50" },
        { name: "endPrice", label: "Ending Share Price", type: "number", prefix: "$", placeholder: "e.g. 65" },
        { name: "avgPrice", label: "Average Price During Period", type: "number", prefix: "$", placeholder: "e.g. 55" },
      ],
      calculate: (inputs) => {
        const amount = inputs.investmentAmount as number;
        const periods = inputs.periods as number;
        const startPrice = inputs.startPrice as number;
        const endPrice = inputs.endPrice as number;
        const avgPrice = inputs.avgPrice as number;
        if (!amount || !periods || !startPrice || !endPrice || !avgPrice) return null;
        const totalInvested = amount * periods;
        const totalShares = totalInvested / avgPrice;
        const currentValue = totalShares * endPrice;
        const profit = currentValue - totalInvested;
        const roi = (profit / totalInvested) * 100;
        const lumpSumShares = totalInvested / startPrice;
        const lumpSumValue = lumpSumShares * endPrice;
        return {
          primary: { label: "Average Cost Per Share", value: `$${formatNumber(avgPrice, 2)}` },
          details: [
            { label: "Total invested", value: `$${formatNumber(totalInvested, 2)}` },
            { label: "Total shares acquired", value: formatNumber(totalShares, 4) },
            { label: "Current value", value: `$${formatNumber(currentValue, 2)}` },
            { label: "Profit/Loss", value: `$${formatNumber(profit, 2)}` },
            { label: "ROI", value: `${formatNumber(roi, 2)}%` },
            { label: "Lump sum value (comparison)", value: `$${formatNumber(lumpSumValue, 2)}` },
          ],
        };
      },
    },
    {
      id: "fixedAmount",
      name: "DCA vs Lump Sum",
      description: "Compare DCA with lump sum investing",
      fields: [
        { name: "totalAmount", label: "Total Amount to Invest", type: "number", prefix: "$", placeholder: "e.g. 12000" },
        { name: "periods", label: "Number of DCA Periods", type: "number", placeholder: "e.g. 12" },
        { name: "startPrice", label: "Price at Start", type: "number", prefix: "$", placeholder: "e.g. 100" },
        { name: "endPrice", label: "Price at End", type: "number", prefix: "$", placeholder: "e.g. 120" },
        { name: "annualReturn", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalAmount as number;
        const periods = inputs.periods as number;
        const startPrice = inputs.startPrice as number;
        const endPrice = inputs.endPrice as number;
        const annualReturn = (inputs.annualReturn as number) / 100;
        if (!total || !periods || !startPrice || !endPrice) return null;
        const perPeriod = total / periods;
        const lumpSumShares = total / startPrice;
        const lumpSumValue = lumpSumShares * endPrice;
        const lumpSumReturn = ((lumpSumValue - total) / total) * 100;
        const periodReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
        let dcaValue = 0;
        for (let i = 0; i < periods; i++) {
          dcaValue = (dcaValue + perPeriod) * (1 + periodReturn);
        }
        const dcaReturn = ((dcaValue - total) / total) * 100;
        return {
          primary: { label: "DCA Final Value", value: `$${formatNumber(dcaValue, 2)}` },
          details: [
            { label: "Lump sum final value", value: `$${formatNumber(lumpSumValue, 2)}` },
            { label: "DCA return", value: `${formatNumber(dcaReturn, 2)}%` },
            { label: "Lump sum return", value: `${formatNumber(lumpSumReturn, 2)}%` },
            { label: "Amount per period", value: `$${formatNumber(perPeriod, 2)}` },
            { label: "Better strategy", value: dcaValue > lumpSumValue ? "DCA" : "Lump Sum" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stock-average-calculator", "compound-interest-calculator", "sip-calculator"],
  faq: [
    { question: "What is dollar cost averaging?", answer: "Dollar cost averaging (DCA) is an investment strategy where you invest a fixed dollar amount at regular intervals regardless of the asset's price. You buy more shares when prices are low and fewer when prices are high, potentially lowering your average cost." },
    { question: "Is DCA better than lump sum investing?", answer: "Historically, lump sum investing outperforms DCA about two-thirds of the time because markets tend to go up over time. However, DCA reduces the risk of investing at a market peak and is psychologically easier for many investors." },
    { question: "How often should I invest with DCA?", answer: "Common DCA intervals are weekly, bi-weekly, or monthly. Monthly is most popular because it aligns with pay schedules. The key is consistency rather than frequency." },
  ],
  formula: "Average Cost = Total Invested / Total Shares | Total Shares = Sum(Investment / Price at each period)",
};
