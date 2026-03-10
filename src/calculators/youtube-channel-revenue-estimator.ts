import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const youtubeChannelRevenueEstimator: CalculatorDefinition = {
  slug: "youtube-channel-revenue-estimator",
  title: "YouTube Channel Revenue Estimator",
  description:
    "Estimate total YouTube channel income including AdSense, memberships, Super Chat, sponsorships, and merch. Full creator earnings breakdown.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "YouTube channel income estimator",
    "YouTube total earnings",
    "YouTube creator revenue",
    "how much do YouTubers make",
    "YouTube income streams",
  ],
  variants: [
    {
      id: "full",
      name: "Full Revenue Breakdown",
      description: "Estimate all income streams for your channel",
      fields: [
        {
          name: "subscribers",
          label: "Subscribers",
          type: "number",
          placeholder: "e.g. 50000",
        },
        {
          name: "monthlyViews",
          label: "Monthly Views",
          type: "number",
          placeholder: "e.g. 200000",
          suffix: "views",
        },
        {
          name: "rpm",
          label: "Estimated RPM",
          type: "number",
          placeholder: "e.g. 4",
          prefix: "$",
          defaultValue: 4,
        },
        {
          name: "sponsoredVideos",
          label: "Sponsored Videos per Month",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const subs = parseFloat(inputs.subscribers as string) || 0;
        const views = parseFloat(inputs.monthlyViews as string) || 0;
        const rpm = parseFloat(inputs.rpm as string) || 4;
        const sponsored = parseFloat(inputs.sponsoredVideos as string) || 0;

        const adRevenue = (views / 1000) * rpm;

        // Sponsorship rate: roughly $20 per 1000 subscribers for smaller channels
        const sponsorRate = subs < 100000 ? subs * 0.02 : subs * 0.015;
        const sponsorRevenue = sponsored * sponsorRate;

        // Memberships: ~0.5% of subscribers at $4.99/mo
        const membershipRevenue = subs * 0.005 * 4.99 * 0.7; // 70% after YouTube cut

        // Super Chat: rough estimate for engaged channels
        const superChat = views * 0.00002 * 5; // 0.002% viewers, avg $5

        const total = adRevenue + sponsorRevenue + membershipRevenue + superChat;

        return {
          primary: { label: "Estimated Monthly Income", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "AdSense revenue", value: `$${formatNumber(adRevenue, 2)}` },
            { label: "Sponsorship revenue", value: `$${formatNumber(sponsorRevenue, 2)}` },
            { label: "Channel memberships", value: `$${formatNumber(membershipRevenue, 2)}` },
            { label: "Super Chat / donations", value: `$${formatNumber(superChat, 2)}` },
            { label: "Annual total", value: `$${formatNumber(total * 12, 2)}` },
            { label: "Subscribers", value: formatNumber(subs) },
          ],
          note: "Sponsorship rates vary greatly by niche. Tech/finance channels earn 3–5x more per sponsor deal than entertainment.",
        };
      },
    },
  ],
  relatedSlugs: ["youtube-rpm-calculator", "youtube-shorts-calculator", "podcast-sponsorship-rate-calculator"],
  faq: [
    {
      question: "How many views do you need to make $1,000/month on YouTube?",
      answer:
        "At an average $4 RPM, you need ~250,000 monthly views for $1,000 from ads alone. Finance channels ($12 RPM) only need ~83,000 views. Sponsorships can multiply income 3–10x on top of ads.",
    },
    {
      question: "When does YouTube pay creators?",
      answer:
        "YouTube pays monthly via AdSense, around the 21st of each month for the previous month's earnings. You need $100 minimum threshold. Payments are in USD via wire transfer or check.",
    },
    {
      question: "What percentage does YouTube take?",
      answer:
        "YouTube takes 45% of ad revenue. Creators keep 55%. For channel memberships and Super Chat, YouTube takes 30%. This is why RPM is always lower than CPM (what advertisers pay).",
    },
  ],
  formula: "Total Revenue = Ad Revenue + Sponsorships + Memberships + Super Chat",
};
