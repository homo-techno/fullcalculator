import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wholesaleMarkupCalculator: CalculatorDefinition = {
  slug: "wholesale-markup",
  title: "Wholesale to Retail Markup Calculator",
  description:
    "Calculate retail prices from wholesale costs with proper markup and margin calculations for resellers and retailers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "wholesale",
    "retail",
    "markup",
    "margin",
    "reseller",
    "profit",
    "pricing",
    "keystone",
  ],
  variants: [
    {
      slug: "wholesale-markup",
      title: "Wholesale to Retail Markup",
      description:
        "Calculate the retail price and profit from wholesale cost and desired markup.",
      fields: [
        {
          name: "wholesaleCost",
          label: "Wholesale Cost Per Unit ($)",
          type: "number",
          defaultValue: "25",
        },
        {
          name: "shippingPerUnit",
          label: "Shipping/Handling Per Unit ($)",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "markupMethod",
          label: "Pricing Method",
          type: "select",
          defaultValue: "markup",
          options: [
            { label: "Markup Percentage", value: "markup" },
            { label: "Margin Percentage", value: "margin" },
            { label: "Fixed Dollar Amount", value: "fixed" },
          ],
        },
        {
          name: "markupPercent",
          label: "Markup/Margin/Fixed Amount",
          type: "number",
          defaultValue: "100",
        },
        {
          name: "unitsPerMonth",
          label: "Expected Monthly Units",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "marketplaceFeePct",
          label: "Marketplace Fee (%)",
          type: "number",
          defaultValue: "15",
        },
      ],
      calculate(inputs) {
        const wholesale = parseFloat(inputs.wholesaleCost as string);
        const shipping = parseFloat(inputs.shippingPerUnit as string);
        const method = inputs.markupMethod as string;
        const value = parseFloat(inputs.markupPercent as string);
        const units = parseFloat(inputs.unitsPerMonth as string);
        const marketplaceFee = parseFloat(inputs.marketplaceFeePct as string) / 100;

        const landedCost = wholesale + shipping;

        let retailPrice: number;
        if (method === "markup") {
          retailPrice = landedCost * (1 + value / 100);
        } else if (method === "margin") {
          retailPrice = landedCost / (1 - value / 100);
        } else {
          retailPrice = landedCost + value;
        }

        const feeAmount = retailPrice * marketplaceFee;
        const netAfterFees = retailPrice - feeAmount;
        const profitPerUnit = netAfterFees - landedCost;
        const actualMargin = (profitPerUnit / retailPrice) * 100;
        const actualMarkup = (profitPerUnit / landedCost) * 100;
        const monthlyRevenue = retailPrice * units;
        const monthlyProfit = profitPerUnit * units;
        const monthlyFees = feeAmount * units;

        return {
          "Landed Cost": `$${formatNumber(landedCost)}`,
          "Retail Price": `$${formatNumber(retailPrice)}`,
          "Marketplace Fee": `$${formatNumber(feeAmount)}`,
          "Net After Fees": `$${formatNumber(netAfterFees)}`,
          "Profit Per Unit": `$${formatNumber(profitPerUnit)}`,
          "Actual Margin": `${formatNumber(actualMargin)}%`,
          "Actual Markup": `${formatNumber(actualMarkup)}%`,
          "Monthly Revenue": `$${formatNumber(monthlyRevenue)}`,
          "Monthly Marketplace Fees": `$${formatNumber(monthlyFees)}`,
          "Monthly Profit": `$${formatNumber(monthlyProfit)}`,
        };
      },
    },
    {
      slug: "wholesale-markup-bulk",
      title: "Bulk Wholesale Comparison",
      description: "Compare pricing across different wholesale quantity tiers.",
      fields: [
        {
          name: "tier1Cost",
          label: "Tier 1 Cost (1-49 units) ($)",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "tier2Cost",
          label: "Tier 2 Cost (50-199 units) ($)",
          type: "number",
          defaultValue: "25",
        },
        {
          name: "tier3Cost",
          label: "Tier 3 Cost (200+ units) ($)",
          type: "number",
          defaultValue: "20",
        },
        {
          name: "targetRetailPrice",
          label: "Target Retail Price ($)",
          type: "number",
          defaultValue: "60",
        },
        {
          name: "monthlyDemand",
          label: "Expected Monthly Demand",
          type: "number",
          defaultValue: "100",
        },
      ],
      calculate(inputs) {
        const tier1 = parseFloat(inputs.tier1Cost as string);
        const tier2 = parseFloat(inputs.tier2Cost as string);
        const tier3 = parseFloat(inputs.tier3Cost as string);
        const retail = parseFloat(inputs.targetRetailPrice as string);
        const demand = parseFloat(inputs.monthlyDemand as string);

        const margin1 = ((retail - tier1) / retail) * 100;
        const margin2 = ((retail - tier2) / retail) * 100;
        const margin3 = ((retail - tier3) / retail) * 100;

        const profit1 = (retail - tier1) * demand;
        const profit2 = (retail - tier2) * demand;
        const profit3 = (retail - tier3) * demand;

        const savings2vs1 = (tier1 - tier2) * demand;
        const savings3vs1 = (tier1 - tier3) * demand;

        return {
          "Tier 1 Margin": `${formatNumber(margin1)}%`,
          "Tier 2 Margin": `${formatNumber(margin2)}%`,
          "Tier 3 Margin": `${formatNumber(margin3)}%`,
          "Tier 1 Monthly Profit": `$${formatNumber(profit1)}`,
          "Tier 2 Monthly Profit": `$${formatNumber(profit2)}`,
          "Tier 3 Monthly Profit": `$${formatNumber(profit3)}`,
          "Savings: Tier 2 vs Tier 1": `$${formatNumber(savings2vs1)}/mo`,
          "Savings: Tier 3 vs Tier 1": `$${formatNumber(savings3vs1)}/mo`,
        };
      },
    },
  ],
  relatedSlugs: [
    "product-pricing",
    "shipping-rate-compare",
    "inventory-reorder",
  ],
  faq: [
    {
      question: "What is a standard wholesale to retail markup?",
      answer:
        "Standard markups vary by industry: apparel 100-150% (keystone+), electronics 30-50%, grocery 25-50%, jewelry 100-300%, furniture 80-120%. The right markup depends on competition, brand positioning, and overhead costs.",
    },
    {
      question: "How do marketplace fees affect my markup?",
      answer:
        "Marketplace fees (Amazon 15%, eBay 12-13%, Etsy 6.5%) must be factored into your pricing. If your product costs $20 and Amazon takes 15% of a $50 sale ($7.50), your actual profit is $22.50, not $30. Always calculate margin after fees.",
    },
  ],
  formula:
    "Markup Price = Landed Cost x (1 + Markup%). Margin Price = Landed Cost / (1 - Margin%). Profit = Retail Price - Marketplace Fee - Landed Cost. Landed Cost = Wholesale + Shipping.",
};
