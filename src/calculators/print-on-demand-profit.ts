import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printOnDemandProfitCalculator: CalculatorDefinition = {
  slug: "print-on-demand-profit",
  title: "Print-on-Demand Profit Calculator",
  description:
    "Calculate per-item profit for print-on-demand products including base costs, platform fees, and shipping across providers like Printful, Printify, and Gelato.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "print on demand profit",
    "pod calculator",
    "printful profit",
    "printify profit",
    "pod margin",
    "custom merch profit",
    "tshirt business profit",
  ],
  variants: [
    {
      slug: "print-on-demand-profit",
      title: "Print-on-Demand Per-Item Profit",
      description:
        "Calculate your profit per item across different POD products.",
      fields: [
        {
          id: "productType",
          label: "Product Type",
          type: "select",
          options: [
            { label: "T-Shirt ($9.50 base)", value: "tshirt" },
            { label: "Hoodie ($22.00 base)", value: "hoodie" },
            { label: "Mug ($6.50 base)", value: "mug" },
            { label: "Phone Case ($7.00 base)", value: "phonecase" },
            { label: "Poster ($8.00 base)", value: "poster" },
            { label: "Tote Bag ($11.00 base)", value: "tote" },
            { label: "Canvas Print ($15.00 base)", value: "canvas" },
          ],
          defaultValue: "tshirt",
        },
        {
          id: "sellingPrice",
          label: "Selling Price ($)",
          type: "number",
          defaultValue: 29.99,
        },
        {
          id: "shippingCharged",
          label: "Shipping Charged to Customer ($)",
          type: "number",
          defaultValue: 4.99,
        },
        {
          id: "shippingCost",
          label: "Actual Shipping Cost ($)",
          type: "number",
          defaultValue: 4.5,
        },
        {
          id: "sellingPlatform",
          label: "Selling Platform",
          type: "select",
          options: [
            { label: "Shopify (2.9% + $0.30)", value: "shopify" },
            { label: "Etsy (6.5% + processing)", value: "etsy" },
            { label: "Amazon Merch (royalty model)", value: "amazon" },
            { label: "Own Website (3% processing)", value: "own" },
          ],
          defaultValue: "shopify",
        },
        {
          id: "monthlySales",
          label: "Monthly Sales Volume",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "adCostPerSale",
          label: "Ad Cost per Sale ($)",
          type: "number",
          defaultValue: 5,
        },
      ],
      calculate(inputs) {
        const productType = inputs.productType as string;
        const sellingPrice = parseFloat(inputs.sellingPrice as string);
        const shippingCharged = parseFloat(inputs.shippingCharged as string);
        const shippingCost = parseFloat(inputs.shippingCost as string);
        const sellingPlatform = inputs.sellingPlatform as string;
        const monthlySales = parseFloat(inputs.monthlySales as string);
        const adCostPerSale = parseFloat(inputs.adCostPerSale as string);

        const baseCosts: Record<string, number> = {
          tshirt: 9.5,
          hoodie: 22.0,
          mug: 6.5,
          phonecase: 7.0,
          poster: 8.0,
          tote: 11.0,
          canvas: 15.0,
        };

        const productBaseCost = baseCosts[productType] || 9.5;
        const totalReceived = sellingPrice + shippingCharged;

        // Platform fees
        const platformFeeCalc: Record<string, (total: number) => number> = {
          shopify: (t) => t * 0.029 + 0.3,
          etsy: (t) => t * 0.065 + t * 0.03 + 0.25 + 0.2,
          amazon: (t) => t * 0.3, // Amazon takes ~30% royalty model
          own: (t) => t * 0.03,
        };

        const platformFee = (platformFeeCalc[sellingPlatform] || platformFeeCalc["shopify"])(totalReceived);
        const totalCost = productBaseCost + shippingCost + platformFee + adCostPerSale;
        const profitPerItem = totalReceived - totalCost;
        const profitMargin = (profitPerItem / totalReceived) * 100;

        const monthlyRevenue = totalReceived * monthlySales;
        const monthlyProfit = profitPerItem * monthlySales;

        return {
          "Product Base Cost": "$" + formatNumber(productBaseCost),
          "Platform Fee": "$" + formatNumber(platformFee),
          "Shipping Cost": "$" + formatNumber(shippingCost),
          "Ad Cost": "$" + formatNumber(adCostPerSale),
          "Total Cost per Item": "$" + formatNumber(totalCost),
          "Profit per Item": "$" + formatNumber(profitPerItem),
          "Profit Margin": formatNumber(profitMargin) + "%",
          "Monthly Revenue": "$" + formatNumber(monthlyRevenue),
          "Monthly Profit": "$" + formatNumber(monthlyProfit),
          "Annual Profit": "$" + formatNumber(monthlyProfit * 12),
        };
      },
    },
  ],
  relatedSlugs: [
    "etsy-profit",
    "shopify-profit",
    "dropshipping-margin",
    "amazon-fba-profit",
  ],
  faq: [
    {
      question: "What is a good profit margin for print-on-demand?",
      answer:
        "A good POD profit margin is 20-40% per item. T-shirts typically yield $5-$15 profit per sale, while higher-value items like hoodies and canvas prints can yield $15-$30+. The key is pricing high enough to cover base costs, fees, and advertising while remaining competitive.",
    },
    {
      question: "Which print-on-demand products are most profitable?",
      answer:
        "All-over print products, premium apparel (hoodies, sweatshirts), and home decor (canvas prints, blankets) tend to have the highest dollar profit per sale. T-shirts have the highest volume potential. Digital products like downloadable art have nearly 100% margins.",
    },
  ],
  formula:
    "Profit per Item = Selling Price + Shipping Charged - Base Cost - Actual Shipping - Platform Fee - Ad Cost. Monthly Profit = Profit per Item x Monthly Sales.",
};
