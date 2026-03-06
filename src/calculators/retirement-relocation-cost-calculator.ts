import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementRelocationCostCalculator: CalculatorDefinition = {
  slug: "retirement-relocation-cost-calculator",
  title: "Retirement Relocation Cost Calculator",
  description: "Compare the financial impact of relocating in retirement by analyzing differences in housing costs, taxes, healthcare, and cost of living between two locations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement relocation","retirement moving cost","retire in another state","retirement cost of living comparison"],
  variants: [{
    id: "standard",
    name: "Retirement Relocation Cost",
    description: "Compare the financial impact of relocating in retirement by analyzing differences in housing costs, taxes, healthcare, and cost of living between two locations.",
    fields: [
      { name: "currentMonthlyExpenses", label: "Current Monthly Expenses ($)", type: "number", min: 1000, max: 30000, defaultValue: 5000 },
      { name: "costOfLivingDiff", label: "New Location Cost of Living Difference (%)", type: "number", min: -50, max: 50, defaultValue: -15 },
      { name: "currentHomeValue", label: "Current Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 400000 },
      { name: "newHomePrice", label: "New Home Price ($)", type: "number", min: 50000, max: 5000000, defaultValue: 300000 },
      { name: "movingCosts", label: "Moving and Transition Costs ($)", type: "number", min: 0, max: 100000, defaultValue: 15000 },
      { name: "yearsInRetirement", label: "Years in Retirement", type: "number", min: 5, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const currentExp = inputs.currentMonthlyExpenses as number;
    const colDiff = inputs.costOfLivingDiff as number / 100;
    const currentHome = inputs.currentHomeValue as number;
    const newHome = inputs.newHomePrice as number;
    const moving = inputs.movingCosts as number;
    const years = inputs.yearsInRetirement as number;
    const newMonthlyExp = currentExp * (1 + colDiff);
    const monthlySavings = currentExp - newMonthlyExp;
    const annualSavings = monthlySavings * 12;
    const homeEquityFreed = currentHome - newHome;
    const totalSavingsOverTime = annualSavings * years + homeEquityFreed - moving;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil((moving - homeEquityFreed) / monthlySavings) : 0;
    return {
      primary: { label: "Total Financial Impact", value: "$" + formatNumber(Math.round(totalSavingsOverTime)) },
      details: [
        { label: "New Monthly Expenses", value: "$" + formatNumber(Math.round(newMonthlyExp)) },
        { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Home Equity Freed Up", value: "$" + formatNumber(Math.round(homeEquityFreed)) },
        { label: "Moving Costs", value: "$" + formatNumber(Math.round(moving)) },
        { label: "Break-Even Period", value: breakEvenMonths > 0 ? formatNumber(breakEvenMonths) + " months" : "Immediate savings" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","senior-housing-cost-comparison-calculator"],
  faq: [
    { question: "What are the best states to retire in for low taxes?", answer: "States with no income tax include Florida, Texas, Nevada, Wyoming, Washington, Alaska, South Dakota, Tennessee, and New Hampshire. However, consider total tax burden including property taxes, sales tax, and estate taxes when comparing." },
    { question: "What costs should I consider when relocating in retirement?", answer: "Beyond the obvious moving costs, consider differences in property taxes, income taxes, sales taxes, healthcare costs, insurance rates, utility costs, and proximity to family. Also factor in potential changes to your social network and lifestyle." },
    { question: "How do I calculate cost of living differences?", answer: "Use cost of living indices from the Bureau of Economic Analysis or online calculators. These compare expenses like housing, food, transportation, healthcare, and utilities. A negative percentage means the new location is less expensive." },
  ],
  formula: "New Monthly Expenses = Current x (1 + Cost of Living Difference %); Monthly Savings = Current - New Expenses; Total Impact = (Annual Savings x Years) + Home Equity Freed - Moving Costs",
};
