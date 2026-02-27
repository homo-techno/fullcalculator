import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shopifyProfitCalculator: CalculatorDefinition = {
  slug: "shopify-profit",
  title: "Shopify Store Profitability Calculator",
  description:
    "Calculate Shopify store profitability including subscription costs, payment processing fees, app costs, and advertising spend.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "shopify profit",
    "shopify fees",
    "shopify revenue",
    "ecommerce profit",
    "shopify store calculator",
    "online store profitability",
    "shopify income",
  ],
  variants: [
    {
      slug: "shopify-profit",
      title: "Shopify Store Profit Calculator",
      description:
        "Calculate your Shopify store's monthly profitability after all costs.",
      fields: [
        {
          id: "monthlyRevenue",
          label: "Monthly Revenue ($)",
          type: "number",
          defaultValue: 15000,
        },
        {
          id: "avgOrderValue",
          label: "Average Order Value ($)",
          type: "number",
          defaultValue: 65,
        },
        {
          id: "cogsPercent",
          label: "Cost of Goods Sold (%)",
          type: "number",
          defaultValue: 35,
        },
        {
          id: "shopifyPlan",
          label: "Shopify Plan",
          type: "select",
          options: [
            { label: "Basic ($39/mo, 2.9% + $0.30)", value: "basic" },
            { label: "Shopify ($105/mo, 2.6% + $0.30)", value: "shopify" },
            { label: "Advanced ($399/mo, 2.4% + $0.30)", value: "advanced" },
          ],
          defaultValue: "basic",
        },
        {
          id: "monthlyAppsCost",
          label: "Monthly Apps & Plugins Cost ($)",
          type: "number",
          defaultValue: 150,
        },
        {
          id: "monthlyAdSpend",
          label: "Monthly Ad Spend ($)",
          type: "number",
          defaultValue: 2000,
        },
        {
          id: "monthlyShippingCost",
          label: "Monthly Shipping Cost ($)",
          type: "number",
          defaultValue: 1200,
        },
        {
          id: "returnRate",
          label: "Return Rate (%)",
          type: "number",
          defaultValue: 5,
        },
      ],
      calculate(inputs) {
        const monthlyRevenue = parseFloat(inputs.monthlyRevenue as string);
        const avgOrderValue = parseFloat(inputs.avgOrderValue as string);
        const cogsPercent = parseFloat(inputs.cogsPercent as string) / 100;
        const shopifyPlan = inputs.shopifyPlan as string;
        const monthlyAppsCost = parseFloat(inputs.monthlyAppsCost as string);
        const monthlyAdSpend = parseFloat(inputs.monthlyAdSpend as string);
        const monthlyShippingCost = parseFloat(inputs.monthlyShippingCost as string);
        const returnRate = parseFloat(inputs.returnRate as string) / 100;

        const planDetails: Record<
          string,
          { monthly: number; rate: number; perTransaction: number }
        > = {
          basic: { monthly: 39, rate: 0.029, perTransaction: 0.3 },
          shopify: { monthly: 105, rate: 0.026, perTransaction: 0.3 },
          advanced: { monthly: 399, rate: 0.024, perTransaction: 0.3 },
        };

        const plan = planDetails[shopifyPlan] || planDetails["basic"];
        const orders = monthlyRevenue / avgOrderValue;
        const effectiveRevenue = monthlyRevenue * (1 - returnRate);

        const cogs = effectiveRevenue * cogsPercent;
        const paymentProcessing =
          effectiveRevenue * plan.rate + orders * plan.perTransaction;
        const totalCosts =
          cogs +
          paymentProcessing +
          plan.monthly +
          monthlyAppsCost +
          monthlyAdSpend +
          monthlyShippingCost;
        const refundLoss = monthlyRevenue * returnRate;
        const netProfit = effectiveRevenue - totalCosts;
        const profitMargin = (netProfit / effectiveRevenue) * 100;
        const roas = effectiveRevenue / monthlyAdSpend;

        return {
          "Effective Revenue (after returns)": "$" + formatNumber(effectiveRevenue),
          "Cost of Goods": "$" + formatNumber(cogs),
          "Payment Processing": "$" + formatNumber(paymentProcessing),
          "Shopify Subscription": "$" + formatNumber(plan.monthly),
          "Apps & Plugins": "$" + formatNumber(monthlyAppsCost),
          "Ad Spend": "$" + formatNumber(monthlyAdSpend),
          Shipping: "$" + formatNumber(monthlyShippingCost),
          "Returns / Refunds": "$" + formatNumber(refundLoss),
          "Net Monthly Profit": "$" + formatNumber(netProfit),
          "Profit Margin": formatNumber(profitMargin) + "%",
          "ROAS (Return on Ad Spend)": formatNumber(roas) + "x",
          "Monthly Orders": formatNumber(Math.round(orders)),
        };
      },
    },
  ],
  relatedSlugs: [
    "amazon-fba-profit",
    "etsy-profit",
    "dropshipping-margin",
    "print-on-demand-profit",
  ],
  faq: [
    {
      question: "What are Shopify's total fees?",
      answer:
        "Shopify charges a monthly subscription ($39-$399), payment processing (2.4-2.9% + $0.30 per transaction using Shopify Payments), and potential app fees. Unlike marketplaces, Shopify does not charge listing fees or referral fees, making it more cost-effective at higher volumes.",
    },
    {
      question: "What profit margin should a Shopify store target?",
      answer:
        "A healthy Shopify store targets 15-25% net profit margin after all costs. Top stores achieve 30%+. Key factors include COGS (aim for under 40%), ad spend efficiency (ROAS of 3x+), and keeping operational costs like apps and shipping controlled.",
    },
  ],
  formula:
    "Net Profit = Revenue x (1 - Return Rate) - COGS - Payment Processing - Subscription - Apps - Ad Spend - Shipping. Payment Processing = Revenue x Card Rate + Orders x $0.30.",
};
