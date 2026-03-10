import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const instagramReelsBonusCalculator: CalculatorDefinition = {
  slug: "instagram-reels-bonus-calculator",
  title: "Instagram Reels Bonus Calculator",
  description:
    "Estimate Instagram Reels Play Bonus earnings based on your views. Calculate potential monthly payouts from Meta's creator monetization programs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Instagram Reels bonus calculator",
    "Instagram creator earnings",
    "Reels Play Bonus payout",
    "Instagram monetization",
    "how much does Instagram pay",
  ],
  variants: [
    {
      id: "reels",
      name: "Reels Bonus Estimate",
      description: "Estimate Instagram Reels monetization earnings",
      fields: [
        {
          name: "monthlyReelsViews",
          label: "Monthly Reels Views",
          type: "number",
          placeholder: "e.g. 500000",
          suffix: "views",
        },
        {
          name: "followers",
          label: "Followers",
          type: "number",
          placeholder: "e.g. 25000",
        },
        {
          name: "niche",
          label: "Content Niche",
          type: "select",
          options: [
            { label: "Fashion / Lifestyle", value: "lifestyle" },
            { label: "Finance / Business", value: "finance" },
            { label: "Health / Fitness", value: "health" },
            { label: "Entertainment / Comedy", value: "entertainment" },
            { label: "Food", value: "food" },
            { label: "Travel", value: "travel" },
          ],
          defaultValue: "lifestyle",
        },
      ],
      calculate: (inputs) => {
        const views = parseFloat(inputs.monthlyReelsViews as string) || 0;
        const followers = parseFloat(inputs.followers as string) || 0;
        const niche = inputs.niche as string;

        // Reels Play Bonus: $0.01–$0.10 per 1000 plays (highly variable, invite-only)
        // Brand deals are the real money
        const bonusRpm: Record<string, number> = {
          lifestyle: 0.02, finance: 0.05, health: 0.03,
          entertainment: 0.015, food: 0.025, travel: 0.03,
        };
        const rpm = bonusRpm[niche] || 0.02;
        const bonusRevenue = (views / 1000) * rpm;

        // Sponsored posts: influencer rates
        let sponsorRate = 0;
        if (followers >= 1000 && followers < 10000) sponsorRate = followers * 0.01;
        else if (followers < 100000) sponsorRate = followers * 0.008;
        else sponsorRate = followers * 0.005;

        const totalRevenue = bonusRevenue + sponsorRate;

        return {
          primary: { label: "Estimated Monthly Earnings", value: `$${formatNumber(totalRevenue, 2)}` },
          details: [
            { label: "Reels Play Bonus", value: `$${formatNumber(bonusRevenue, 2)}` },
            { label: "Bonus RPM (est.)", value: `$${formatNumber(rpm, 3)}/1k plays` },
            { label: "Sponsor deal estimate", value: `$${formatNumber(sponsorRate, 0)}/post` },
            { label: "Monthly views", value: formatNumber(views) },
            { label: "Annual from bonus only", value: `$${formatNumber(bonusRevenue * 12, 2)}` },
          ],
          note: "Reels Play Bonus is an invite-only program with limited availability. Brand sponsorships are the primary income for most Instagram creators.",
        };
      },
    },
  ],
  relatedSlugs: ["tiktok-creator-fund-calculator", "youtube-shorts-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "How much does Instagram pay for Reels views?",
      answer:
        "The Instagram Reels Play Bonus pays roughly $0.01–$0.10 per 1,000 views, but the program is invite-only and has a monthly cap. Most creators earn more from brand deals than from the bonus program.",
    },
    {
      question: "Is the Instagram Reels bonus still available in 2025?",
      answer:
        "Meta has scaled back the Reels Play Bonus program. It is still available in select markets to invite-only creators. Meta is shifting toward subscription-based creator monetization instead.",
    },
    {
      question: "How much do Instagram influencers make per post?",
      answer:
        "Micro-influencers (10k–100k followers) earn $100–$1,000 per sponsored post. Macro-influencers (100k–1M) earn $1,000–$10,000 per post. Mega-influencers (1M+) earn $10,000–$100,000+ per post.",
    },
  ],
  formula: "Reels Bonus = (Reels Views ÷ 1,000) × RPM",
};
