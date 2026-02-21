import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashFlowCalculator: CalculatorDefinition = {
  slug: "cash-flow-calculator",
  title: "Cash Flow Calculator",
  description:
    "Free personal cash flow calculator. Track your monthly income vs expenses to calculate net cash flow and savings rate. Identify where your money goes each month.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cash flow calculator",
    "personal cash flow",
    "monthly cash flow calculator",
    "income vs expenses calculator",
    "money flow calculator",
  ],
  variants: [
    {
      id: "personal-cashflow",
      name: "Monthly Cash Flow",
      description: "Calculate your monthly net cash flow from income and expenses",
      fields: [
        {
          name: "monthlyIncome",
          label: "Monthly Take-Home Income",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "otherIncome",
          label: "Other Monthly Income",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "rent",
          label: "Rent / Mortgage",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          min: 0,
        },
        {
          name: "utilities",
          label: "Utilities (electric, water, internet)",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
        {
          name: "food",
          label: "Groceries & Dining",
          type: "number",
          placeholder: "e.g. 600",
          prefix: "$",
          min: 0,
        },
        {
          name: "transport",
          label: "Transportation (car, gas, transit)",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          min: 0,
        },
        {
          name: "insurance",
          label: "Insurance (health, auto, etc.)",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          min: 0,
        },
        {
          name: "debtPayments",
          label: "Debt Payments (loans, credit cards)",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          min: 0,
        },
        {
          name: "subscriptions",
          label: "Subscriptions & Entertainment",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
        },
        {
          name: "otherExpenses",
          label: "Other Expenses",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const income = (inputs.monthlyIncome as number) || 0;
        const otherIncome = (inputs.otherIncome as number) || 0;
        const rent = (inputs.rent as number) || 0;
        const utilities = (inputs.utilities as number) || 0;
        const food = (inputs.food as number) || 0;
        const transport = (inputs.transport as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const debtPayments = (inputs.debtPayments as number) || 0;
        const subscriptions = (inputs.subscriptions as number) || 0;
        const other = (inputs.otherExpenses as number) || 0;

        const totalIncome = income + otherIncome;
        if (!totalIncome) return null;

        const totalExpenses = rent + utilities + food + transport + insurance + debtPayments + subscriptions + other;
        const netCashFlow = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;
        const annualSavings = netCashFlow * 12;

        // Expense breakdown percentages
        const pct = (val: number) => totalIncome > 0 ? formatNumber((val / totalIncome) * 100, 1) : "0";

        // Needs vs wants
        const needs = rent + utilities + food + transport + insurance + debtPayments;
        const wants = subscriptions + other;

        return {
          primary: {
            label: "Monthly Net Cash Flow",
            value: `$${formatNumber(netCashFlow)}`,
          },
          details: [
            { label: "Total monthly income", value: `$${formatNumber(totalIncome)}` },
            { label: "Total monthly expenses", value: `$${formatNumber(totalExpenses)}` },
            { label: "Savings rate", value: `${formatNumber(savingsRate, 1)}%` },
            { label: "Annual net savings", value: `$${formatNumber(annualSavings)}` },
            { label: "--- Expense Breakdown ---", value: "" },
            { label: `Housing (${pct(rent)}%)`, value: `$${formatNumber(rent)}` },
            { label: `Utilities (${pct(utilities)}%)`, value: `$${formatNumber(utilities)}` },
            { label: `Food (${pct(food)}%)`, value: `$${formatNumber(food)}` },
            { label: `Transportation (${pct(transport)}%)`, value: `$${formatNumber(transport)}` },
            { label: `Insurance (${pct(insurance)}%)`, value: `$${formatNumber(insurance)}` },
            { label: `Debt payments (${pct(debtPayments)}%)`, value: `$${formatNumber(debtPayments)}` },
            { label: `Subscriptions (${pct(subscriptions)}%)`, value: `$${formatNumber(subscriptions)}` },
            { label: `Other (${pct(other)}%)`, value: `$${formatNumber(other)}` },
            { label: "Needs total", value: `$${formatNumber(needs)}` },
            { label: "Wants total", value: `$${formatNumber(wants)}` },
          ],
          note: netCashFlow < 0
            ? "Your expenses exceed your income. Look for areas to cut spending or increase income to achieve positive cash flow."
            : savingsRate >= 20
              ? "Great job! You are saving 20% or more of your income, meeting the recommended savings target."
              : "Aim to save at least 20% of your income. Look for expenses you can reduce to boost your savings rate.",
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "rent-affordability-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "What is cash flow?",
      answer:
        "Cash flow is the difference between your total income and total expenses over a period. Positive cash flow means you have money left over to save or invest. Negative cash flow means you are spending more than you earn and need to adjust your budget.",
    },
    {
      question: "What is a good savings rate?",
      answer:
        "Financial experts generally recommend saving at least 20% of your after-tax income (the 50/30/20 rule). For aggressive savers targeting early retirement, 30-50% is common. Even 10% is a good starting point if 20% is not yet achievable.",
    },
    {
      question: "How can I improve my cash flow?",
      answer:
        "Reduce expenses by cutting subscriptions, cooking more meals at home, shopping around for insurance, and refinancing high-interest debt. Increase income through raises, side work, or selling unused items. Track every expense for a month to identify areas to optimize.",
    },
  ],
  formula:
    "Net Cash Flow = Total Income - Total Expenses. Savings Rate = Net Cash Flow / Total Income × 100. Annual Savings = Net Cash Flow × 12.",
};
