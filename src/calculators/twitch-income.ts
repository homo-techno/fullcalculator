import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const twitchIncomeCalculator: CalculatorDefinition = {
  slug: "twitch-income",
  title: "Twitch Streamer Income Calculator",
  description:
    "Estimate Twitch streaming income from subscriptions, bits, ads, and donations based on viewer counts and stream schedule.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "twitch income",
    "twitch earnings",
    "twitch streamer money",
    "twitch subs",
    "twitch bits",
    "twitch ads",
    "streamer income",
    "twitch revenue",
  ],
  variants: [
    {
      slug: "twitch-income",
      title: "Twitch Streamer Income Calculator",
      description:
        "Calculate estimated monthly Twitch income from all revenue streams.",
      fields: [
        {
          id: "avgViewers",
          label: "Average Concurrent Viewers",
          type: "number",
          defaultValue: 200,
        },
        {
          id: "subscribers",
          label: "Total Subscribers",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "subTier",
          label: "Average Sub Tier",
          type: "select",
          options: [
            { label: "Tier 1 ($4.99)", value: "tier1" },
            { label: "Mix of Tier 1 & 2", value: "mixed" },
            { label: "Tier 2 ($9.99)", value: "tier2" },
          ],
          defaultValue: "tier1",
        },
        {
          id: "partnerStatus",
          label: "Partner Status",
          type: "select",
          options: [
            { label: "Affiliate (50% rev share)", value: "affiliate" },
            { label: "Partner (60% rev share)", value: "partner" },
            { label: "Top Partner (70% rev share)", value: "top_partner" },
          ],
          defaultValue: "partner",
        },
        {
          id: "hoursPerWeek",
          label: "Stream Hours per Week",
          type: "number",
          defaultValue: 25,
        },
        {
          id: "bitsPerMonth",
          label: "Bits Received per Month",
          type: "number",
          defaultValue: 10000,
        },
        {
          id: "donationsPerMonth",
          label: "Direct Donations per Month ($)",
          type: "number",
          defaultValue: 300,
        },
      ],
      calculate(inputs) {
        const avgViewers = parseFloat(inputs.avgViewers as string);
        const subscribers = parseFloat(inputs.subscribers as string);
        const subTier = inputs.subTier as string;
        const partnerStatus = inputs.partnerStatus as string;
        const hoursPerWeek = parseFloat(inputs.hoursPerWeek as string);
        const bitsPerMonth = parseFloat(inputs.bitsPerMonth as string);
        const donationsPerMonth = parseFloat(inputs.donationsPerMonth as string);

        const subPrice: Record<string, number> = {
          tier1: 4.99,
          mixed: 6.5,
          tier2: 9.99,
        };

        const revShare: Record<string, number> = {
          affiliate: 0.5,
          partner: 0.6,
          top_partner: 0.7,
        };

        const price = subPrice[subTier] || 4.99;
        const share = revShare[partnerStatus] || 0.5;

        const subRevenue = subscribers * price * share;
        const bitsRevenue = bitsPerMonth * 0.01; // 1 bit = $0.01
        const adRevenue = avgViewers * hoursPerWeek * 4.33 * 0.0035; // ~$3.50 CPM
        const totalMonthly = subRevenue + bitsRevenue + adRevenue + donationsPerMonth;
        const hourlyRate = totalMonthly / (hoursPerWeek * 4.33);

        return {
          "Subscription Revenue": "$" + formatNumber(subRevenue),
          "Bits Revenue": "$" + formatNumber(bitsRevenue),
          "Ad Revenue (est.)": "$" + formatNumber(adRevenue),
          "Donations": "$" + formatNumber(donationsPerMonth),
          "Total Monthly Income": "$" + formatNumber(totalMonthly),
          "Annual Income": "$" + formatNumber(totalMonthly * 12),
          "Effective Hourly Rate": "$" + formatNumber(hourlyRate),
          "Monthly Stream Hours": formatNumber(Math.round(hoursPerWeek * 4.33)),
        };
      },
    },
  ],
  relatedSlugs: [
    "youtube-revenue",
    "tiktok-earnings",
    "sponsorship-rate",
    "patreon-income",
  ],
  faq: [
    {
      question: "How much do Twitch streamers make per subscriber?",
      answer:
        "Twitch Affiliates receive 50% of the subscription price ($2.50 per Tier 1 sub). Partners typically receive 60%, and top partners can negotiate up to 70%. Tier 1 subs cost $4.99, Tier 2 cost $9.99, and Tier 3 cost $24.99.",
    },
    {
      question: "How much are Twitch bits worth to streamers?",
      answer:
        "Each Twitch bit is worth $0.01 to the streamer. So 100 bits = $1.00, 1,000 bits = $10.00, etc. Viewers pay a slight premium when purchasing bits, but streamers receive the full $0.01 per bit.",
    },
    {
      question: "How many viewers do you need to make a living on Twitch?",
      answer:
        "Generally, streamers with 200+ average concurrent viewers can earn a modest full-time income when combining subs, bits, ads, and donations. However, income varies greatly. Many supplement with YouTube, sponsorships, and merchandise.",
    },
  ],
  formula:
    "Sub Revenue = Subscribers x Sub Price x Revenue Share %. Bits Revenue = Bits x $0.01. Ad Revenue = Avg Viewers x Monthly Stream Hours x $0.0035. Total = Subs + Bits + Ads + Donations.",
};
