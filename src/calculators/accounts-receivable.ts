import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const accountsReceivableCalculator: CalculatorDefinition = {
  slug: "accounts-receivable-calculator",
  title: "Accounts Receivable Calculator",
  description: "Free accounts receivable turnover calculator. Calculate AR turnover ratio, days sales outstanding (DSO), and collection efficiency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["accounts receivable calculator", "AR turnover", "days sales outstanding", "DSO calculator", "collection period calculator"],
  variants: [
    {
      id: "turnover",
      name: "AR Turnover Ratio",
      description: "Calculate how efficiently receivables are collected",
      fields: [
        { name: "netCreditSales", label: "Net Credit Sales (annual)", type: "number", placeholder: "e.g. 1000000", prefix: "$" },
        { name: "beginningAR", label: "Beginning Accounts Receivable", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "endingAR", label: "Ending Accounts Receivable", type: "number", placeholder: "e.g. 120000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const sales = inputs.netCreditSales as number;
        const beginAR = inputs.beginningAR as number;
        const endAR = inputs.endingAR as number;
        if (!sales || beginAR === undefined || endAR === undefined) return null;
        const avgAR = (beginAR + endAR) / 2;
        if (avgAR <= 0) return null;
        const turnover = sales / avgAR;
        const dso = 365 / turnover;
        return {
          primary: { label: "AR Turnover Ratio", value: `${formatNumber(turnover, 2)}x` },
          details: [
            { label: "Days Sales Outstanding (DSO)", value: `${formatNumber(dso, 1)} days` },
            { label: "Average AR", value: `$${formatNumber(avgAR)}` },
            { label: "Net Credit Sales", value: `$${formatNumber(sales)}` },
            { label: "Collections per Month", value: formatNumber(turnover / 12, 2) },
          ],
        };
      },
    },
    {
      id: "dso",
      name: "Days Sales Outstanding",
      description: "Calculate the average number of days to collect payment",
      fields: [
        { name: "accountsReceivable", label: "Accounts Receivable Balance", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "totalCreditSales", label: "Total Credit Sales", type: "number", placeholder: "e.g. 1000000", prefix: "$" },
        { name: "periodDays", label: "Period (days)", type: "select", options: [
          { label: "Monthly (30 days)", value: "30" },
          { label: "Quarterly (90 days)", value: "90" },
          { label: "Annual (365 days)", value: "365" },
        ], defaultValue: "365" },
      ],
      calculate: (inputs) => {
        const ar = inputs.accountsReceivable as number;
        const sales = inputs.totalCreditSales as number;
        const days = parseInt(inputs.periodDays as string) || 365;
        if (!ar || !sales) return null;
        const dso = (ar / sales) * days;
        const turnover = sales / ar;
        const dailySales = sales / days;
        return {
          primary: { label: "Days Sales Outstanding", value: `${formatNumber(dso, 1)} days` },
          details: [
            { label: "AR Turnover", value: `${formatNumber(turnover, 2)}x` },
            { label: "Daily Credit Sales", value: `$${formatNumber(dailySales)}` },
            { label: "AR Balance", value: `$${formatNumber(ar)}` },
            { label: "Period Sales", value: `$${formatNumber(sales)}` },
          ],
        };
      },
    },
    {
      id: "collectionEfficiency",
      name: "Collection Effectiveness Index",
      description: "Measure how effectively outstanding receivables are collected",
      fields: [
        { name: "beginningAR", label: "Beginning AR", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "creditSales", label: "Credit Sales (period)", type: "number", placeholder: "e.g. 200000", prefix: "$" },
        { name: "endingAR", label: "Ending Total AR", type: "number", placeholder: "e.g. 120000", prefix: "$" },
        { name: "endingCurrent", label: "Ending Current AR (not past due)", type: "number", placeholder: "e.g. 80000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const beginAR = inputs.beginningAR as number;
        const sales = inputs.creditSales as number;
        const endAR = inputs.endingAR as number;
        const endCurrent = inputs.endingCurrent as number;
        if (!beginAR || !sales || endAR === undefined || endCurrent === undefined) return null;
        const cei = ((beginAR + sales - endAR) / (beginAR + sales - endCurrent)) * 100;
        const collected = beginAR + sales - endAR;
        const pastDue = endAR - endCurrent;
        return {
          primary: { label: "Collection Effectiveness Index", value: formatNumber(cei), suffix: "%" },
          details: [
            { label: "Amount Collected", value: `$${formatNumber(collected)}` },
            { label: "Past Due AR", value: `$${formatNumber(pastDue)}` },
            { label: "Current AR", value: `$${formatNumber(endCurrent)}` },
            { label: "Total Ending AR", value: `$${formatNumber(endAR)}` },
          ],
          note: "A CEI above 80% is good. Above 90% is excellent.",
        };
      },
    },
  ],
  relatedSlugs: ["working-capital-calculator", "cash-flow-calculator", "inventory-turnover-calculator"],
  faq: [
    { question: "What is a good AR turnover ratio?", answer: "Higher is better. 10-12x (collecting every 30-36 days) is considered good. Above 12x is excellent. Below 6x (60+ days) suggests collection problems. Compare against industry benchmarks and your payment terms." },
    { question: "What does Days Sales Outstanding (DSO) tell you?", answer: "DSO measures the average days to collect payment after a sale. If your payment terms are Net 30, a DSO of 35-40 days is normal. A DSO significantly above your terms indicates slow collection." },
    { question: "How can I improve AR turnover?", answer: "Invoice promptly, offer early payment discounts (e.g., 2/10 Net 30), implement clear credit policies, follow up on overdue accounts quickly, use automated reminders, and consider factoring for chronic late payers." },
  ],
  formula: "AR Turnover = Net Credit Sales / Average AR | DSO = (AR / Credit Sales) × Days in Period | CEI = (Beginning AR + Sales - Ending AR) / (Beginning AR + Sales - Current AR) × 100",
};
