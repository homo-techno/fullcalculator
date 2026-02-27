import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dropshippingMarginCalculator: CalculatorDefinition = {
  slug: "dropshipping-margin",
  title: "Dropshipping Profit Margin Calculator",
  description:
    "Calculate dropshipping profit margins including supplier costs, platform fees, shipping, advertising spend, and payment processing fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "dropshipping profit",
    "dropshipping margin",
    "dropshipping calculator",
    "dropshipping fees",
    "ecommerce margin",
    "dropship profit",
    "aliexpress dropshipping",
  ],
  variants: [
    {
      slug: "dropshipping-margin",
      title: "Dropshipping Per-Order Profit",
      description:
        "Calculate profit per order for your dropshipping business.",
      fields: [
        {
          id: "sellingPrice",
          label: "Selling Price ($)",
          type: "number",
          defaultValue: 39.99,
        },
        {
          id: "supplierCost",
          label: "Supplier / Product Cost ($)",
          type: "number",
          defaultValue: 12,
        },
        {
          id: "supplierShipping",
          label: "Supplier Shipping Cost ($)",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "platform",
          label: "Selling Platform",
          type: "select",
          options: [
            { label: "Shopify (2.9% + $0.30)", value: "shopify" },
            { label: "WooCommerce (2.9% + $0.30)", value: "woocommerce" },
            { label: "Amazon (15% referral)", value: "amazon" },
            { label: "eBay (13.25% final value)", value: "ebay" },
          ],
          defaultValue: "shopify",
        },
        {
          id: "adCostPerOrder",
          label: "Advertising Cost per Order ($)",
          type: "number",
          defaultValue: 8,
        },
        {
          id: "monthlyOrders",
          label: "Monthly Orders",
          type: "number",
          defaultValue: 200,
        },
        {
          id: "monthlyFixedCosts",
          label: "Monthly Fixed Costs (hosting, apps, etc.) ($)",
          type: "number",
          defaultValue: 100,
        },
      ],
      calculate(inputs) {
        const sellingPrice = parseFloat(inputs.sellingPrice as string);
        const supplierCost = parseFloat(inputs.supplierCost as string);
        const supplierShipping = parseFloat(inputs.supplierShipping as string);
        const platform = inputs.platform as string;
        const adCostPerOrder = parseFloat(inputs.adCostPerOrder as string);
        const monthlyOrders = parseFloat(inputs.monthlyOrders as string);
        const monthlyFixedCosts = parseFloat(inputs.monthlyFixedCosts as string);

        const platformFees: Record<string, (price: number) => number> = {
          shopify: (p) => p * 0.029 + 0.3,
          woocommerce: (p) => p * 0.029 + 0.3,
          amazon: (p) => p * 0.15,
          ebay: (p) => p * 0.1325,
        };

        const feeCalc = platformFees[platform] || platformFees["shopify"];
        const platformFee = feeCalc(sellingPrice);

        const totalCostPerOrder =
          supplierCost +
          supplierShipping +
          platformFee +
          adCostPerOrder;
        const profitPerOrder = sellingPrice - totalCostPerOrder;
        const profitMargin = (profitPerOrder / sellingPrice) * 100;

        const monthlyRevenue = sellingPrice * monthlyOrders;
        const monthlyGrossProfit = profitPerOrder * monthlyOrders;
        const monthlyNetProfit = monthlyGrossProfit - monthlyFixedCosts;

        return {
          "Revenue per Order": "$" + formatNumber(sellingPrice),
          "Product + Shipping Cost": "$" + formatNumber(supplierCost + supplierShipping),
          "Platform Fee": "$" + formatNumber(platformFee),
          "Ad Cost per Order": "$" + formatNumber(adCostPerOrder),
          "Profit per Order": "$" + formatNumber(profitPerOrder),
          "Profit Margin": formatNumber(profitMargin) + "%",
          "Monthly Revenue": "$" + formatNumber(monthlyRevenue),
          "Monthly Gross Profit": "$" + formatNumber(monthlyGrossProfit),
          "Monthly Net Profit": "$" + formatNumber(monthlyNetProfit),
          "Annual Net Profit": "$" + formatNumber(monthlyNetProfit * 12),
        };
      },
    },
    {
      slug: "dropshipping-breakeven",
      title: "Dropshipping Break-Even Calculator",
      description:
        "Calculate how many orders you need to break even each month.",
      fields: [
        {
          id: "sellingPrice",
          label: "Selling Price ($)",
          type: "number",
          defaultValue: 39.99,
        },
        {
          id: "totalCostPerOrder",
          label: "Total Variable Cost per Order ($)",
          type: "number",
          defaultValue: 25,
        },
        {
          id: "monthlyFixedCosts",
          label: "Monthly Fixed Costs ($)",
          type: "number",
          defaultValue: 500,
        },
      ],
      calculate(inputs) {
        const sellingPrice = parseFloat(inputs.sellingPrice as string);
        const totalCostPerOrder = parseFloat(inputs.totalCostPerOrder as string);
        const monthlyFixedCosts = parseFloat(inputs.monthlyFixedCosts as string);

        const profitPerOrder = sellingPrice - totalCostPerOrder;
        const breakEvenOrders = Math.ceil(monthlyFixedCosts / profitPerOrder);
        const breakEvenRevenue = breakEvenOrders * sellingPrice;

        return {
          "Profit per Order": "$" + formatNumber(profitPerOrder),
          "Break-Even Orders per Month": formatNumber(breakEvenOrders),
          "Break-Even Revenue": "$" + formatNumber(breakEvenRevenue),
          "Break-Even Orders per Day": formatNumber(
            Math.ceil(breakEvenOrders / 30)
          ),
          "Contribution Margin":
            formatNumber((profitPerOrder / sellingPrice) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "shopify-profit",
    "amazon-fba-profit",
    "etsy-profit",
    "print-on-demand-profit",
  ],
  faq: [
    {
      question: "What is a good profit margin for dropshipping?",
      answer:
        "A healthy dropshipping profit margin is 15-30% per order after all costs including advertising. Margins below 15% make it difficult to absorb returns and customer service costs. High-ticket dropshipping ($200+) can achieve higher dollar profits even at lower margins.",
    },
    {
      question: "How much does it cost to start dropshipping?",
      answer:
        "Starting a dropshipping business typically costs $200-$500 for platform setup (Shopify subscription, domain, basic apps) plus $500-$2,000 for initial advertising. Most costs are variable (product costs, ads) rather than fixed, making it relatively low-risk to start.",
    },
  ],
  formula:
    "Profit per Order = Selling Price - Supplier Cost - Shipping - Platform Fee - Ad Cost. Monthly Net Profit = (Profit per Order x Orders) - Fixed Costs. Break-Even Orders = Fixed Costs / Profit per Order.",
};
