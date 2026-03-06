import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const farmProfitMarginCalculator: CalculatorDefinition = {
  slug: "farm-profit-margin-calculator",
  title: "Farm Profit Margin Calculator",
  description: "Calculate gross and net profit margins for your farm operation based on revenue, cost of production, and operating expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["farm profit margin","agriculture profit calculator","farm income calculator"],
  variants: [{
    id: "standard",
    name: "Farm Profit Margin",
    description: "Calculate gross and net profit margins for your farm operation based on revenue, cost of production, and operating expenses.",
    fields: [
      { name: "grossRevenue", label: "Gross Revenue ($)", type: "number", min: 0, max: 50000000, defaultValue: 500000 },
      { name: "costOfGoods", label: "Cost of Production ($)", type: "number", min: 0, max: 50000000, defaultValue: 280000 },
      { name: "operatingExp", label: "Operating Expenses ($)", type: "number", min: 0, max: 10000000, defaultValue: 120000 },
      { name: "debtPayments", label: "Annual Debt Payments ($)", type: "number", min: 0, max: 5000000, defaultValue: 35000 },
    ],
    calculate: (inputs) => {
      const rev = inputs.grossRevenue as number;
      const cogs = inputs.costOfGoods as number;
      const opex = inputs.operatingExp as number;
      const debt = inputs.debtPayments as number;
      if (!rev) return null;
      const grossProfit = rev - cogs;
      const grossMargin = Math.round(grossProfit / rev * 10000) / 100;
      const netIncome = grossProfit - opex - debt;
      const netMargin = Math.round(netIncome / rev * 10000) / 100;
      return {
        primary: { label: "Net Profit Margin", value: formatNumber(netMargin) + "%" },
        details: [
          { label: "Gross Profit", value: "$" + formatNumber(Math.round(grossProfit)) },
          { label: "Gross Margin", value: formatNumber(grossMargin) + "%" },
          { label: "Net Income", value: "$" + formatNumber(Math.round(netIncome)) },
          { label: "Total Expenses", value: "$" + formatNumber(Math.round(cogs + opex + debt)) },
        ],
      };
  },
  }],
  relatedSlugs: ["crop-yield-calculator","livestock-feed-calculator"],
  faq: [
    { question: "What is a good profit margin for a farm?", answer: "Farm profit margins vary widely by commodity. Crop farms typically see 10 to 25 percent net margins in good years, while livestock operations average 5 to 15 percent. Specialty crops can exceed 30 percent." },
    { question: "How can farmers improve profit margins?", answer: "Farmers can improve margins by reducing input costs, improving yields through better management, adding value through processing, diversifying income streams, and negotiating better commodity prices." },
  ],
  formula: "Gross Profit = Revenue - Cost of Production; Net Income = Gross Profit - Operating Expenses - Debt Payments; Net Margin = Net Income / Revenue x 100",
};
