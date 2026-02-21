import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const customerLifetimeValueCalculator: CalculatorDefinition = {
  slug: "customer-lifetime-value-calculator",
  title: "Customer Lifetime Value Calculator",
  description: "Free customer lifetime value (CLV/LTV) calculator. Calculate how much revenue a customer generates over their entire relationship with your business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["customer lifetime value calculator", "CLV calculator", "LTV calculator", "lifetime value", "customer value calculator"],
  variants: [
    {
      id: "simple",
      name: "Simple CLV",
      description: "Calculate CLV using average purchase value and customer lifespan",
      fields: [
        { name: "avgPurchaseValue", label: "Average Purchase Value", type: "number", placeholder: "e.g. 50", prefix: "$" },
        { name: "purchaseFrequency", label: "Purchases per Year", type: "number", placeholder: "e.g. 4", step: 0.1 },
        { name: "customerLifespan", label: "Average Customer Lifespan (years)", type: "number", placeholder: "e.g. 3", step: 0.5 },
      ],
      calculate: (inputs) => {
        const avgValue = inputs.avgPurchaseValue as number;
        const frequency = inputs.purchaseFrequency as number;
        const lifespan = inputs.customerLifespan as number;
        if (!avgValue || !frequency || !lifespan) return null;
        const annualValue = avgValue * frequency;
        const clv = annualValue * lifespan;
        return {
          primary: { label: "Customer Lifetime Value", value: `$${formatNumber(clv)}` },
          details: [
            { label: "Annual Customer Value", value: `$${formatNumber(annualValue)}` },
            { label: "Avg Purchase Value", value: `$${formatNumber(avgValue)}` },
            { label: "Purchases per Year", value: formatNumber(frequency, 1) },
            { label: "Avg Lifespan", value: `${formatNumber(lifespan, 1)} years` },
            { label: "Monthly Customer Value", value: `$${formatNumber(annualValue / 12)}` },
          ],
        };
      },
    },
    {
      id: "withMargin",
      name: "CLV with Profit Margin",
      description: "Calculate CLV based on profit margin, not just revenue",
      fields: [
        { name: "avgRevPerCustomer", label: "Avg Annual Revenue per Customer", type: "number", placeholder: "e.g. 2000", prefix: "$" },
        { name: "grossMargin", label: "Gross Margin %", type: "number", placeholder: "e.g. 65", suffix: "%" },
        { name: "churnRate", label: "Annual Churn Rate %", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "discountRate", label: "Discount Rate % (cost of capital)", type: "number", placeholder: "e.g. 10", suffix: "%", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const revenue = inputs.avgRevPerCustomer as number;
        const margin = inputs.grossMargin as number;
        const churn = inputs.churnRate as number;
        const discount = (inputs.discountRate as number) || 10;
        if (!revenue || !margin || !churn) return null;
        const grossProfit = revenue * (margin / 100);
        const avgLifespan = 1 / (churn / 100);
        const retentionRate = 1 - churn / 100;
        const clvSimple = grossProfit * avgLifespan;
        const clvDiscounted = grossProfit * (retentionRate / (1 + discount / 100 - retentionRate));
        return {
          primary: { label: "CLV (Discounted)", value: `$${formatNumber(clvDiscounted)}` },
          details: [
            { label: "CLV (Simple)", value: `$${formatNumber(clvSimple)}` },
            { label: "Annual Gross Profit/Customer", value: `$${formatNumber(grossProfit)}` },
            { label: "Avg Customer Lifespan", value: `${formatNumber(avgLifespan, 1)} years` },
            { label: "Retention Rate", value: `${formatNumber(retentionRate * 100)}%` },
            { label: "Monthly Value", value: `$${formatNumber(grossProfit / 12)}` },
          ],
        };
      },
    },
    {
      id: "ratio",
      name: "CLV:CAC Ratio",
      description: "Calculate the ratio of customer lifetime value to acquisition cost",
      fields: [
        { name: "clv", label: "Customer Lifetime Value", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "cac", label: "Customer Acquisition Cost", type: "number", placeholder: "e.g. 1000", prefix: "$" },
        { name: "monthsToPayback", label: "Months to Recover CAC", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const clv = inputs.clv as number;
        const cac = inputs.cac as number;
        const payback = inputs.monthsToPayback as number;
        if (!clv || !cac) return null;
        const ratio = clv / cac;
        const netProfit = clv - cac;
        const roi = ((clv - cac) / cac) * 100;
        let health = "Poor";
        if (ratio >= 5) health = "Excellent";
        else if (ratio >= 3) health = "Good";
        else if (ratio >= 1) health = "Needs improvement";
        return {
          primary: { label: "CLV:CAC Ratio", value: `${formatNumber(ratio, 1)}:1` },
          details: [
            { label: "Net Profit per Customer", value: `$${formatNumber(netProfit)}` },
            { label: "Customer ROI", value: `${formatNumber(roi)}%` },
            { label: "CLV", value: `$${formatNumber(clv)}` },
            { label: "CAC", value: `$${formatNumber(cac)}` },
            { label: "CAC Payback", value: payback ? `${payback} months` : "Not provided" },
            { label: "Business Health", value: health },
          ],
          note: ratio < 3 ? "A CLV:CAC ratio below 3:1 suggests you may be spending too much on acquisition or not retaining customers long enough." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["cac-calculator", "churn-rate-calculator", "roi-marketing-calculator"],
  faq: [
    { question: "What is Customer Lifetime Value (CLV)?", answer: "CLV is the total revenue or profit a business can expect from a single customer over their entire relationship. It helps determine how much you can spend to acquire customers (CAC) while remaining profitable. CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan." },
    { question: "What is a good CLV:CAC ratio?", answer: "A CLV:CAC ratio of 3:1 or higher is considered healthy. This means each customer generates 3x what it costs to acquire them. Below 1:1 means you're losing money on each customer. SaaS companies typically target 3:1 to 5:1. Above 5:1 may mean you're underinvesting in growth." },
    { question: "How can I increase CLV?", answer: "Improve retention (reduce churn), increase purchase frequency (loyalty programs, email marketing), increase average order value (upsells, cross-sells, bundles), improve customer experience, and build switching costs into your product." },
  ],
  formula: "Simple CLV = Avg Purchase Value × Frequency × Lifespan | Profit CLV = Gross Profit × (Retention / (1 + Discount - Retention)) | CLV:CAC Ratio = CLV / CAC",
};
