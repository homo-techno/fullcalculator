import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amazonFbaProfitCalculator: CalculatorDefinition = {
  slug: "amazon-fba-profit",
  title: "Amazon FBA Profitability Calculator",
  description:
    "Calculate Amazon FBA profitability including referral fees, FBA fees, shipping costs, and advertising spend to determine true profit margins.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "amazon fba profit",
    "amazon fba fees",
    "amazon seller calculator",
    "fba profitability",
    "amazon margin",
    "fba revenue",
    "amazon seller fees",
  ],
  variants: [
    {
      slug: "amazon-fba-profit",
      title: "Amazon FBA Profit Calculator",
      description:
        "Calculate your Amazon FBA profit after all fees and costs.",
      fields: [
        {
          id: "sellingPrice",
          label: "Selling Price ($)",
          type: "number",
          defaultValue: 29.99,
        },
        {
          id: "productCost",
          label: "Product Cost / COGS ($)",
          type: "number",
          defaultValue: 6,
        },
        {
          id: "shippingToAmazon",
          label: "Shipping to Amazon per Unit ($)",
          type: "number",
          defaultValue: 1.5,
        },
        {
          id: "category",
          label: "Product Category",
          type: "select",
          options: [
            { label: "General (15% referral fee)", value: "general" },
            { label: "Electronics (8% referral fee)", value: "electronics" },
            { label: "Clothing (17% referral fee)", value: "clothing" },
            { label: "Home & Kitchen (15% referral fee)", value: "home" },
            { label: "Beauty (8% referral fee)", value: "beauty" },
            { label: "Books (15% referral fee)", value: "books" },
          ],
          defaultValue: "general",
        },
        {
          id: "productSize",
          label: "Product Size Tier",
          type: "select",
          options: [
            { label: "Small Standard ($3.22 FBA fee)", value: "small_standard" },
            { label: "Large Standard ($5.40 FBA fee)", value: "large_standard" },
            { label: "Small Oversize ($9.73 FBA fee)", value: "small_oversize" },
            { label: "Large Oversize ($15.00 FBA fee)", value: "large_oversize" },
          ],
          defaultValue: "small_standard",
        },
        {
          id: "monthlyUnits",
          label: "Monthly Units Sold",
          type: "number",
          defaultValue: 300,
        },
        {
          id: "ppcSpend",
          label: "Monthly PPC Ad Spend ($)",
          type: "number",
          defaultValue: 500,
        },
      ],
      calculate(inputs) {
        const sellingPrice = parseFloat(inputs.sellingPrice as string);
        const productCost = parseFloat(inputs.productCost as string);
        const shippingToAmazon = parseFloat(inputs.shippingToAmazon as string);
        const category = inputs.category as string;
        const productSize = inputs.productSize as string;
        const monthlyUnits = parseFloat(inputs.monthlyUnits as string);
        const ppcSpend = parseFloat(inputs.ppcSpend as string);

        const referralRates: Record<string, number> = {
          general: 0.15,
          electronics: 0.08,
          clothing: 0.17,
          home: 0.15,
          beauty: 0.08,
          books: 0.15,
        };

        const fbaFees: Record<string, number> = {
          small_standard: 3.22,
          large_standard: 5.40,
          small_oversize: 9.73,
          large_oversize: 15.0,
        };

        const referralFee = sellingPrice * (referralRates[category] || 0.15);
        const fbaFee = fbaFees[productSize] || 3.22;
        const totalFeesPerUnit = referralFee + fbaFee;
        const totalCostPerUnit = productCost + shippingToAmazon + totalFeesPerUnit;
        const profitPerUnit = sellingPrice - totalCostPerUnit;
        const profitMargin = (profitPerUnit / sellingPrice) * 100;

        const monthlyRevenue = sellingPrice * monthlyUnits;
        const monthlyProfit = profitPerUnit * monthlyUnits - ppcSpend;
        const roi = (monthlyProfit / (productCost * monthlyUnits + ppcSpend)) * 100;

        return {
          "Revenue per Unit": "$" + formatNumber(sellingPrice),
          "Referral Fee": "$" + formatNumber(referralFee),
          "FBA Fee": "$" + formatNumber(fbaFee),
          "Total Cost per Unit": "$" + formatNumber(totalCostPerUnit),
          "Profit per Unit": "$" + formatNumber(profitPerUnit),
          "Profit Margin": formatNumber(profitMargin) + "%",
          "Monthly Revenue": "$" + formatNumber(monthlyRevenue),
          "Monthly Net Profit (after PPC)": "$" + formatNumber(monthlyProfit),
          ROI: formatNumber(roi) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "shopify-profit",
    "etsy-profit",
    "dropshipping-margin",
    "print-on-demand-profit",
  ],
  faq: [
    {
      question: "What are Amazon FBA fees?",
      answer:
        "Amazon FBA fees include a referral fee (8-17% depending on category), FBA fulfillment fee ($3-$15+ based on size and weight), monthly storage fees ($0.87-$2.40 per cubic foot), and optional advertising costs. Together these typically consume 30-45% of the selling price.",
    },
    {
      question: "What is a good profit margin for Amazon FBA?",
      answer:
        "A healthy Amazon FBA profit margin is 20-30% after all fees and costs. Margins below 15% are risky due to potential price competition and fee increases. The most successful FBA sellers target 25%+ margins with products priced between $20-$50.",
    },
  ],
  formula:
    "Profit per Unit = Selling Price - Product Cost - Shipping - Referral Fee - FBA Fee. Monthly Profit = (Profit per Unit x Units Sold) - PPC Spend. ROI = Monthly Profit / (Product Cost x Units + PPC Spend) x 100.",
};
