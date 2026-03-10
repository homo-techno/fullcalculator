import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shopifyStoreProfitabilityCalculator: CalculatorDefinition = {
  slug: "shopify-store-profitability-calculator",
  title: "Shopify Store Profitability Calculator",
  description:
    "Calculate Shopify store net profit after platform fees, payment processing, apps, and advertising. See true ROI for your Shopify business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Shopify store profitability calculator",
    "Shopify profit margin calculator",
    "Shopify fees calculator",
    "ecommerce profit calculator",
    "Shopify net income",
  ],
  variants: [
    {
      id: "profit",
      name: "Monthly Profit Calculator",
      description: "Calculate your true Shopify store profits",
      fields: [
        {
          name: "monthlyRevenue",
          label: "Monthly Gross Revenue",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
        },
        {
          name: "cogs",
          label: "Cost of Goods Sold (COGS)",
          type: "number",
          placeholder: "e.g. 4000",
          prefix: "$",
        },
        {
          name: "plan",
          label: "Shopify Plan",
          type: "select",
          options: [
            { label: "Basic ($39/mo, 2% trans fee)", value: "basic" },
            { label: "Shopify ($105/mo, 1% trans fee)", value: "standard" },
            { label: "Advanced ($399/mo, 0.5% trans fee)", value: "advanced" },
          ],
          defaultValue: "basic",
        },
        {
          name: "adSpend",
          label: "Monthly Ad Spend",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "appsCost",
          label: "Monthly App Subscriptions",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          defaultValue: 50,
        },
      ],
      calculate: (inputs) => {
        const revenue = parseFloat(inputs.monthlyRevenue as string) || 0;
        const cogs = parseFloat(inputs.cogs as string) || 0;
        const plan = inputs.plan as string;
        const adSpend = parseFloat(inputs.adSpend as string) || 0;
        const appsCost = parseFloat(inputs.appsCost as string) || 50;

        const planData: Record<string, { fee: number; txRate: number }> = {
          basic: { fee: 39, txRate: 0.02 },
          standard: { fee: 105, txRate: 0.01 },
          advanced: { fee: 399, txRate: 0.005 },
        };
        const { fee: planFee, txRate } = planData[plan] || planData.basic;

        const txFee = revenue * txRate;
        const stripeProcessing = revenue * 0.029 + 0.30 * (revenue / 50); // ~$0.30 per transaction
        const totalFees = planFee + txFee + stripeProcessing + appsCost;
        const grossProfit = revenue - cogs;
        const netProfit = grossProfit - totalFees - adSpend;
        const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
        const roas = adSpend > 0 ? revenue / adSpend : 0;

        return {
          primary: { label: "Monthly Net Profit", value: `$${formatNumber(netProfit, 2)}` },
          details: [
            { label: "Gross revenue", value: `$${formatNumber(revenue, 2)}` },
            { label: "Cost of goods (COGS)", value: `-$${formatNumber(cogs, 2)}` },
            { label: "Gross profit", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Shopify plan fee", value: `-$${formatNumber(planFee, 2)}` },
            { label: "Transaction fees", value: `-$${formatNumber(txFee, 2)}` },
            { label: "Payment processing", value: `-$${formatNumber(stripeProcessing, 2)}` },
            { label: "Apps cost", value: `-$${formatNumber(appsCost, 2)}` },
            { label: "Ad spend", value: `-$${formatNumber(adSpend, 2)}` },
            { label: "Net profit", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Net margin", value: `${formatNumber(netMargin, 1)}%` },
            { label: adSpend > 0 ? "ROAS" : "ROAS (no ads)", value: adSpend > 0 ? `${formatNumber(roas, 2)}x` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["amazon-fba-fee-calculator", "printful-profit-calculator", "dropshipping-profit-calculator"],
  faq: [
    {
      question: "What is a good profit margin for a Shopify store?",
      answer:
        "A healthy Shopify store targets 20–40% net margins. Digital products/POD: 50–70%. Physical products: 15–35%. With paid ads, you need at least 4x ROAS (Return on Ad Spend) to be profitable at 25% margins.",
    },
    {
      question: "What are all the Shopify fees?",
      answer:
        "Shopify fees include: monthly plan ($39–$399), transaction fee (0.5–2% if not using Shopify Payments), payment processing (~2.9% + $0.30 per Stripe transaction), app subscriptions ($0–$500+/mo), and theme costs (one-time $100–$350).",
    },
    {
      question: "When should I upgrade my Shopify plan?",
      answer:
        "Upgrade from Basic to Standard when revenue exceeds $5,250/month (the 1% savings on transaction fees covers the $66/mo plan difference). Upgrade to Advanced at $13,000/month revenue.",
    },
  ],
  formula: "Net Profit = Revenue − COGS − Shopify Fees − Transaction Fees − Ad Spend",
};
