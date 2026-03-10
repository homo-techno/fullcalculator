import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tiktokCreatorFundCalculator: CalculatorDefinition = {
  slug: "tiktok-creator-fund-calculator",
  title: "TikTok Creator Fund Calculator",
  description:
    "Calculate TikTok Creator Fund and Creativity Program earnings per view. Compare TikTok vs YouTube monetization rates for the same content.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "TikTok Creator Fund calculator",
    "TikTok Creativity Program earnings",
    "TikTok pay per view",
    "TikTok monetization calculator",
    "how much does TikTok pay",
  ],
  variants: [
    {
      id: "creativity",
      name: "Creativity Program (1M+ views)",
      description: "For TikTok Creativity Program Beta (higher RPM)",
      fields: [
        {
          name: "monthlyViews",
          label: "Monthly Video Views",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "views",
        },
        {
          name: "avgVideoLength",
          label: "Average Video Length",
          type: "select",
          options: [
            { label: "Under 1 minute (Old Creator Fund)", value: "short" },
            { label: "1–5 minutes (Creativity Program)", value: "medium" },
            { label: "5+ minutes (Creativity Program)", value: "long" },
          ],
          defaultValue: "medium",
        },
        {
          name: "region",
          label: "Primary Audience Region",
          type: "select",
          options: [
            { label: "USA", value: "us" },
            { label: "UK / Europe", value: "uk" },
            { label: "Other", value: "other" },
          ],
          defaultValue: "us",
        },
      ],
      calculate: (inputs) => {
        const views = parseFloat(inputs.monthlyViews as string) || 0;
        const length = inputs.avgVideoLength as string;
        const region = inputs.region as string;

        // Creativity Program: $0.40–$1.00 per 1000 views for 1min+ videos
        // Old Creator Fund: $0.02–$0.04 per 1000 views
        let rpmBase = 0.03; // Old Creator Fund default
        if (length === "medium") rpmBase = 0.60;
        if (length === "long") rpmBase = 0.90;

        const regionMult = region === "us" ? 1.0 : region === "uk" ? 0.85 : 0.3;
        const rpm = rpmBase * regionMult;

        const monthly = (views / 1000) * rpm;

        return {
          primary: { label: "Estimated Monthly Earnings", value: `$${formatNumber(monthly, 2)}` },
          details: [
            { label: "Estimated RPM", value: `$${formatNumber(rpm, 3)}` },
            { label: "Monthly views", value: formatNumber(views) },
            { label: "Monthly earnings", value: `$${formatNumber(monthly, 2)}` },
            { label: "Annual projection", value: `$${formatNumber(monthly * 12, 2)}` },
            { label: "Earnings per 1M views", value: `$${formatNumber((1000000 / 1000) * rpm, 2)}` },
          ],
          note: "Creativity Program requires 1-minute+ videos and 10,000 followers. Earnings vary by country, engagement, and completion rate.",
        };
      },
    },
    {
      id: "compare",
      name: "TikTok vs YouTube Comparison",
      description: "Same views — which platform pays more?",
      fields: [
        {
          name: "monthlyViews",
          label: "Monthly Views (same content)",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "views",
        },
        {
          name: "youtubeRpm",
          label: "YouTube RPM",
          type: "number",
          placeholder: "e.g. 4",
          prefix: "$",
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const views = parseFloat(inputs.monthlyViews as string) || 0;
        const ytRpm = parseFloat(inputs.youtubeRpm as string) || 4;
        const ttRpm = 0.6; // Creativity Program avg
        const ytRevenue = (views / 1000) * ytRpm;
        const ttRevenue = (views / 1000) * ttRpm;
        const diff = ytRevenue - ttRevenue;

        return {
          primary: { label: "YouTube Earns More By", value: `$${formatNumber(Math.abs(diff), 2)}/mo` },
          details: [
            { label: "YouTube monthly revenue", value: `$${formatNumber(ytRevenue, 2)}` },
            { label: "YouTube RPM", value: `$${formatNumber(ytRpm, 2)}` },
            { label: "TikTok monthly revenue", value: `$${formatNumber(ttRevenue, 2)}` },
            { label: "TikTok RPM (Creativity)", value: `$${formatNumber(ttRpm, 3)}` },
            { label: "YouTube advantage (per 1M views)", value: `$${formatNumber(((ytRpm - ttRpm) * 1000), 2)}` },
          ],
          note: "For the same views, YouTube pays 5–15x more than TikTok Creativity Program. TikTok's value is in faster growth and organic reach.",
        };
      },
    },
  ],
  relatedSlugs: ["youtube-rpm-calculator", "youtube-shorts-calculator", "instagram-reels-bonus-calculator"],
  faq: [
    {
      question: "How much does TikTok pay per 1,000 views?",
      answer:
        "TikTok's old Creator Fund paid $0.02–$0.04 per 1,000 views. The new Creativity Program Beta pays $0.40–$1.00 per 1,000 views for videos over 1 minute. US creators earn significantly more than international creators.",
    },
    {
      question: "What is TikTok Creativity Program Beta?",
      answer:
        "The Creativity Program replaced the Creator Fund in 2023. It requires 10,000 followers, 100,000 views in the last 30 days, and videos over 1 minute. RPM is 10–20x higher than the old Creator Fund.",
    },
    {
      question: "Can you make a living on TikTok alone?",
      answer:
        "Difficult from TikTok platform payments alone — even 10M views/month earns only $4,000–$10,000. Most successful TikTok creators monetize through brand deals ($500–$10,000 per sponsored video) and driving traffic to other revenue streams.",
    },
  ],
  formula: "TikTok Earnings = (Monthly Views ÷ 1,000) × RPM",
};
