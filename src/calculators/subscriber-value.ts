import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subscriberValueCalculator: CalculatorDefinition = {
  slug: "subscriber-value",
  title: "Email Subscriber Value Calculator",
  description: "Free email subscriber value calculator. Calculate how much each email subscriber is worth to your business based on list revenue and engagement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["subscriber value", "email subscriber", "list value", "email revenue", "email marketing value"],
  variants: [
    {
      id: "basic",
      name: "Basic Subscriber Value",
      fields: [
        { name: "totalRevenue", label: "Total Email Revenue ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "totalSubscribers", label: "Total Subscribers", type: "number", placeholder: "e.g. 10000" },
        { name: "timePeriodMonths", label: "Time Period (months)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.totalRevenue as number;
        const subscribers = inputs.totalSubscribers as number;
        const months = inputs.timePeriodMonths as number;
        if (!revenue || !subscribers || !months) return null;
        const valuePerSubscriber = revenue / subscribers;
        const monthlyValue = valuePerSubscriber / months;
        const annualValue = monthlyValue * 12;
        const totalListValue = revenue;
        return {
          primary: { label: "Value per Subscriber", value: `$${formatNumber(valuePerSubscriber, 2)}` },
          details: [
            { label: "Monthly Value per Subscriber", value: `$${formatNumber(monthlyValue, 2)}` },
            { label: "Annualized Value", value: `$${formatNumber(annualValue, 2)}` },
            { label: "Total List Value", value: `$${formatNumber(totalListValue, 2)}` },
            { label: "Revenue per 1,000 Subscribers", value: `$${formatNumber((revenue / subscribers) * 1000, 2)}` },
          ],
        };
      },
    },
    {
      id: "projected",
      name: "Projected List Value",
      fields: [
        { name: "currentSubscribers", label: "Current Subscribers", type: "number", placeholder: "e.g. 5000" },
        { name: "monthlyGrowthRate", label: "Monthly Growth Rate (%)", type: "number", placeholder: "e.g. 5" },
        { name: "monthlyRevenuePerSub", label: "Monthly Revenue per Subscriber ($)", type: "number", placeholder: "e.g. 1.50" },
        { name: "projectionMonths", label: "Projection Period (months)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentSubscribers as number;
        const growth = inputs.monthlyGrowthRate as number;
        const monthlyRev = inputs.monthlyRevenuePerSub as number;
        const months = inputs.projectionMonths as number;
        if (!current || !growth || !monthlyRev || !months) return null;
        let totalSubs = current;
        let totalRevenue = 0;
        for (let i = 0; i < months; i++) {
          totalRevenue += totalSubs * monthlyRev;
          totalSubs = totalSubs * (1 + growth / 100);
        }
        const futureListSize = Math.round(totalSubs);
        const avgMonthlyRevenue = totalRevenue / months;
        return {
          primary: { label: "Projected Total Revenue", value: `$${formatNumber(totalRevenue, 2)}` },
          details: [
            { label: "Future List Size", value: formatNumber(futureListSize, 0) },
            { label: "List Growth", value: formatNumber(futureListSize - current, 0) },
            { label: "Avg Monthly Revenue", value: `$${formatNumber(avgMonthlyRevenue, 2)}` },
            { label: "Revenue per Current Sub", value: `$${formatNumber(totalRevenue / current, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["email-open-rate", "customer-acquisition-cost", "retention-rate"],
  faq: [
    { question: "How much is an email subscriber worth?", answer: "The average email subscriber is worth $30-$50 per year, but this varies widely. E-commerce subscribers may be worth $10-$20, while B2B SaaS subscribers can be worth $100+. Calculate your specific value using revenue attribution." },
    { question: "How do I increase subscriber value?", answer: "Increase subscriber value by segmenting your list, personalizing content, optimizing send frequency, improving email design, testing subject lines, and creating targeted automation sequences." },
  ],
  formula: "Subscriber Value = Total Email Revenue / Total Subscribers",
};
