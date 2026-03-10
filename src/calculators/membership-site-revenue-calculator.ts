import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const membershipSiteRevenueCalculator: CalculatorDefinition = {
  slug: "membership-site-revenue-calculator",
  title: "Membership Site Revenue Calculator",
  description:
    "Calculate recurring revenue from Patreon, Ko-fi, Memberful, or custom membership sites. Model growth and churn for subscription income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "membership site revenue calculator",
    "Patreon income calculator",
    "recurring subscription revenue",
    "Ko-fi earnings calculator",
    "membership business model",
  ],
  variants: [
    {
      id: "mrr",
      name: "Monthly Recurring Revenue",
      description: "Calculate MRR and growth from memberships",
      fields: [
        {
          name: "members",
          label: "Current Paying Members",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "monthlyPrice",
          label: "Monthly Membership Price",
          type: "number",
          placeholder: "e.g. 9.99",
          prefix: "$",
        },
        {
          name: "platform",
          label: "Platform",
          type: "select",
          options: [
            { label: "Patreon (8–12% fee)", value: "patreon" },
            { label: "Ko-fi (0% fee, free plan)", value: "kofi" },
            { label: "Memberful (10% + $0/mo or 4.9% + $25/mo)", value: "memberful" },
            { label: "Ghost / Custom (Stripe ~3%)", value: "custom" },
          ],
          defaultValue: "patreon",
        },
        {
          name: "monthlyChurn",
          label: "Monthly Churn Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
        {
          name: "newMembersPerMonth",
          label: "New Members per Month",
          type: "number",
          placeholder: "e.g. 20",
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const members = parseFloat(inputs.members as string) || 0;
        const price = parseFloat(inputs.monthlyPrice as string) || 0;
        const platform = inputs.platform as string;
        const churn = parseFloat(inputs.monthlyChurn as string) || 5;
        const newMembers = parseFloat(inputs.newMembersPerMonth as string) || 0;

        const feeRates: Record<string, number> = {
          patreon: 0.10, kofi: 0.02, memberful: 0.049, custom: 0.03,
        };
        const fee = feeRates[platform] || 0.10;

        const grossMrr = members * price;
        const netMrr = grossMrr * (1 - fee);
        const churnedMembers = Math.floor(members * (churn / 100));
        const netGrowth = newMembers - churnedMembers;
        const nextMonthMembers = members + netGrowth;
        const nextMonthMrr = nextMonthMembers * price * (1 - fee);
        const arr = netMrr * 12;

        return {
          primary: { label: "Monthly Net Revenue (MRR)", value: `$${formatNumber(netMrr, 2)}` },
          details: [
            { label: "Gross MRR", value: `$${formatNumber(grossMrr, 2)}` },
            { label: "Platform fee", value: `${fee * 100}% (-$${formatNumber(grossMrr * fee, 2)})` },
            { label: "Net MRR", value: `$${formatNumber(netMrr, 2)}` },
            { label: "Monthly churn (members)", value: formatNumber(churnedMembers) },
            { label: "Net member growth/month", value: `+${netGrowth}` },
            { label: "Next month MRR", value: `$${formatNumber(nextMonthMrr, 2)}` },
            { label: "Annual Recurring Revenue", value: `$${formatNumber(arr, 2)}` },
          ],
          note: "Healthy membership churn is 2–5% monthly. At 5% churn, you lose 46% of members per year — new member acquisition is critical.",
        };
      },
    },
  ],
  relatedSlugs: ["substack-revenue-calculator", "online-course-pricing-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "What platform should I use for membership revenue?",
      answer:
        "Patreon (10% fee) is best for creators with existing fanbases. Ko-fi is free to start. Ghost/Memberful give more control. At $5,000 MRR, switching from Patreon (10%) to a 3% platform saves $420/month.",
    },
    {
      question: "What's a good monthly churn rate for memberships?",
      answer:
        "Monthly churn of 2–4% is healthy. 5–8% means you're losing half your members annually. The best memberships have <2% monthly churn by offering exclusive community, accountability, or ongoing content that can't be binge-consumed.",
    },
    {
      question: "How many members do I need to replace my income?",
      answer:
        "At $9.99/month with 10% platform fee: net $9/member. For $5,000/month you need ~556 members. At $49/month: only ~114 members needed. Higher price + lower volume is often more sustainable.",
    },
  ],
  formula: "Net MRR = Members × Monthly Price × (1 − Platform Fee %)",
};
