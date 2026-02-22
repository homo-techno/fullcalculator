import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engagementRateCalculator: CalculatorDefinition = {
  slug: "engagement-rate",
  title: "Social Media Engagement Rate Calculator",
  description: "Free social media engagement rate calculator. Measure how actively your audience interacts with your content across social media platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["engagement rate", "social media engagement", "likes", "comments", "shares", "social metrics"],
  variants: [
    {
      id: "byFollowers",
      name: "Engagement by Followers",
      fields: [
        { name: "likes", label: "Likes", type: "number", placeholder: "e.g. 500" },
        { name: "comments", label: "Comments", type: "number", placeholder: "e.g. 50" },
        { name: "shares", label: "Shares/Retweets", type: "number", placeholder: "e.g. 30" },
        { name: "saves", label: "Saves/Bookmarks", type: "number", placeholder: "e.g. 20" },
        { name: "followers", label: "Total Followers", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const likes = inputs.likes as number || 0;
        const comments = inputs.comments as number || 0;
        const shares = inputs.shares as number || 0;
        const saves = inputs.saves as number || 0;
        const followers = inputs.followers as number;
        if (!followers) return null;
        const totalEngagements = likes + comments + shares + saves;
        const engagementRate = (totalEngagements / followers) * 100;
        const rating = engagementRate > 6 ? "Excellent" : engagementRate > 3 ? "Good" : engagementRate > 1 ? "Average" : "Low";
        return {
          primary: { label: "Engagement Rate", value: `${formatNumber(engagementRate, 2)}%` },
          details: [
            { label: "Total Engagements", value: formatNumber(totalEngagements, 0) },
            { label: "Followers", value: formatNumber(followers, 0) },
            { label: "Like Rate", value: `${formatNumber((likes / followers) * 100, 2)}%` },
            { label: "Comment Rate", value: `${formatNumber((comments / followers) * 100, 2)}%` },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "byReach",
      name: "Engagement by Reach",
      fields: [
        { name: "totalEngagements", label: "Total Engagements", type: "number", placeholder: "e.g. 600" },
        { name: "reach", label: "Post Reach", type: "number", placeholder: "e.g. 8000" },
        { name: "impressions", label: "Post Impressions", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const engagements = inputs.totalEngagements as number;
        const reach = inputs.reach as number;
        const impressions = inputs.impressions as number;
        if (!engagements || !reach) return null;
        const engagementByReach = (engagements / reach) * 100;
        const engagementByImpressions = impressions ? (engagements / impressions) * 100 : 0;
        const reachRate = impressions ? (reach / impressions) * 100 : 0;
        return {
          primary: { label: "Engagement Rate (by Reach)", value: `${formatNumber(engagementByReach, 2)}%` },
          details: [
            { label: "Engagement by Impressions", value: `${formatNumber(engagementByImpressions, 2)}%` },
            { label: "Total Engagements", value: formatNumber(engagements, 0) },
            { label: "Reach", value: formatNumber(reach, 0) },
            { label: "Reach Rate", value: `${formatNumber(reachRate, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["social-media-roi", "influencer-rate", "ctr-calculator"],
  faq: [
    { question: "What is a good engagement rate?", answer: "On Instagram, 3-6% is good and above 6% is excellent. On Facebook, 1-2% is average. On Twitter/X, 0.5-1% is typical. Rates vary by platform, industry, and follower count." },
    { question: "How is engagement rate calculated?", answer: "Engagement rate is typically calculated as (Total Engagements / Total Followers) x 100. Some marketers use reach instead of followers for a more accurate picture of active engagement." },
  ],
  formula: "Engagement Rate = (Total Engagements / Followers) x 100",
};
