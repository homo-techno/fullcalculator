import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sponsorshipRateCalculator: CalculatorDefinition = {
  slug: "sponsorship-rate",
  title: "Creator Sponsorship Rate Calculator",
  description:
    "Calculate fair sponsorship rates for content creators based on platform, follower count, engagement rate, and content niche.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "sponsorship rate",
    "influencer rate",
    "brand deal pricing",
    "creator sponsorship",
    "influencer pricing",
    "sponsored content rate",
    "brand partnership pricing",
  ],
  variants: [
    {
      slug: "sponsorship-rate",
      title: "Sponsorship Rate Calculator",
      description:
        "Calculate your recommended sponsorship rate based on audience metrics.",
      fields: [
        {
          id: "platform",
          label: "Primary Platform",
          type: "select",
          options: [
            { label: "YouTube", value: "youtube" },
            { label: "Instagram", value: "instagram" },
            { label: "TikTok", value: "tiktok" },
            { label: "Twitter / X", value: "twitter" },
            { label: "Podcast", value: "podcast" },
            { label: "Blog / Newsletter", value: "blog" },
          ],
          defaultValue: "youtube",
        },
        {
          id: "followers",
          label: "Followers / Subscribers",
          type: "number",
          defaultValue: 100000,
        },
        {
          id: "engagementRate",
          label: "Engagement Rate (%)",
          type: "number",
          defaultValue: 4,
        },
        {
          id: "niche",
          label: "Content Niche",
          type: "select",
          options: [
            { label: "Finance / Business", value: "finance" },
            { label: "Tech / Software", value: "tech" },
            { label: "Beauty / Fashion", value: "beauty" },
            { label: "Health / Fitness", value: "health" },
            { label: "Gaming", value: "gaming" },
            { label: "Food / Cooking", value: "food" },
            { label: "Travel", value: "travel" },
            { label: "Entertainment / Comedy", value: "entertainment" },
          ],
          defaultValue: "tech",
        },
        {
          id: "deliverableType",
          label: "Deliverable Type",
          type: "select",
          options: [
            { label: "Dedicated Video / Post", value: "dedicated" },
            { label: "Integration / Mention", value: "integration" },
            { label: "Story / Short", value: "story" },
          ],
          defaultValue: "integration",
        },
      ],
      calculate(inputs) {
        const platform = inputs.platform as string;
        const followers = parseFloat(inputs.followers as string);
        const engagementRate = parseFloat(inputs.engagementRate as string) / 100;
        const niche = inputs.niche as string;
        const deliverableType = inputs.deliverableType as string;

        // Base CPM by platform (cost per 1K followers)
        const platformCpm: Record<string, number> = {
          youtube: 25,
          instagram: 10,
          tiktok: 8,
          twitter: 5,
          podcast: 20,
          blog: 15,
        };

        // Niche multipliers
        const nicheMultiplier: Record<string, number> = {
          finance: 2.0,
          tech: 1.8,
          beauty: 1.5,
          health: 1.4,
          gaming: 1.0,
          food: 1.2,
          travel: 1.3,
          entertainment: 0.9,
        };

        // Deliverable multipliers
        const deliverableMultiplier: Record<string, number> = {
          dedicated: 2.0,
          integration: 1.0,
          story: 0.4,
        };

        // Engagement rate bonus (above 3% is above average)
        const engagementBonus = engagementRate > 0.03 ? 1 + (engagementRate - 0.03) * 10 : 1.0;

        const baseCpm = platformCpm[platform] || 10;
        const nMult = nicheMultiplier[niche] || 1.0;
        const dMult = deliverableMultiplier[deliverableType] || 1.0;

        const baseRate = (followers / 1000) * baseCpm * nMult * dMult * engagementBonus;
        const lowRate = baseRate * 0.7;
        const highRate = baseRate * 1.4;

        const estimatedReach = followers * engagementRate * 3;
        const costPerEngagement = baseRate / (followers * engagementRate);

        return {
          "Recommended Rate": "$" + formatNumber(baseRate),
          "Rate Range (Low)": "$" + formatNumber(lowRate),
          "Rate Range (High)": "$" + formatNumber(highRate),
          "Estimated Reach": formatNumber(Math.round(estimatedReach)),
          "Cost per Engagement": "$" + formatNumber(costPerEngagement),
          "Engagement Bonus": formatNumber(engagementBonus) + "x",
          "CPM (per 1K followers)":
            "$" + formatNumber(baseCpm * nMult * dMult),
        };
      },
    },
    {
      slug: "sponsorship-rate-package",
      title: "Sponsorship Package Builder",
      description:
        "Build a multi-platform sponsorship package with total pricing.",
      fields: [
        {
          id: "youtubeFollowers",
          label: "YouTube Subscribers",
          type: "number",
          defaultValue: 100000,
        },
        {
          id: "instagramFollowers",
          label: "Instagram Followers",
          type: "number",
          defaultValue: 50000,
        },
        {
          id: "tiktokFollowers",
          label: "TikTok Followers",
          type: "number",
          defaultValue: 75000,
        },
        {
          id: "engagementRate",
          label: "Average Engagement Rate (%)",
          type: "number",
          defaultValue: 4,
        },
      ],
      calculate(inputs) {
        const ytFollowers = parseFloat(inputs.youtubeFollowers as string);
        const igFollowers = parseFloat(inputs.instagramFollowers as string);
        const ttFollowers = parseFloat(inputs.tiktokFollowers as string);
        const engagementRate = parseFloat(inputs.engagementRate as string) / 100;

        const engBonus = engagementRate > 0.03 ? 1 + (engagementRate - 0.03) * 10 : 1.0;

        const ytRate = (ytFollowers / 1000) * 25 * engBonus;
        const igRate = (igFollowers / 1000) * 10 * engBonus;
        const ttRate = (ttFollowers / 1000) * 8 * engBonus;
        const packageRate = (ytRate + igRate + ttRate) * 0.85;

        return {
          "YouTube Sponsor Rate": "$" + formatNumber(ytRate),
          "Instagram Sponsor Rate": "$" + formatNumber(igRate),
          "TikTok Sponsor Rate": "$" + formatNumber(ttRate),
          "Individual Total": "$" + formatNumber(ytRate + igRate + ttRate),
          "Package Deal (15% discount)": "$" + formatNumber(packageRate),
          "Total Audience": formatNumber(ytFollowers + igFollowers + ttFollowers),
        };
      },
    },
  ],
  relatedSlugs: [
    "youtube-revenue",
    "tiktok-earnings",
    "twitch-income",
    "newsletter-revenue",
  ],
  faq: [
    {
      question: "How do creators determine their sponsorship rates?",
      answer:
        "Sponsorship rates are typically based on follower count, engagement rate, content niche, and platform. A common formula is CPM (cost per 1,000 followers) multiplied by audience size and niche premium. High-engagement creators in lucrative niches like finance or tech can command significantly higher rates.",
    },
    {
      question: "What is a good engagement rate for sponsorships?",
      answer:
        "An engagement rate above 3% is considered good for sponsorship purposes. Rates of 5%+ are excellent and allow creators to charge premium prices. Micro-influencers (10K-100K followers) often have higher engagement rates than mega-influencers, making them attractive to brands.",
    },
  ],
  formula:
    "Base Rate = (Followers / 1,000) x Platform CPM x Niche Multiplier x Deliverable Multiplier x Engagement Bonus. Engagement Bonus = 1 + (Rate - 3%) x 10 for rates above 3%.",
};
