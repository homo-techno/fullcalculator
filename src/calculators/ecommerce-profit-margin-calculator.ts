import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ecommerceProfitMarginCalculator: CalculatorDefinition = {
  slug: "ecommerce-profit-margin-calculator",
  title: "E-commerce Profit Margin Calculator",
  description: "Free e-commerce profit margin calculator. Calculate per-product profitability including COGS, shipping, platform fees, and ad costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ecommerce profit margin calculator", "product margin calculator", "ecommerce profitability calculator"],
  variants: [{
    id: "standard",
    name: "E-commerce Profit Margin",
    description: "Free e-commerce profit margin calculator",
    fields: [
      { name: "sellingPrice", label: "Selling Price", type: "number", prefix: "$", min: 0 },
      { name: "cogs", label: "Product Cost (COGS)", type: "number", prefix: "$", min: 0 },
      { name: "shipping", label: "Shipping Cost", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "platformFee", label: "Platform Fee %", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 15 },
      { name: "adCost", label: "Ad Cost per Sale", type: "number", prefix: "$", min: 0, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const price = inputs.sellingPrice as number;
      const cogs = inputs.cogs as number;
      const shipping = (inputs.shipping as number) || 0;
      const feeRate = (inputs.platformFee as number) / 100;
      const adCost = (inputs.adCost as number) || 0;
      if (!price || !cogs || price <= 0) return null;
      const platformFee = price * feeRate;
      const totalCost = cogs + shipping + platformFee + adCost;
      const profit = price - totalCost;
      const margin = (profit / price) * 100;
      const markup = (profit / totalCost) * 100;
      return {
        primary: { label: "Profit per Unit", value: "$" + formatNumber(profit) },
        details: [
          { label: "Revenue", value: "$" + formatNumber(price) },
          { label: "COGS", value: "$" + formatNumber(cogs) },
          { label: "Platform fee (" + (feeRate * 100) + "%)", value: "$" + formatNumber(platformFee) },
          { label: "Shipping + Ads", value: "$" + formatNumber(shipping + adCost) },
          { label: "Profit margin", value: formatNumber(margin) + "%" },
          { label: "Markup", value: formatNumber(markup) + "%" },
        ],
        note: profit < 0 ? "WARNING: Negative margin! Consider increasing price or reducing costs." : "Target: 30%+ margin for sustainable e-commerce.",
      };
    },
  }],
  relatedSlugs: ["profit-margin-calculator", "roas-calculator"],
  faq: [
    { question: "What is a good e-commerce profit margin?", answer: "Aim for 30-50% gross margin. After all costs (COGS, shipping, platform fees, ads, returns), net margin of 10-20% is healthy." },
    { question: "What are typical platform fees?", answer: "Amazon: 8-15% referral + FBA fees. Shopify: 2.9% + $0.30 per transaction. Etsy: 6.5% transaction + 3% payment. eBay: 12-15%." },
  ],
  formula: "Profit = Selling Price - COGS - Shipping - Platform Fee - Ad Cost",
};
