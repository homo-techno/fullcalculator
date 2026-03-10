import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printfulProfitCalculator: CalculatorDefinition = {
  slug: "printful-profit-calculator",
  title: "Printful Profit Margin Calculator",
  description:
    "Calculate profit margins when selling with Printful print-on-demand. Compare Printful + Etsy vs Shopify vs WooCommerce total costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Printful profit calculator",
    "Printful margin calculator",
    "Printful Etsy profit",
    "Printful Shopify earnings",
    "print-on-demand profit margin",
  ],
  variants: [
    {
      id: "margin",
      name: "Profit Margin Calculator",
      description: "Calculate net profit for Printful products",
      fields: [
        {
          name: "product",
          label: "Product",
          type: "select",
          options: [
            { label: "Unisex T-Shirt ($12.95 cost)", value: "tshirt" },
            { label: "Hoodie ($29.95 cost)", value: "hoodie" },
            { label: "Mug ($7.95 cost)", value: "mug" },
            { label: "Poster ($7.95 cost)", value: "poster" },
            { label: "Phone Case ($14.95 cost)", value: "phonecase" },
            { label: "Tote Bag ($10.95 cost)", value: "tote" },
          ],
          defaultValue: "tshirt",
        },
        {
          name: "retailPrice",
          label: "Your Retail Price",
          type: "number",
          placeholder: "e.g. 29.99",
          prefix: "$",
        },
        {
          name: "platform",
          label: "Sales Platform",
          type: "select",
          options: [
            { label: "Etsy (6.5% fee)", value: "etsy" },
            { label: "Shopify ($39/mo, 0% transaction)", value: "shopify" },
            { label: "WooCommerce (~3% processing)", value: "woo" },
          ],
          defaultValue: "etsy",
        },
        {
          name: "monthlySales",
          label: "Monthly Sales",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "units",
        },
      ],
      calculate: (inputs) => {
        const product = inputs.product as string;
        const retailPrice = parseFloat(inputs.retailPrice as string) || 0;
        const platform = inputs.platform as string;
        const sales = parseFloat(inputs.monthlySales as string) || 0;

        const printfulCosts: Record<string, number> = {
          tshirt: 12.95, hoodie: 29.95, mug: 7.95, poster: 7.95, phonecase: 14.95, tote: 10.95,
        };
        const printfulCost = printfulCosts[product] || 12.95;

        let platformFee = 0;
        let platformFixed = 0;
        if (platform === "etsy") {
          platformFee = retailPrice * 0.065 + retailPrice * 0.03 + 0.25 + 0.20;
        } else if (platform === "shopify") {
          platformFixed = 39 / Math.max(1, sales);
          platformFee = retailPrice * 0.03; // Stripe processing
        } else {
          platformFee = retailPrice * 0.03;
        }

        const profitPerUnit = retailPrice - printfulCost - platformFee - platformFixed;
        const marginPct = retailPrice > 0 ? (profitPerUnit / retailPrice) * 100 : 0;
        const monthlyProfit = profitPerUnit * sales;

        return {
          primary: { label: "Monthly Profit", value: `$${formatNumber(monthlyProfit, 2)}` },
          details: [
            { label: "Retail price", value: `$${formatNumber(retailPrice, 2)}` },
            { label: "Printful cost", value: `-$${formatNumber(printfulCost, 2)}` },
            { label: "Platform fees", value: `-$${formatNumber(platformFee + platformFixed, 2)}` },
            { label: "Profit per unit", value: `$${formatNumber(profitPerUnit, 2)}` },
            { label: "Profit margin", value: `${formatNumber(marginPct, 1)}%` },
            { label: "Monthly profit (${sales} units)", value: `$${formatNumber(monthlyProfit, 2)}` },
            { label: "Annual profit", value: `$${formatNumber(monthlyProfit * 12, 2)}` },
          ],
          note: "Target 30–50% margins for sustainable POD business. At margins below 20%, advertising becomes very difficult to make profitable.",
        };
      },
    },
  ],
  relatedSlugs: ["etsy-fee-calculator", "print-on-demand-pricing-calculator", "redbubble-royalty-calculator"],
  faq: [
    {
      question: "Is Printful profitable?",
      answer:
        "Printful can be profitable if you price correctly. Target 40–60% margins. A t-shirt costing $12.95 from Printful should retail for $25–$35 for healthy margins after platform fees.",
    },
    {
      question: "Printful vs Printify — which is cheaper?",
      answer:
        "Printify is generally 20–30% cheaper than Printful for the same products because it connects you to multiple print providers. Printful has more consistent quality control and better branding/white-labeling options.",
    },
    {
      question: "Do you need a business license to use Printful?",
      answer:
        "You don't need a business license to start with Printful, but you'll need to collect and remit sales tax in states where you have nexus. As you scale, forming an LLC and getting a resale certificate can save money on Printful's base costs.",
    },
  ],
  formula: "Profit = Retail Price − Printful Cost − Platform Fees",
};
