import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salesRevenueCalculator: CalculatorDefinition = {
  slug: "sales-revenue-calculator",
  title: "Sales Revenue Calculator",
  description: "Free sales revenue calculator. Calculate total revenue, average revenue per sale, and project future sales revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sales revenue calculator", "revenue calculator", "total sales calculator", "sales forecast calculator", "revenue projection"],
  variants: [
    {
      id: "total",
      name: "Total Sales Revenue",
      description: "Calculate total revenue from units sold and price",
      fields: [
        { name: "unitsSold", label: "Units Sold", type: "number", placeholder: "e.g. 1500" },
        { name: "pricePerUnit", label: "Average Price per Unit", type: "number", placeholder: "e.g. 49.99", prefix: "$", step: 0.01 },
        { name: "returns", label: "Returns/Refunds", type: "number", placeholder: "e.g. 50", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const units = inputs.unitsSold as number;
        const price = inputs.pricePerUnit as number;
        const returns = (inputs.returns as number) || 0;
        if (!units || !price) return null;
        const grossRevenue = units * price;
        const returnsValue = returns * price;
        const netRevenue = grossRevenue - returnsValue;
        const returnRate = (returns / units) * 100;
        return {
          primary: { label: "Net Sales Revenue", value: `$${formatNumber(netRevenue)}` },
          details: [
            { label: "Gross Revenue", value: `$${formatNumber(grossRevenue)}` },
            { label: "Returns/Refunds", value: `$${formatNumber(returnsValue)}` },
            { label: "Units Sold", value: formatNumber(units, 0) },
            { label: "Return Rate", value: `${formatNumber(returnRate)}%` },
          ],
        };
      },
    },
    {
      id: "projection",
      name: "Revenue Projection",
      description: "Project future revenue based on current sales data",
      fields: [
        { name: "currentRevenue", label: "Current Period Revenue", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "currentPeriod", label: "Current Period", type: "select", options: [
          { label: "Daily", value: "1" },
          { label: "Weekly", value: "7" },
          { label: "Monthly", value: "30" },
          { label: "Quarterly", value: "90" },
        ], defaultValue: "30" },
        { name: "growthRate", label: "Expected Growth Rate", type: "number", placeholder: "e.g. 5", suffix: "%" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.currentRevenue as number;
        const periodDays = parseInt(inputs.currentPeriod as string) || 30;
        const growth = (inputs.growthRate as number) || 0;
        if (!revenue) return null;
        const dailyRevenue = revenue / periodDays;
        const monthlyRevenue = dailyRevenue * 30;
        const annualRevenue = dailyRevenue * 365;
        const projectedAnnual = annualRevenue * (1 + growth / 100);
        return {
          primary: { label: "Projected Annual Revenue", value: `$${formatNumber(projectedAnnual)}` },
          details: [
            { label: "Daily Revenue", value: `$${formatNumber(dailyRevenue)}` },
            { label: "Monthly Revenue", value: `$${formatNumber(monthlyRevenue)}` },
            { label: "Annual Revenue (current)", value: `$${formatNumber(annualRevenue)}` },
            { label: "Growth Rate", value: `${formatNumber(growth)}%` },
          ],
        };
      },
    },
    {
      id: "perSale",
      name: "Average Revenue per Sale",
      description: "Calculate average revenue per transaction",
      fields: [
        { name: "totalRevenue", label: "Total Revenue", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "totalTransactions", label: "Total Transactions", type: "number", placeholder: "e.g. 2500" },
        { name: "period", label: "Time Period", type: "select", options: [
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "Annually", value: "annually" },
        ], defaultValue: "monthly" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.totalRevenue as number;
        const transactions = inputs.totalTransactions as number;
        if (!revenue || !transactions) return null;
        const avgPerSale = revenue / transactions;
        return {
          primary: { label: "Average Revenue per Sale", value: `$${formatNumber(avgPerSale)}` },
          details: [
            { label: "Total Revenue", value: `$${formatNumber(revenue)}` },
            { label: "Total Transactions", value: formatNumber(transactions, 0) },
            { label: "Revenue per Sale", value: `$${formatNumber(avgPerSale)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["profit-margin-calculator", "break-even-point-calculator", "roi-calculator"],
  faq: [
    { question: "How do you calculate sales revenue?", answer: "Sales Revenue = Number of Units Sold × Average Selling Price. Net Revenue subtracts returns and allowances. For services, Revenue = Number of Clients × Average Service Price." },
    { question: "What is the difference between gross and net revenue?", answer: "Gross revenue is total sales before any deductions. Net revenue subtracts returns, refunds, allowances, and discounts. Net revenue gives a more accurate picture of actual money earned from sales." },
    { question: "How do I project future revenue?", answer: "Projected Revenue = Current Revenue × (1 + Growth Rate). Use historical data, market trends, and sales pipeline to estimate growth rate. Be conservative in projections and account for seasonality." },
  ],
  formula: "Revenue = Units Sold × Price per Unit | Net Revenue = Gross Revenue - Returns | Projected Revenue = Current Revenue × (1 + Growth Rate)",
};
