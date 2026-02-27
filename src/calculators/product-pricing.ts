import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const productPricingCalculator: CalculatorDefinition = {
  slug: "product-pricing",
  title: "Product Pricing Strategy Calculator",
  description:
    "Calculate optimal product pricing using cost-plus, competitive, and value-based pricing strategies to maximize profit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "product pricing",
    "markup",
    "margin",
    "cost-plus",
    "pricing strategy",
    "profit margin",
    "retail pricing",
  ],
  variants: [
    {
      slug: "product-pricing",
      title: "Cost-Plus Pricing",
      description:
        "Calculate your product price based on total cost plus desired profit margin.",
      fields: [
        {
          name: "materialCost",
          label: "Material/COGS Per Unit ($)",
          type: "number",
          defaultValue: "12",
        },
        {
          name: "laborCostPerUnit",
          label: "Labor Cost Per Unit ($)",
          type: "number",
          defaultValue: "5",
        },
        {
          name: "overheadPerUnit",
          label: "Overhead Per Unit ($)",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "shippingPerUnit",
          label: "Shipping/Packaging Per Unit ($)",
          type: "number",
          defaultValue: "2.50",
        },
        {
          name: "desiredMargin",
          label: "Desired Profit Margin (%)",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "expectedMonthlyUnits",
          label: "Expected Monthly Units Sold",
          type: "number",
          defaultValue: "500",
        },
        {
          name: "pricingStrategy",
          label: "Pricing Strategy",
          type: "select",
          defaultValue: "margin",
          options: [
            { label: "Margin-Based", value: "margin" },
            { label: "Markup-Based", value: "markup" },
            { label: "Keystone (2x cost)", value: "keystone" },
          ],
        },
      ],
      calculate(inputs) {
        const material = parseFloat(inputs.materialCost as string);
        const labor = parseFloat(inputs.laborCostPerUnit as string);
        const overhead = parseFloat(inputs.overheadPerUnit as string);
        const shipping = parseFloat(inputs.shippingPerUnit as string);
        const margin = parseFloat(inputs.desiredMargin as string) / 100;
        const units = parseFloat(inputs.expectedMonthlyUnits as string);
        const strategy = inputs.pricingStrategy as string;

        const totalCost = material + labor + overhead + shipping;

        let sellingPrice: number;
        if (strategy === "margin") {
          sellingPrice = totalCost / (1 - margin);
        } else if (strategy === "markup") {
          sellingPrice = totalCost * (1 + margin);
        } else {
          sellingPrice = totalCost * 2;
        }

        const profitPerUnit = sellingPrice - totalCost;
        const actualMargin = (profitPerUnit / sellingPrice) * 100;
        const actualMarkup = (profitPerUnit / totalCost) * 100;
        const monthlyRevenue = sellingPrice * units;
        const monthlyCost = totalCost * units;
        const monthlyProfit = profitPerUnit * units;
        const breakEvenUnits = 0;
        const annualProfit = monthlyProfit * 12;

        return {
          "Total Cost Per Unit": `$${formatNumber(totalCost)}`,
          "Recommended Price": `$${formatNumber(sellingPrice)}`,
          "Profit Per Unit": `$${formatNumber(profitPerUnit)}`,
          "Actual Margin": `${formatNumber(actualMargin)}%`,
          "Actual Markup": `${formatNumber(actualMarkup)}%`,
          "Monthly Revenue": `$${formatNumber(monthlyRevenue)}`,
          "Monthly Cost": `$${formatNumber(monthlyCost)}`,
          "Monthly Profit": `$${formatNumber(monthlyProfit)}`,
          "Annual Projected Profit": `$${formatNumber(annualProfit)}`,
        };
      },
    },
    {
      slug: "product-pricing-breakeven",
      title: "Break-Even Pricing Analysis",
      description:
        "Find the break-even point and optimal price point for your product.",
      fields: [
        {
          name: "fixedCostsMonthly",
          label: "Monthly Fixed Costs ($)",
          type: "number",
          defaultValue: "5000",
        },
        {
          name: "variableCostPerUnit",
          label: "Variable Cost Per Unit ($)",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "sellingPrice",
          label: "Selling Price Per Unit ($)",
          type: "number",
          defaultValue: "35",
        },
        {
          name: "currentMonthlySales",
          label: "Current Monthly Unit Sales",
          type: "number",
          defaultValue: "400",
        },
      ],
      calculate(inputs) {
        const fixed = parseFloat(inputs.fixedCostsMonthly as string);
        const variable = parseFloat(inputs.variableCostPerUnit as string);
        const price = parseFloat(inputs.sellingPrice as string);
        const sales = parseFloat(inputs.currentMonthlySales as string);

        const contributionMargin = price - variable;
        const breakEvenUnits = Math.ceil(fixed / contributionMargin);
        const breakEvenRevenue = breakEvenUnits * price;
        const currentRevenue = sales * price;
        const currentProfit = sales * contributionMargin - fixed;
        const marginOfSafety = ((sales - breakEvenUnits) / sales) * 100;
        const cmRatio = (contributionMargin / price) * 100;

        return {
          "Contribution Margin": `$${formatNumber(contributionMargin)}`,
          "CM Ratio": `${formatNumber(cmRatio)}%`,
          "Break-Even Units": formatNumber(breakEvenUnits),
          "Break-Even Revenue": `$${formatNumber(breakEvenRevenue)}`,
          "Current Revenue": `$${formatNumber(currentRevenue)}`,
          "Current Monthly Profit": `$${formatNumber(currentProfit)}`,
          "Margin of Safety": `${formatNumber(marginOfSafety)}%`,
        };
      },
    },
  ],
  relatedSlugs: [
    "wholesale-markup",
    "restaurant-food-cost",
    "shipping-rate-compare",
  ],
  faq: [
    {
      question: "What is the difference between margin and markup?",
      answer:
        "Margin is profit as a percentage of the selling price (Profit / Price). Markup is profit as a percentage of cost (Profit / Cost). A 50% markup equals a 33% margin. A 50% margin equals a 100% markup. Margin can never exceed 100%, but markup can.",
    },
    {
      question: "What is keystone pricing?",
      answer:
        "Keystone pricing means doubling the wholesale cost (100% markup or 50% margin). It is a simple, traditional retail pricing method. While easy to implement, it may not be optimal for all products -- low-cost items may need higher markup, while expensive items may need less.",
    },
  ],
  formula:
    "Margin Price = Cost / (1 - Margin%). Markup Price = Cost x (1 + Markup%). Break-Even Units = Fixed Costs / (Price - Variable Cost). Contribution Margin = Price - Variable Cost.",
};
