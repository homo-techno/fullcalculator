import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newsletterRevenueCalculator: CalculatorDefinition = {
  slug: "newsletter-revenue",
  title: "Newsletter Revenue Calculator",
  description:
    "Calculate newsletter revenue from paid subscriptions, sponsorships, and affiliate income based on list size and engagement metrics.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "newsletter revenue",
    "newsletter income",
    "substack earnings",
    "email newsletter money",
    "paid newsletter",
    "newsletter sponsorship",
    "newsletter monetization",
  ],
  variants: [
    {
      slug: "newsletter-revenue",
      title: "Newsletter Revenue Calculator",
      description:
        "Estimate total newsletter revenue from subscriptions and sponsorships.",
      fields: [
        {
          id: "totalSubscribers",
          label: "Total Subscribers",
          type: "number",
          defaultValue: 10000,
        },
        {
          id: "paidConversionRate",
          label: "Paid Conversion Rate (%)",
          type: "number",
          defaultValue: 5,
        },
        {
          id: "monthlySubPrice",
          label: "Monthly Subscription Price ($)",
          type: "number",
          defaultValue: 10,
        },
        {
          id: "platform",
          label: "Newsletter Platform",
          type: "select",
          options: [
            { label: "Substack (10% fee)", value: "substack" },
            { label: "Beehiiv (0% fee)", value: "beehiiv" },
            { label: "Ghost (0% fee + hosting)", value: "ghost" },
            { label: "ConvertKit (3.5% fee)", value: "convertkit" },
          ],
          defaultValue: "substack",
        },
        {
          id: "sponsorsPerMonth",
          label: "Sponsor Placements per Month",
          type: "number",
          defaultValue: 4,
        },
        {
          id: "sponsorCpm",
          label: "Sponsor CPM ($)",
          type: "number",
          defaultValue: 30,
        },
        {
          id: "openRate",
          label: "Email Open Rate (%)",
          type: "number",
          defaultValue: 45,
        },
      ],
      calculate(inputs) {
        const totalSubscribers = parseFloat(inputs.totalSubscribers as string);
        const paidConversionRate =
          parseFloat(inputs.paidConversionRate as string) / 100;
        const monthlySubPrice = parseFloat(inputs.monthlySubPrice as string);
        const platform = inputs.platform as string;
        const sponsorsPerMonth = parseFloat(inputs.sponsorsPerMonth as string);
        const sponsorCpm = parseFloat(inputs.sponsorCpm as string);
        const openRate = parseFloat(inputs.openRate as string) / 100;

        const platformFee: Record<string, number> = {
          substack: 0.1,
          beehiiv: 0.0,
          ghost: 0.0,
          convertkit: 0.035,
        };

        const paidSubscribers = Math.floor(totalSubscribers * paidConversionRate);
        const grossSubRevenue = paidSubscribers * monthlySubPrice;
        const fee = platformFee[platform] || 0.0;
        const platformCut = grossSubRevenue * fee;
        const processingFees = grossSubRevenue * 0.029 + paidSubscribers * 0.3;
        const netSubRevenue = grossSubRevenue - platformCut - processingFees;

        const opens = totalSubscribers * openRate;
        const sponsorRevenue = sponsorsPerMonth * (opens / 1000) * sponsorCpm;

        const totalMonthly = netSubRevenue + sponsorRevenue;

        return {
          "Paid Subscribers": formatNumber(paidSubscribers),
          "Gross Subscription Revenue": "$" + formatNumber(grossSubRevenue),
          "Platform + Processing Fees":
            "$" + formatNumber(platformCut + processingFees),
          "Net Subscription Revenue": "$" + formatNumber(netSubRevenue),
          "Sponsor Revenue": "$" + formatNumber(sponsorRevenue),
          "Total Monthly Revenue": "$" + formatNumber(totalMonthly),
          "Total Annual Revenue": "$" + formatNumber(totalMonthly * 12),
          "Revenue per Subscriber":
            "$" + formatNumber(totalMonthly / totalSubscribers),
        };
      },
    },
    {
      slug: "newsletter-growth-revenue",
      title: "Newsletter Growth Revenue Projection",
      description:
        "Project newsletter revenue as your subscriber list grows.",
      fields: [
        {
          id: "currentSubscribers",
          label: "Current Subscribers",
          type: "number",
          defaultValue: 5000,
        },
        {
          id: "monthlyGrowthRate",
          label: "Monthly Growth Rate (%)",
          type: "number",
          defaultValue: 10,
        },
        {
          id: "monthsProjected",
          label: "Months to Project",
          type: "number",
          defaultValue: 12,
        },
        {
          id: "revenuePerSub",
          label: "Monthly Revenue per Subscriber ($)",
          type: "number",
          defaultValue: 0.5,
        },
      ],
      calculate(inputs) {
        const currentSubscribers = parseFloat(
          inputs.currentSubscribers as string
        );
        const monthlyGrowthRate =
          parseFloat(inputs.monthlyGrowthRate as string) / 100;
        const monthsProjected = parseFloat(inputs.monthsProjected as string);
        const revenuePerSub = parseFloat(inputs.revenuePerSub as string);

        const futureSubscribers =
          currentSubscribers * Math.pow(1 + monthlyGrowthRate, monthsProjected);
        const currentRevenue = currentSubscribers * revenuePerSub;
        const futureRevenue = futureSubscribers * revenuePerSub;

        let totalRevenue = 0;
        for (let i = 0; i < monthsProjected; i++) {
          totalRevenue +=
            currentSubscribers * Math.pow(1 + monthlyGrowthRate, i) *
            revenuePerSub;
        }

        return {
          "Current Monthly Revenue": "$" + formatNumber(currentRevenue),
          "Projected Subscribers": formatNumber(Math.round(futureSubscribers)),
          "Projected Monthly Revenue": "$" + formatNumber(futureRevenue),
          "Total Revenue Over Period": "$" + formatNumber(totalRevenue),
          "Subscriber Growth": formatNumber(
            Math.round(futureSubscribers - currentSubscribers)
          ),
          "Revenue Growth":
            formatNumber(((futureRevenue - currentRevenue) / currentRevenue) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "patreon-income",
    "course-pricing",
    "sponsorship-rate",
    "youtube-revenue",
  ],
  faq: [
    {
      question: "How much can you earn from a paid newsletter?",
      answer:
        "Newsletter earnings depend on list size and paid conversion rate. With 10,000 subscribers at 5% paid conversion and $10/month pricing, you can earn around $5,000/month from subscriptions alone. Adding sponsorships at $30 CPM adds significant revenue.",
    },
    {
      question: "What is a good newsletter sponsor CPM?",
      answer:
        "Newsletter sponsor CPMs typically range from $20-$80 depending on niche and audience quality. Finance and B2B newsletters command $50-$80+ CPM, while general interest newsletters see $20-$40 CPM. Rates are based on total opens, not list size.",
    },
  ],
  formula:
    "Subscription Revenue = Paid Subscribers x Monthly Price - Fees. Sponsor Revenue = Sponsor Placements x (Subscribers x Open Rate / 1,000) x CPM. Total = Subscription Revenue + Sponsor Revenue.",
};
