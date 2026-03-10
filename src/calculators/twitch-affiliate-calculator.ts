import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const twitchAffiliateCalculator: CalculatorDefinition = {
  slug: "twitch-affiliate-calculator",
  title: "Twitch Affiliate & Partner Revenue Calculator",
  description:
    "Calculate Twitch streamer earnings from subscriptions, Bits, ads, and donations. Estimate monthly income for affiliates and partners.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Twitch affiliate earnings calculator",
    "Twitch partner revenue",
    "Twitch subscription income",
    "how much do Twitch streamers make",
    "Twitch monetization calculator",
  ],
  variants: [
    {
      id: "full",
      name: "Full Streamer Income",
      description: "Calculate all Twitch revenue streams",
      fields: [
        {
          name: "tier1Subs",
          label: "Tier 1 Subscribers ($4.99)",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "subs",
        },
        {
          name: "tier2Subs",
          label: "Tier 2 Subscribers ($9.99)",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "subs",
          defaultValue: 0,
        },
        {
          name: "avgConcurrent",
          label: "Average Concurrent Viewers",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "viewers",
        },
        {
          name: "hoursStreamed",
          label: "Hours Streamed per Month",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "hours",
        },
        {
          name: "status",
          label: "Streamer Status",
          type: "select",
          options: [
            { label: "Affiliate (50% sub split)", value: "affiliate" },
            { label: "Partner (50% sub split)", value: "partner50" },
            { label: "Partner (60% sub split)", value: "partner60" },
            { label: "Partner (70% sub split)", value: "partner70" },
          ],
          defaultValue: "affiliate",
        },
      ],
      calculate: (inputs) => {
        const tier1 = parseFloat(inputs.tier1Subs as string) || 0;
        const tier2 = parseFloat(inputs.tier2Subs as string) || 0;
        const concurrent = parseFloat(inputs.avgConcurrent as string) || 0;
        const hours = parseFloat(inputs.hoursStreamed as string) || 0;
        const status = inputs.status as string;

        const splitMap: Record<string, number> = {
          affiliate: 0.50, partner50: 0.50, partner60: 0.60, partner70: 0.70,
        };
        const split = splitMap[status] || 0.50;

        const subRevenue = (tier1 * 4.99 + tier2 * 9.99) * split;

        // Bits: avg 3 bits per viewer per hour at $0.01/bit
        const bitsRevenue = concurrent * hours * 3 * 0.01 * 0.7; // 70% to creator
        // Ad revenue: ~$0.005 per viewer per hour for ads
        const adRevenue = concurrent * hours * 0.005;
        // Donations: ~$0.10/viewer/hour average
        const donationRevenue = concurrent * hours * 0.05;

        const total = subRevenue + bitsRevenue + adRevenue + donationRevenue;

        return {
          primary: { label: "Estimated Monthly Revenue", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Subscription revenue", value: `$${formatNumber(subRevenue, 2)}` },
            { label: "Bits revenue", value: `$${formatNumber(bitsRevenue, 2)}` },
            { label: "Ad revenue", value: `$${formatNumber(adRevenue, 2)}` },
            { label: "Donations estimate", value: `$${formatNumber(donationRevenue, 2)}` },
            { label: "Sub split percentage", value: `${split * 100}%` },
            { label: "Annual projection", value: `$${formatNumber(total * 12, 2)}` },
          ],
          note: "Sponsorships (the largest income source for top streamers) are not included. Top streamers earn 80% of income from sponsors.",
        };
      },
    },
  ],
  relatedSlugs: ["youtube-rpm-calculator", "youtube-channel-revenue-estimator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "How much does Twitch pay per subscriber?",
      answer:
        "Twitch Affiliates and most Partners keep 50% of subscription fees. A Tier 1 sub ($4.99) pays you $2.50. Top partners negotiate 60–70% splits. With 1,000 subs, you'd earn $2,500–$3,500/month from subscriptions alone.",
    },
    {
      question: "How many viewers do you need to make money on Twitch?",
      answer:
        "Twitch Affiliate requires 50 followers, 500 minutes broadcast, 7 unique broadcast days, and 3 average concurrent viewers in 30 days. Making a living wage (~$3,000/mo) typically requires 200–500 average concurrent viewers.",
    },
    {
      question: "What is a Twitch Bit worth?",
      answer:
        "Viewers pay $1.40 for 100 Bits. Streamers receive $1.00 per 100 Bits (Twitch keeps 40%). Bits are used to cheer in chat during streams.",
    },
  ],
  formula: "Total Revenue = (Subs × Split Rate) + Bits + Ads + Donations",
};
