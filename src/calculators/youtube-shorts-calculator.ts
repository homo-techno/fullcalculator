import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const youtubeShortsCalculator: CalculatorDefinition = {
  slug: "youtube-shorts-calculator",
  title: "YouTube Shorts Monetization Calculator",
  description:
    "Calculate YouTube Shorts earnings from the Shorts ad revenue pool. Compare Shorts vs long-form video income potential per view.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "YouTube Shorts monetization calculator",
    "YouTube Shorts earnings",
    "Shorts RPM",
    "YouTube Shorts revenue",
    "how much do YouTube Shorts pay",
  ],
  variants: [
    {
      id: "shorts",
      name: "Shorts Earnings",
      description: "Estimate revenue from YouTube Shorts views",
      fields: [
        {
          name: "shortsViews",
          label: "Monthly Shorts Views",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "views",
        },
        {
          name: "longFormViews",
          label: "Monthly Long-Form Views",
          type: "number",
          placeholder: "e.g. 50000",
          suffix: "views",
        },
        {
          name: "longFormRpm",
          label: "Long-Form RPM",
          type: "number",
          placeholder: "e.g. 4",
          prefix: "$",
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const shortsViews = parseFloat(inputs.shortsViews as string) || 0;
        const longViews = parseFloat(inputs.longFormViews as string) || 0;
        const longRpm = parseFloat(inputs.longFormRpm as string) || 4;

        // Shorts RPM is significantly lower (~$0.03–0.08 per 1000 views)
        const shortsRpm = 0.05;
        const shortsRevenue = (shortsViews / 1000) * shortsRpm;
        const longRevenue = (longViews / 1000) * longRpm;
        const totalRevenue = shortsRevenue + longRevenue;
        const shortsPercent = totalRevenue > 0 ? (shortsRevenue / totalRevenue) * 100 : 0;

        return {
          primary: { label: "Total Monthly Revenue", value: `$${formatNumber(totalRevenue, 2)}` },
          details: [
            { label: "Shorts revenue", value: `$${formatNumber(shortsRevenue, 2)}` },
            { label: "Shorts RPM (est.)", value: `$${formatNumber(shortsRpm, 3)}` },
            { label: "Shorts % of total income", value: `${formatNumber(shortsPercent, 1)}%` },
            { label: "Long-form revenue", value: `$${formatNumber(longRevenue, 2)}` },
            { label: "Long-form RPM", value: `$${formatNumber(longRpm, 2)}` },
            { label: "Revenue per 1M Shorts views", value: `$${formatNumber(shortsRpm * 1000, 2)}` },
          ],
          note: "Shorts RPM ($0.03–$0.10) is ~50x lower than long-form. Shorts are best used for channel growth, not direct monetization.",
        };
      },
    },
  ],
  relatedSlugs: ["youtube-rpm-calculator", "youtube-channel-revenue-estimator", "tiktok-creator-fund-calculator"],
  faq: [
    {
      question: "How much does YouTube Shorts pay per 1,000 views?",
      answer:
        "YouTube Shorts pays approximately $0.03–$0.10 per 1,000 views (RPM), compared to $3–$15 for long-form videos. Shorts ad revenue is pooled and distributed based on your share of total Shorts views.",
    },
    {
      question: "Is YouTube Shorts worth monetizing?",
      answer:
        "Shorts are better for channel growth than direct income. 10 million Shorts views earns ~$500–$1,000. The same effort producing long-form videos could earn $30,000–$50,000. Use Shorts to grow subscribers who then watch monetized long-form content.",
    },
    {
      question: "What are the requirements for YouTube Shorts monetization?",
      answer:
        "As of 2024, you need 500 subscribers and 3,000 watch hours (or 3M Shorts views in 90 days) for the YouTube Partner Program. Full Shorts monetization requires 1,000 subscribers and 4,000 watch hours.",
    },
  ],
  formula: "Shorts Revenue = (Shorts Views ÷ 1,000) × Shorts RPM (~$0.05)",
};
