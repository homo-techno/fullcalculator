import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saasPricingCalculator: CalculatorDefinition = {
  slug: "saas-pricing-calculator",
  title: "SaaS Pricing Calculator",
  description: "Calculate optimal SaaS subscription pricing tiers based on cost structure, target margin, and user count.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["SaaS pricing", "SaaS pricing strategy", "subscription pricing calculator"],
  variants: [{
    id: "standard",
    name: "SaaS Pricing",
    description: "Calculate optimal SaaS subscription pricing tiers based on cost structure, target margin, and user count",
    fields: [
      { name: "monthlyCostPerUser", label: "Monthly Cost per User (infrastructure)", type: "number", prefix: "$", min: 0.1, max: 100, step: 0.1, defaultValue: 5 },
      { name: "targetMargin", label: "Target Gross Margin", type: "number", suffix: "%", min: 50, max: 95, step: 5, defaultValue: 80 },
      { name: "users", label: "Expected Users", type: "number", suffix: "users", min: 10, max: 1000000, step: 100, defaultValue: 1000 },
      { name: "supportCostPerUser", label: "Monthly Support Cost per User", type: "number", prefix: "$", min: 0, max: 50, step: 0.5, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const costPerUser = inputs.monthlyCostPerUser as number;
      const margin = (inputs.targetMargin as number) / 100;
      const users = inputs.users as number;
      const supportCost = inputs.supportCostPerUser as number;
      if (!costPerUser || !users || users <= 0) return null;
      const totalCostPerUser = costPerUser + supportCost;
      const monthlyPrice = totalCostPerUser / (1 - margin);
      const annualPrice = monthlyPrice * 12 * 0.85;
      const monthlyRevenue = monthlyPrice * users;
      const annualRevenue = monthlyRevenue * 12;
      const monthlyProfit = monthlyRevenue - (totalCostPerUser * users);
      return {
        primary: { label: "Recommended Monthly Price", value: "$" + formatNumber(Math.round(monthlyPrice * 100) / 100) + "/user" },
        details: [
          { label: "Annual Price (15% discount)", value: "$" + formatNumber(Math.round(annualPrice * 100) / 100) + "/user/year" },
          { label: "Projected Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
          { label: "Monthly Gross Profit", value: "$" + formatNumber(Math.round(monthlyProfit)) },
        ],
      };
    },
  }],
  relatedSlugs: ["app-development-cost-calculator", "cloud-cost-calculator"],
  faq: [
    { question: "How do you price a SaaS product?", answer: "SaaS pricing is typically based on the cost to serve each user plus a target gross margin of 70 to 85 percent. Common models include per-user pricing, tiered plans, and usage-based billing." },
    { question: "Should I offer annual pricing discounts?", answer: "Annual pricing discounts of 10 to 20 percent are standard in SaaS. They improve cash flow, reduce churn, and increase customer lifetime value." },
  ],
  formula: "Monthly Price = Total Cost per User / (1 - Target Margin)",
};
