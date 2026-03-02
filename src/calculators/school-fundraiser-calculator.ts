import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const schoolFundraiserCalculator: CalculatorDefinition = {
  slug: "school-fundraiser-calculator",
  title: "School Fundraiser Calculator",
  description: "Estimate the profit from a school fundraiser based on sales and costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fundraiser","school","profit","sales","event"],
  variants: [{
    id: "standard",
    name: "School Fundraiser",
    description: "Estimate the profit from a school fundraiser based on sales and costs.",
    fields: [
      { name: "numParticipants", label: "Number of Sellers", type: "number", min: 5, max: 500, step: 5, defaultValue: 50 },
      { name: "avgSalesPerPerson", label: "Average Sales Per Person ($)", type: "number", min: 10, max: 500, step: 10, defaultValue: 80 },
      { name: "costPercent", label: "Product Cost (%)", type: "number", min: 10, max: 80, step: 5, defaultValue: 40 },
      { name: "fixedCosts", label: "Fixed Costs ($)", type: "number", min: 0, max: 2000, step: 25, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const numParticipants = inputs.numParticipants as number;
    const avgSalesPerPerson = inputs.avgSalesPerPerson as number;
    const costPercent = inputs.costPercent as number;
    const fixedCosts = inputs.fixedCosts as number;
    const totalSales = numParticipants * avgSalesPerPerson;
    const productCost = totalSales * (costPercent / 100);
    const grossProfit = totalSales - productCost;
    const netProfit = grossProfit - fixedCosts;
    const profitMargin = (netProfit / totalSales) * 100;
    return {
      primary: { label: "Net Profit", value: "$" + formatNumber(netProfit) },
      details: [
        { label: "Total Sales", value: "$" + formatNumber(totalSales) },
        { label: "Product Cost", value: "$" + formatNumber(productCost) },
        { label: "Gross Profit", value: "$" + formatNumber(grossProfit) },
        { label: "Profit Margin", value: formatNumber(profitMargin) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["field-trip-cost-calculator","yearbook-cost-calculator","prom-budget-calculator"],
  faq: [
    { question: "How much can a school fundraiser earn?", answer: "A well-organized school fundraiser can earn $2,000 to $10,000 depending on size." },
    { question: "What is the best type of school fundraiser?", answer: "Product sales, walk-a-thons, and online campaigns tend to generate the highest returns." },
  ],
  formula: "Net Profit = (Total Sales - Product Cost) - Fixed Costs",
};
