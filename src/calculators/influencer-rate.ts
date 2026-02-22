import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const influencerRateCalculator: CalculatorDefinition = {
  slug: "influencer-rate",
  title: "Influencer Rate Calculator",
  description: "Free influencer rate calculator. Estimate fair pricing for influencer marketing collaborations based on follower count, engagement, and platform.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["influencer rate", "influencer pricing", "sponsored post", "influencer marketing", "creator rate"],
  variants: [
    {
      id: "basic",
      name: "Estimate Influencer Rate",
      fields: [
        { name: "followers", label: "Follower Count", type: "number", placeholder: "e.g. 50000" },
        { name: "engagementRate", label: "Engagement Rate (%)", type: "number", placeholder: "e.g. 3.5" },
        { name: "platform", label: "Platform", type: "select", options: [
          { label: "Instagram", value: "instagram" },
          { label: "TikTok", value: "tiktok" },
          { label: "YouTube", value: "youtube" },
          { label: "Twitter/X", value: "twitter" },
        ] },
      ],
      calculate: (inputs) => {
        const followers = inputs.followers as number;
        const engRate = inputs.engagementRate as number;
        const platform = inputs.platform as string;
        if (!followers || !engRate) return null;
        const platformMultiplier = platform === "youtube" ? 20 : platform === "tiktok" ? 12 : platform === "instagram" ? 10 : 5;
        const engagementMultiplier = engRate > 5 ? 1.5 : engRate > 3 ? 1.2 : engRate > 1 ? 1 : 0.7;
        const baseRate = (followers / 1000) * platformMultiplier;
        const estimatedRate = baseRate * engagementMultiplier;
        const lowRange = estimatedRate * 0.7;
        const highRange = estimatedRate * 1.5;
        const cpe = estimatedRate / (followers * (engRate / 100));
        return {
          primary: { label: "Estimated Rate per Post", value: `$${formatNumber(estimatedRate, 2)}` },
          details: [
            { label: "Low Range", value: `$${formatNumber(lowRange, 2)}` },
            { label: "High Range", value: `$${formatNumber(highRange, 2)}` },
            { label: "Cost per Engagement", value: `$${formatNumber(cpe, 2)}` },
            { label: "Expected Engagements", value: formatNumber(followers * (engRate / 100), 0) },
            { label: "Follower Tier", value: followers >= 1000000 ? "Mega" : followers >= 100000 ? "Macro" : followers >= 10000 ? "Micro" : "Nano" },
          ],
        };
      },
    },
    {
      id: "roi",
      name: "Influencer Campaign ROI",
      fields: [
        { name: "influencerCost", label: "Influencer Cost ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "revenueGenerated", label: "Revenue Generated ($)", type: "number", placeholder: "e.g. 8000" },
        { name: "impressions", label: "Impressions", type: "number", placeholder: "e.g. 100000" },
        { name: "clicks", label: "Link Clicks", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const cost = inputs.influencerCost as number;
        const revenue = inputs.revenueGenerated as number;
        const impressions = inputs.impressions as number;
        const clicks = inputs.clicks as number;
        if (!cost || !revenue) return null;
        const roi = ((revenue - cost) / cost) * 100;
        const cpm = impressions ? (cost / impressions) * 1000 : 0;
        const cpc = clicks ? cost / clicks : 0;
        return {
          primary: { label: "Campaign ROI", value: `${formatNumber(roi, 1)}%` },
          details: [
            { label: "Revenue Generated", value: `$${formatNumber(revenue, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(revenue - cost, 2)}` },
            { label: "Effective CPM", value: `$${formatNumber(cpm, 2)}` },
            { label: "Effective CPC", value: `$${formatNumber(cpc, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["engagement-rate", "social-media-roi", "cpm-calculator"],
  faq: [
    { question: "How much do influencers charge?", answer: "Nano influencers (1K-10K followers) charge $10-$100 per post. Micro (10K-100K) charge $100-$1,000. Macro (100K-1M) charge $1,000-$10,000. Mega (1M+) charge $10,000+. Rates vary by platform, niche, and engagement." },
    { question: "How do I calculate influencer ROI?", answer: "Influencer ROI = ((Revenue Generated - Influencer Cost) / Influencer Cost) x 100. Track revenue using unique discount codes, UTM parameters, or affiliate links to attribute sales to specific influencers." },
  ],
  formula: "Estimated Rate = (Followers / 1,000) x Platform Rate x Engagement Multiplier",
};
