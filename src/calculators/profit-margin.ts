import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const profitMarginCalculator: CalculatorDefinition = {
  slug: "profit-margin-calculator",
  title: "Profit Margin Calculator",
  description: "Free profit margin calculator. Calculate gross, net, and operating profit margins for your business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["profit margin calculator", "gross profit margin", "net profit margin", "operating margin", "profit margin formula"],
  variants: [
    {
      id: "gross",
      name: "Gross Profit Margin",
      description: "Calculate gross profit margin from revenue and cost of goods sold",
      fields: [
        { name: "revenue", label: "Total Revenue", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "cogs", label: "Cost of Goods Sold (COGS)", type: "number", placeholder: "e.g. 300000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.revenue as number;
        const cogs = inputs.cogs as number;
        if (!revenue || cogs === undefined) return null;
        const grossProfit = revenue - cogs;
        const grossMargin = (grossProfit / revenue) * 100;
        return {
          primary: { label: "Gross Profit Margin", value: formatNumber(grossMargin), suffix: "%" },
          details: [
            { label: "Gross Profit", value: `$${formatNumber(grossProfit)}` },
            { label: "Revenue", value: `$${formatNumber(revenue)}` },
            { label: "COGS", value: `$${formatNumber(cogs)}` },
          ],
        };
      },
    },
    {
      id: "net",
      name: "Net Profit Margin",
      description: "Calculate net profit margin after all expenses, interest, and taxes",
      fields: [
        { name: "revenue", label: "Total Revenue", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "cogs", label: "Cost of Goods Sold", type: "number", placeholder: "e.g. 300000", prefix: "$" },
        { name: "operating", label: "Operating Expenses", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "interest", label: "Interest Expense", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "taxes", label: "Taxes", type: "number", placeholder: "e.g. 22000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.revenue as number;
        const cogs = (inputs.cogs as number) || 0;
        const operating = (inputs.operating as number) || 0;
        const interest = (inputs.interest as number) || 0;
        const taxes = (inputs.taxes as number) || 0;
        if (!revenue) return null;
        const totalExpenses = cogs + operating + interest + taxes;
        const netProfit = revenue - totalExpenses;
        const netMargin = (netProfit / revenue) * 100;
        const grossMargin = ((revenue - cogs) / revenue) * 100;
        const operatingMargin = ((revenue - cogs - operating) / revenue) * 100;
        return {
          primary: { label: "Net Profit Margin", value: formatNumber(netMargin), suffix: "%" },
          details: [
            { label: "Net Profit", value: `$${formatNumber(netProfit)}` },
            { label: "Gross Margin", value: `${formatNumber(grossMargin)}%` },
            { label: "Operating Margin", value: `${formatNumber(operatingMargin)}%` },
            { label: "Total Expenses", value: `$${formatNumber(totalExpenses)}` },
          ],
        };
      },
    },
    {
      id: "operating",
      name: "Operating Profit Margin",
      description: "Calculate operating profit margin (EBIT margin)",
      fields: [
        { name: "revenue", label: "Total Revenue", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "cogs", label: "Cost of Goods Sold", type: "number", placeholder: "e.g. 300000", prefix: "$" },
        { name: "operating", label: "Operating Expenses", type: "number", placeholder: "e.g. 80000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.revenue as number;
        const cogs = (inputs.cogs as number) || 0;
        const operating = (inputs.operating as number) || 0;
        if (!revenue) return null;
        const operatingProfit = revenue - cogs - operating;
        const operatingMargin = (operatingProfit / revenue) * 100;
        const grossMargin = ((revenue - cogs) / revenue) * 100;
        return {
          primary: { label: "Operating Margin (EBIT)", value: formatNumber(operatingMargin), suffix: "%" },
          details: [
            { label: "Operating Profit", value: `$${formatNumber(operatingProfit)}` },
            { label: "Gross Margin", value: `${formatNumber(grossMargin)}%` },
            { label: "Revenue", value: `$${formatNumber(revenue)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["margin-calculator", "markup-calculator", "roi-calculator"],
  faq: [
    { question: "What is the difference between gross, operating, and net profit margin?", answer: "Gross margin = (Revenue - COGS) / Revenue. Operating margin = (Revenue - COGS - Operating Expenses) / Revenue (also called EBIT margin). Net margin = (Revenue - All Expenses including taxes and interest) / Revenue. Each level removes more costs." },
    { question: "What is a good profit margin?", answer: "It varies by industry. Retail: 2-5% net. Software/SaaS: 20-40% net. Manufacturing: 5-10% net. Restaurants: 3-9% net. Service businesses: 15-25% net. Compare your margins to industry benchmarks for the best assessment." },
    { question: "How can I improve my profit margin?", answer: "Increase prices, reduce COGS through better supplier deals, cut unnecessary operating expenses, improve operational efficiency, focus on higher-margin products/services, and reduce overhead costs." },
  ],
  formula: "Gross Margin = (Revenue - COGS) / Revenue × 100 | Operating Margin = (Revenue - COGS - OpEx) / Revenue × 100 | Net Margin = Net Income / Revenue × 100",
};
