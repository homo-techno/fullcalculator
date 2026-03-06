import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantProfitMarginCalculator: CalculatorDefinition = {
  slug: "restaurant-profit-margin-calculator",
  title: "Restaurant Profit Margin Calculator",
  description: "Calculate your restaurant net profit margin by entering revenue, food costs, labor costs, rent, and other operating expenses to see profitability at a glance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["restaurant profit margin","restaurant profitability","food business profit","restaurant net margin"],
  variants: [{
    id: "standard",
    name: "Restaurant Profit Margin",
    description: "Calculate your restaurant net profit margin by entering revenue, food costs, labor costs, rent, and other operating expenses to see profitability at a glance.",
    fields: [
      { name: "monthlyRevenue", label: "Monthly Revenue ($)", type: "number", min: 1000, max: 5000000, defaultValue: 80000 },
      { name: "foodCost", label: "Food and Beverage Cost ($)", type: "number", min: 0, max: 3000000, defaultValue: 24000 },
      { name: "laborCost", label: "Labor Cost ($)", type: "number", min: 0, max: 3000000, defaultValue: 22400 },
      { name: "rentUtilities", label: "Rent and Utilities ($)", type: "number", min: 0, max: 500000, defaultValue: 8000 },
      { name: "otherExpenses", label: "Other Operating Expenses ($)", type: "number", min: 0, max: 500000, defaultValue: 6000 },
    ],
    calculate: (inputs) => {
    const revenue = inputs.monthlyRevenue as number;
    const food = inputs.foodCost as number;
    const labor = inputs.laborCost as number;
    const rent = inputs.rentUtilities as number;
    const other = inputs.otherExpenses as number;
    const totalExpenses = food + labor + rent + other;
    const netProfit = revenue - totalExpenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const foodPct = revenue > 0 ? (food / revenue) * 100 : 0;
    const laborPct = revenue > 0 ? (labor / revenue) * 100 : 0;
    return {
      primary: { label: "Net Profit Margin", value: formatNumber(Math.round(profitMargin * 100) / 100) + "%" },
      details: [
        { label: "Monthly Net Profit", value: "$" + formatNumber(Math.round(netProfit)) },
        { label: "Annual Net Profit (est.)", value: "$" + formatNumber(Math.round(netProfit * 12)) },
        { label: "Food Cost Percentage", value: formatNumber(Math.round(foodPct * 10) / 10) + "%" },
        { label: "Labor Cost Percentage", value: formatNumber(Math.round(laborPct * 10) / 10) + "%" },
        { label: "Total Monthly Expenses", value: "$" + formatNumber(Math.round(totalExpenses)) }
      ]
    };
  },
  }],
  relatedSlugs: ["food-cost-percentage-calculator","restaurant-labor-cost-percentage-calculator"],
  faq: [
    { question: "What is a good profit margin for a restaurant?", answer: "Full-service restaurants typically achieve a net profit margin of 3 to 9 percent. Fast-casual restaurants may reach 6 to 9 percent, while fine dining can vary widely from 2 to 15 percent depending on volume and pricing." },
    { question: "How can I improve my restaurant profit margin?", answer: "Focus on controlling food waste, optimizing labor scheduling, negotiating supplier prices, engineering your menu to promote high-margin items, and reviewing portion sizes regularly." },
    { question: "What percentage of revenue should food cost be?", answer: "Most successful restaurants keep food cost between 28 and 35 percent of revenue. Fine dining may run higher at 35 to 40 percent, while fast food aims for 25 to 30 percent." },
  ],
  formula: "Net Profit = Revenue - (Food Cost + Labor Cost + Rent/Utilities + Other Expenses)
Profit Margin = (Net Profit / Revenue) x 100",
};
