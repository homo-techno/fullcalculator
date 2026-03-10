import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patreonIncomeCalculator: CalculatorDefinition = {
  slug: "patreon-income-calculator",
  title: "Patreon Income Calculator",
  description:
    "Calculate your Patreon net monthly income after platform fees and payment processing. Plan your tier pricing to maximize creator revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Patreon income calculator",
    "Patreon fee calculator",
    "how much does Patreon take",
    "Patreon creator earnings",
    "Patreon net income after fees",
  ],
  variants: [
    {
      id: "monthly",
      name: "Monthly Patreon Income",
      description: "Calculate net monthly earnings from Patreon memberships",
      fields: [
        {
          name: "totalPatrons",
          label: "Total Active Patrons",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "patrons",
        },
        {
          name: "avgPledge",
          label: "Average Monthly Pledge per Patron",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          defaultValue: 8,
        },
        {
          name: "patreonPlan",
          label: "Patreon Plan",
          type: "select",
          options: [
            { label: "Free (8% platform fee)", value: "8" },
            { label: "Pro (12% platform fee)", value: "12" },
            { label: "Premium (15% platform fee)", value: "15" },
          ],
          defaultValue: "8",
        },
        {
          name: "churnRate",
          label: "Monthly Patron Churn Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const patrons = parseFloat(inputs.totalPatrons as string) || 0;
        const avgPledge = parseFloat(inputs.avgPledge as string) || 8;
        const feeRate = parseFloat(inputs.patreonPlan as string) / 100 || 0.08;
        const churnRate = parseFloat(inputs.churnRate as string) / 100 || 0.05;

        const grossMonthly = patrons * avgPledge;
        const patreonFee = grossMonthly * feeRate;
        const processingFee = grossMonthly * 0.029 + patrons * 0.30;
        const netMonthly = grossMonthly - patreonFee - processingFee;
        const netAnnual = netMonthly * 12;

        const patronsAfter3Mo = patrons * Math.pow(1 - churnRate, 3);
        const patronsAfter12Mo = patrons * Math.pow(1 - churnRate, 12);

        const breakEvenPatrons = Math.ceil(1000 / (avgPledge * (1 - feeRate) - 0.029 * avgPledge - 0.30));

        return {
          primary: { label: "Monthly Net Income", value: `$${formatNumber(netMonthly, 2)}` },
          details: [
            { label: "Gross monthly pledges", value: `$${formatNumber(grossMonthly, 2)}` },
            { label: `Patreon fee (${(feeRate * 100).toFixed(0)}%)`, value: `-$${formatNumber(patreonFee, 2)}` },
            { label: "Payment processing", value: `-$${formatNumber(processingFee, 2)}` },
            { label: "Net monthly income", value: `$${formatNumber(netMonthly, 2)}` },
            { label: "Annual net income", value: `$${formatNumber(netAnnual, 2)}` },
            { label: "Effective % kept", value: `${formatNumber((netMonthly / Math.max(grossMonthly, 0.01)) * 100, 1)}%` },
            { label: "Patrons after 3 months (with churn)", value: `${formatNumber(patronsAfter3Mo, 0)}` },
            { label: "Patrons after 12 months (with churn)", value: `${formatNumber(patronsAfter12Mo, 0)}` },
            { label: "Patrons needed for $1,000/mo net", value: `${formatNumber(breakEvenPatrons, 0)}` },
          ],
          note: "Patreon charges 8–15% depending on plan plus payment processing (~2.9% + $0.30/patron). Reduce churn by posting consistently and offering exclusive tier benefits.",
        };
      },
    },
  ],
  relatedSlugs: ["substack-revenue-calculator", "membership-site-revenue-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "How much does Patreon take from creators?",
      answer:
        "Patreon charges 8% on the Lite plan, 12% on Pro, and 15% on Premium. Plus payment processing fees of 2.9% + $0.30 per patron per month. On the Lite plan, creators keep roughly 88–89% of gross pledges after all fees.",
    },
    {
      question: "How many Patreon patrons do I need to make $1,000/month?",
      answer:
        "At $5/month average pledge on the Lite plan: ~240 patrons. At $10/month: ~115 patrons. At $25/month: ~47 patrons. Higher average pledges dramatically reduce the patron count needed — focus on offering premium $25–$50 tiers rather than many $1 tiers.",
    },
    {
      question: "What is a good Patreon churn rate?",
      answer:
        "Industry average churn is 5–8% per month. Under 3% is excellent. High churn (10%+) means you're losing more patrons than you're gaining. Combat churn with consistent posting schedules, exclusive benefits at higher tiers, and direct patron communication.",
    },
  ],
  formula: "Net Monthly = Gross Pledges × (1 − Platform Fee%) − Processing (2.9% + $0.30/patron)",
};
