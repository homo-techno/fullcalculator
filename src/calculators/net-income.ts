import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netIncomeCalculator: CalculatorDefinition = {
  slug: "net-income-calculator",
  title: "Net Income Calculator",
  description:
    "Free net income calculator. Calculate gross profit, operating income, and net income from revenue. See profit margins and a full income statement breakdown.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "net income calculator",
    "net profit calculator",
    "profit margin calculator",
    "income statement calculator",
    "business net income",
  ],
  variants: [
    {
      id: "net-income",
      name: "Net Income Calculator",
      description: "Calculate net income from gross revenue through all expense categories",
      fields: [
        {
          name: "grossRevenue",
          label: "Gross Revenue",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "cogs",
          label: "Cost of Goods Sold (COGS)",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          min: 0,
        },
        {
          name: "operatingExpenses",
          label: "Operating Expenses",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "otherIncome",
          label: "Other Income",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestExpense",
          label: "Interest Expense",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "taxRate",
          label: "Tax Rate",
          type: "number",
          placeholder: "e.g. 21",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
          defaultValue: 21,
        },
      ],
      calculate: (inputs) => {
        const revenue = inputs.grossRevenue as number;
        const cogs = (inputs.cogs as number) || 0;
        const opex = (inputs.operatingExpenses as number) || 0;
        const otherIncome = (inputs.otherIncome as number) || 0;
        const interest = (inputs.interestExpense as number) || 0;
        const taxRate = (inputs.taxRate as number) || 21;
        if (!revenue) return null;

        const grossProfit = revenue - cogs;
        const grossMargin = (grossProfit / revenue) * 100;

        const operatingIncome = grossProfit - opex;
        const operatingMargin = (operatingIncome / revenue) * 100;

        const ebt = operatingIncome + otherIncome - interest; // earnings before tax
        const taxes = Math.max(0, ebt * (taxRate / 100));
        const netIncome = ebt - taxes;
        const netMargin = (netIncome / revenue) * 100;

        return {
          primary: {
            label: "Net Income",
            value: `$${formatNumber(netIncome)}`,
          },
          details: [
            { label: "Gross revenue", value: `$${formatNumber(revenue)}` },
            { label: "Cost of goods sold", value: `$${formatNumber(cogs)}` },
            { label: "Gross profit", value: `$${formatNumber(grossProfit)}` },
            { label: "Gross margin", value: `${formatNumber(grossMargin, 1)}%` },
            { label: "Operating expenses", value: `$${formatNumber(opex)}` },
            { label: "Operating income (EBIT)", value: `$${formatNumber(operatingIncome)}` },
            { label: "Operating margin", value: `${formatNumber(operatingMargin, 1)}%` },
            { label: "Other income", value: `$${formatNumber(otherIncome)}` },
            { label: "Interest expense", value: `$${formatNumber(interest)}` },
            { label: "Earnings before tax", value: `$${formatNumber(ebt)}` },
            { label: "Taxes", value: `$${formatNumber(taxes)}` },
            { label: "Net income", value: `$${formatNumber(netIncome)}` },
            { label: "Net profit margin", value: `${formatNumber(netMargin, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["margin-calculator", "break-even-calculator", "roi-calculator"],
  faq: [
    {
      question: "How do you calculate net income?",
      answer:
        "Net Income = Revenue - COGS - Operating Expenses + Other Income - Interest - Taxes. Start with gross revenue, subtract cost of goods sold to get gross profit, subtract operating expenses to get operating income, then account for other income, interest, and taxes.",
    },
    {
      question: "What is a good net profit margin?",
      answer:
        "A good net profit margin varies by industry. Generally, 10%+ is considered healthy. Technology companies may see 15-25%, while retail operates on 2-5%. Manufacturing averages 5-10%. Compare within your specific industry for a meaningful benchmark.",
    },
    {
      question: "What is the difference between gross, operating, and net income?",
      answer:
        "Gross profit = Revenue - COGS (direct costs). Operating income = Gross profit - operating expenses (rent, salaries, etc.). Net income = Operating income + other income - interest - taxes. Each level shows profitability at a different stage of the business.",
    },
  ],
  formula:
    "Net Income = Revenue - COGS - Operating Expenses + Other Income - Interest Expense - Taxes. Gross Margin = Gross Profit / Revenue. Net Margin = Net Income / Revenue.",
};
