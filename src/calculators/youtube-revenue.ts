import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const youtubeRevenueCalculator: CalculatorDefinition = {
  slug: "youtube-revenue",
  title: "YouTube Revenue Estimator",
  description:
    "Estimate YouTube channel earnings based on views, CPM rates, niche, and monetization strategies including ads, sponsorships, and memberships.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "youtube revenue",
    "youtube earnings",
    "youtube money",
    "youtube cpm",
    "youtube income",
    "youtube monetization",
    "adsense earnings",
    "youtube creator earnings",
  ],
  variants: [
    {
      slug: "youtube-revenue",
      title: "YouTube Ad Revenue Estimator",
      description:
        "Calculate estimated YouTube ad revenue based on views and CPM.",
      fields: [
        {
          id: "monthlyViews",
          label: "Monthly Views",
          type: "number",
          defaultValue: 100000,
        },
        {
          id: "niche",
          label: "Content Niche",
          type: "select",
          options: [
            { label: "Finance / Business ($12-$30 CPM)", value: "finance" },
            { label: "Tech / Software ($8-$20 CPM)", value: "tech" },
            { label: "Health / Fitness ($6-$15 CPM)", value: "health" },
            { label: "Education ($5-$12 CPM)", value: "education" },
            { label: "Entertainment ($2-$6 CPM)", value: "entertainment" },
            { label: "Gaming ($2-$5 CPM)", value: "gaming" },
            { label: "Lifestyle / Vlog ($3-$8 CPM)", value: "lifestyle" },
          ],
          defaultValue: "tech",
        },
        {
          id: "adRate",
          label: "Estimated Ad Playback Rate (%)",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "videosPerMonth",
          label: "Videos Published per Month",
          type: "number",
          defaultValue: 8,
        },
      ],
      calculate(inputs) {
        const monthlyViews = parseFloat(inputs.monthlyViews as string);
        const niche = inputs.niche as string;
        const adRate = parseFloat(inputs.adRate as string) / 100;
        const videosPerMonth = parseFloat(inputs.videosPerMonth as string);

        const cpmRanges: Record<string, { low: number; mid: number; high: number }> = {
          finance: { low: 12, mid: 20, high: 30 },
          tech: { low: 8, mid: 14, high: 20 },
          health: { low: 6, mid: 10, high: 15 },
          education: { low: 5, mid: 8, high: 12 },
          entertainment: { low: 2, mid: 4, high: 6 },
          gaming: { low: 2, mid: 3.5, high: 5 },
          lifestyle: { low: 3, mid: 5.5, high: 8 },
        };

        const cpm = cpmRanges[niche] || cpmRanges["tech"];
        const monetizedViews = monthlyViews * adRate;

        const lowRevenue = (monetizedViews / 1000) * cpm.low;
        const midRevenue = (monetizedViews / 1000) * cpm.mid;
        const highRevenue = (monetizedViews / 1000) * cpm.high;

        const revenuePerVideo = midRevenue / videosPerMonth;

        return {
          "Monetized Views": formatNumber(monetizedViews),
          "Est. Monthly Revenue (Low)": "$" + formatNumber(lowRevenue),
          "Est. Monthly Revenue (Mid)": "$" + formatNumber(midRevenue),
          "Est. Monthly Revenue (High)": "$" + formatNumber(highRevenue),
          "Revenue per Video": "$" + formatNumber(revenuePerVideo),
          "Est. Annual Revenue (Mid)": "$" + formatNumber(midRevenue * 12),
          "RPM (Revenue per 1K Views)":
            "$" + formatNumber((midRevenue / monthlyViews) * 1000),
        };
      },
    },
    {
      slug: "youtube-revenue-total",
      title: "Total YouTube Income Calculator",
      description:
        "Estimate total YouTube income including ads, sponsorships, and memberships.",
      fields: [
        {
          id: "monthlyViews",
          label: "Monthly Views",
          type: "number",
          defaultValue: 100000,
        },
        {
          id: "cpm",
          label: "Ad CPM ($)",
          type: "number",
          defaultValue: 10,
        },
        {
          id: "adPlaybackRate",
          label: "Ad Playback Rate (%)",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "sponsorDeals",
          label: "Sponsor Deals per Month",
          type: "number",
          defaultValue: 2,
        },
        {
          id: "sponsorRate",
          label: "Average Sponsor Deal ($)",
          type: "number",
          defaultValue: 1500,
        },
        {
          id: "members",
          label: "Channel Members",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "memberRate",
          label: "Average Membership Fee ($)",
          type: "number",
          defaultValue: 4.99,
        },
      ],
      calculate(inputs) {
        const monthlyViews = parseFloat(inputs.monthlyViews as string);
        const cpm = parseFloat(inputs.cpm as string);
        const adPlaybackRate = parseFloat(inputs.adPlaybackRate as string) / 100;
        const sponsorDeals = parseFloat(inputs.sponsorDeals as string);
        const sponsorRate = parseFloat(inputs.sponsorRate as string);
        const members = parseFloat(inputs.members as string);
        const memberRate = parseFloat(inputs.memberRate as string);

        const adRevenue = (monthlyViews * adPlaybackRate / 1000) * cpm;
        const sponsorRevenue = sponsorDeals * sponsorRate;
        const memberRevenue = members * memberRate * 0.7; // YouTube takes 30%
        const totalMonthly = adRevenue + sponsorRevenue + memberRevenue;

        return {
          "Ad Revenue": "$" + formatNumber(adRevenue),
          "Sponsorship Revenue": "$" + formatNumber(sponsorRevenue),
          "Membership Revenue (after YT cut)": "$" + formatNumber(memberRevenue),
          "Total Monthly Income": "$" + formatNumber(totalMonthly),
          "Total Annual Income": "$" + formatNumber(totalMonthly * 12),
          "Ad Revenue %": formatNumber((adRevenue / totalMonthly) * 100) + "%",
          "Sponsor Revenue %":
            formatNumber((sponsorRevenue / totalMonthly) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "tiktok-earnings",
    "twitch-income",
    "sponsorship-rate",
    "patreon-income",
  ],
  faq: [
    {
      question: "How much do YouTubers make per 1,000 views?",
      answer:
        "YouTube RPM (Revenue per Mille) typically ranges from $1 to $15 depending on niche, audience location, and ad rates. Finance and tech channels earn $8-$20+ RPM, while entertainment and gaming channels earn $1-$5 RPM. These figures represent what creators actually receive after YouTube's 45% cut.",
    },
    {
      question: "What is the difference between CPM and RPM?",
      answer:
        "CPM (Cost per Mille) is what advertisers pay per 1,000 ad impressions. RPM (Revenue per Mille) is what creators earn per 1,000 video views. RPM is always lower than CPM because not all views are monetized, and YouTube takes a 45% share of ad revenue.",
    },
    {
      question: "When can you start earning money on YouTube?",
      answer:
        "To join the YouTube Partner Program, you need at least 1,000 subscribers and 4,000 watch hours in the past 12 months (or 1,000 subscribers and 10 million Shorts views in 90 days). Once accepted, you can earn from ads, memberships, Super Chats, and the Shorts revenue fund.",
    },
  ],
  formula:
    "Ad Revenue = (Monthly Views x Ad Playback Rate / 1,000) x CPM. Total Income = Ad Revenue + Sponsorship Revenue + Membership Revenue. Membership Revenue = Members x Fee x 0.7 (YouTube takes 30%).",
};
