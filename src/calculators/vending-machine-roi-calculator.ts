import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vendingMachineRoiCalculator: CalculatorDefinition = {
  slug: "vending-machine-roi-calculator",
  title: "Vending Machine ROI Calculator",
  description: "Calculate the return on investment for a vending machine business based on locations, revenue, and costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vending machine ROI", "vending machine profit", "vending business return"],
  variants: [{
    id: "standard",
    name: "Vending Machine ROI",
    description: "Calculate the return on investment for a vending machine business based on locations, revenue, and costs",
    fields: [
      { name: "machines", label: "Number of Machines", type: "number", suffix: "units", min: 1, max: 50, defaultValue: 5 },
      { name: "costPerMachine", label: "Cost per Machine", type: "number", suffix: "$", min: 1000, max: 15000, defaultValue: 4000 },
      { name: "monthlyRevenue", label: "Monthly Revenue per Machine", type: "number", suffix: "$", min: 100, max: 5000, defaultValue: 800 },
      { name: "monthlyCost", label: "Monthly Cost per Machine", type: "number", suffix: "$", min: 50, max: 2000, defaultValue: 300 },
    ],
    calculate: (inputs) => {
      const machines = inputs.machines as number;
      const costPer = inputs.costPerMachine as number;
      const rev = inputs.monthlyRevenue as number;
      const cost = inputs.monthlyCost as number;
      if (!machines || !costPer || !rev) return null;
      const totalInvestment = machines * costPer;
      const monthlyProfit = machines * (rev - cost);
      const annualProfit = monthlyProfit * 12;
      const paybackMonths = monthlyProfit > 0 ? Math.ceil(totalInvestment / monthlyProfit) : 0;
      const roi = totalInvestment > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      return {
        primary: { label: "Annual ROI", value: formatNumber(roi) + "%" },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(totalInvestment) },
          { label: "Monthly Profit", value: "$" + formatNumber(monthlyProfit) },
          { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
          { label: "Payback Period", value: paybackMonths + " months" },
        ],
      };
    },
  }],
  relatedSlugs: ["laundromat-startup-calculator", "atm-business-calculator"],
  faq: [
    { question: "How much can you make from a vending machine?", answer: "A single vending machine in a good location can generate $200 to $1,000 per month in profit after restocking and maintenance costs." },
    { question: "How much does a vending machine cost?", answer: "New vending machines cost $3,000 to $10,000 depending on the type. Refurbished machines can be purchased for $1,000 to $4,000." },
  ],
  formula: "ROI = (Annual Profit / Total Investment) x 100; Payback = Investment / Monthly Profit",
};
