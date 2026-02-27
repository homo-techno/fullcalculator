import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tiktokEarningsCalculator: CalculatorDefinition = {
  slug: "tiktok-earnings",
  title: "TikTok Creator Earnings Calculator",
  description:
    "Estimate TikTok creator earnings from the Creator Fund, brand deals, gifts, and affiliate marketing based on followers and engagement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tiktok earnings",
    "tiktok money",
    "tiktok creator fund",
    "tiktok income",
    "tiktok influencer",
    "tiktok monetization",
    "tiktok creator",
  ],
  variants: [
    {
      slug: "tiktok-earnings",
      title: "TikTok Creator Fund Earnings",
      description:
        "Estimate earnings from TikTok's Creator Rewards Program based on views and engagement.",
      fields: [
        {
          id: "monthlyViews",
          label: "Monthly Video Views",
          type: "number",
          defaultValue: 500000,
        },
        {
          id: "followers",
          label: "Total Followers",
          type: "number",
          defaultValue: 50000,
        },
        {
          id: "engagementRate",
          label: "Engagement Rate (%)",
          type: "number",
          defaultValue: 5,
        },
        {
          id: "avgVideoLength",
          label: "Average Video Length",
          type: "select",
          options: [
            { label: "Under 1 minute", value: "short" },
            { label: "1-3 minutes", value: "medium" },
            { label: "3-10 minutes", value: "long" },
            { label: "Over 10 minutes", value: "extra_long" },
          ],
          defaultValue: "medium",
        },
        {
          id: "videosPerWeek",
          label: "Videos per Week",
          type: "number",
          defaultValue: 5,
        },
      ],
      calculate(inputs) {
        const monthlyViews = parseFloat(inputs.monthlyViews as string);
        const followers = parseFloat(inputs.followers as string);
        const engagementRate = parseFloat(inputs.engagementRate as string) / 100;
        const avgVideoLength = inputs.avgVideoLength as string;
        const videosPerWeek = parseFloat(inputs.videosPerWeek as string);

        // Creator Rewards Program pays based on qualified views (1min+ videos)
        const lengthMultiplier: Record<string, number> = {
          short: 0.3,
          medium: 1.0,
          long: 1.5,
          extra_long: 2.0,
        };

        // Base RPM ranges $0.20-$1.00 per 1K views for Creator Fund
        const baseRpm = 0.5;
        const rpm = baseRpm * (lengthMultiplier[avgVideoLength] || 1.0);

        const creatorFundEarnings = (monthlyViews / 1000) * rpm;
        const estimatedGifts = monthlyViews * engagementRate * 0.001 * 0.05;
        const videosPerMonth = videosPerWeek * 4.33;
        const viewsPerVideo = monthlyViews / videosPerMonth;

        // Brand deal estimate based on followers and engagement
        const brandDealRate = followers * engagementRate * 0.15;

        return {
          "Creator Fund Earnings": "$" + formatNumber(creatorFundEarnings),
          "Estimated Gift Revenue": "$" + formatNumber(estimatedGifts),
          "Est. Brand Deal Rate (per post)": "$" + formatNumber(brandDealRate),
          "Effective RPM": "$" + formatNumber(rpm),
          "Monthly Videos": formatNumber(Math.round(videosPerMonth)),
          "Avg Views per Video": formatNumber(Math.round(viewsPerVideo)),
          "Annual Creator Fund": "$" + formatNumber(creatorFundEarnings * 12),
        };
      },
    },
    {
      slug: "tiktok-total-income",
      title: "Total TikTok Income Estimator",
      description:
        "Estimate total TikTok income across all revenue streams.",
      fields: [
        {
          id: "monthlyViews",
          label: "Monthly Views",
          type: "number",
          defaultValue: 1000000,
        },
        {
          id: "followers",
          label: "Followers",
          type: "number",
          defaultValue: 100000,
        },
        {
          id: "brandDealsPerMonth",
          label: "Brand Deals per Month",
          type: "number",
          defaultValue: 2,
        },
        {
          id: "brandDealRate",
          label: "Average Brand Deal Rate ($)",
          type: "number",
          defaultValue: 2000,
        },
        {
          id: "affiliateConversions",
          label: "Monthly Affiliate Conversions",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "avgCommission",
          label: "Average Affiliate Commission ($)",
          type: "number",
          defaultValue: 15,
        },
      ],
      calculate(inputs) {
        const monthlyViews = parseFloat(inputs.monthlyViews as string);
        const brandDealsPerMonth = parseFloat(inputs.brandDealsPerMonth as string);
        const brandDealRate = parseFloat(inputs.brandDealRate as string);
        const affiliateConversions = parseFloat(inputs.affiliateConversions as string);
        const avgCommission = parseFloat(inputs.avgCommission as string);

        const creatorFund = (monthlyViews / 1000) * 0.5;
        const brandIncome = brandDealsPerMonth * brandDealRate;
        const affiliateIncome = affiliateConversions * avgCommission;
        const giftEstimate = monthlyViews * 0.00005;
        const totalMonthly = creatorFund + brandIncome + affiliateIncome + giftEstimate;

        return {
          "Creator Fund": "$" + formatNumber(creatorFund),
          "Brand Deals": "$" + formatNumber(brandIncome),
          "Affiliate Income": "$" + formatNumber(affiliateIncome),
          "Gift Estimate": "$" + formatNumber(giftEstimate),
          "Total Monthly Income": "$" + formatNumber(totalMonthly),
          "Total Annual Income": "$" + formatNumber(totalMonthly * 12),
        };
      },
    },
  ],
  relatedSlugs: [
    "youtube-revenue",
    "twitch-income",
    "sponsorship-rate",
    "patreon-income",
  ],
  faq: [
    {
      question: "How much does TikTok pay per 1,000 views?",
      answer:
        "TikTok's Creator Rewards Program pays approximately $0.20-$1.00 per 1,000 qualified views. Longer videos (over 1 minute) earn significantly more. The exact rate depends on factors like audience location, engagement quality, and content originality.",
    },
    {
      question: "How many followers do you need to make money on TikTok?",
      answer:
        "To join TikTok's Creator Rewards Program, you need at least 10,000 followers and 100,000 video views in the last 30 days. However, creators can earn through brand deals and affiliate marketing with smaller audiences if their engagement rate is high.",
    },
  ],
  formula:
    "Creator Fund Earnings = (Monthly Views / 1,000) x RPM. Brand Deal Rate = Followers x Engagement Rate x $0.15. Total Income = Creator Fund + Brand Deals + Affiliate Income + Gifts.",
};
