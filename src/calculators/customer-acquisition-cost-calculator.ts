import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const customerAcquisitionCostCalculator: CalculatorDefinition = {
  slug: "customer-acquisition-cost-calculator",
  title: "Customer Acquisition Cost Calculator",
  description: "Calculate the total cost of acquiring a new customer including all marketing and sales expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["customer acquisition cost", "CAC calculator", "cost to acquire customer"],
  variants: [{
    id: "standard",
    name: "Customer Acquisition Cost",
    description: "Calculate the total cost of acquiring a new customer including all marketing and sales expenses",
    fields: [
      { name: "marketingCost", label: "Monthly Marketing Spend", type: "number", suffix: "$", min: 100, max: 500000, defaultValue: 10000 },
      { name: "salesCost", label: "Monthly Sales Team Cost", type: "number", suffix: "$", min: 0, max: 500000, defaultValue: 15000 },
      { name: "newCustomers", label: "New Customers per Month", type: "number", suffix: "customers", min: 1, max: 10000, defaultValue: 50 },
      { name: "ltv", label: "Customer Lifetime Value", type: "number", suffix: "$", min: 50, max: 100000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const marketing = inputs.marketingCost as number;
      const sales = inputs.salesCost as number;
      const customers = inputs.newCustomers as number;
      const ltv = inputs.ltv as number;
      if (!customers) return null;
      const totalCost = marketing + sales;
      const cac = totalCost / customers;
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;
      const paybackMonths = cac > 0 && ltv > 0 ? Math.ceil(cac / (ltv / 12)) : 0;
      const annualCac = totalCost * 12;
      return {
        primary: { label: "Customer Acquisition Cost", value: "$" + formatNumber(cac) },
        details: [
          { label: "Monthly Total Spend", value: "$" + formatNumber(totalCost) },
          { label: "Annual Acquisition Spend", value: "$" + formatNumber(annualCac) },
          { label: "LTV to CAC Ratio", value: formatNumber(ltvCacRatio) + ":1" },
          { label: "CAC Payback Period", value: paybackMonths + " months" },
          { label: "Customer Lifetime Value", value: "$" + formatNumber(ltv) },
        ],
      };
    },
  }],
  relatedSlugs: ["cost-per-lead-calculator", "churn-rate-calculator"],
  faq: [
    { question: "What is a good LTV to CAC ratio?", answer: "A healthy LTV to CAC ratio is 3:1 or higher, meaning you earn three times what you spend to acquire each customer. A ratio below 1:1 means you are losing money on customer acquisition." },
    { question: "How do you calculate customer acquisition cost?", answer: "CAC equals total marketing and sales costs divided by the number of new customers acquired during that period. Include all salaries, ad spend, tools, and overhead related to acquisition." },
  ],
  formula: "CAC = (Marketing Cost + Sales Cost) / New Customers; LTV:CAC = Lifetime Value / CAC",
};
