import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const influencerBrandDealCalculator: CalculatorDefinition = {
  slug: "influencer-brand-deal-calculator",
  title: "Influencer Brand Deal Rate Calculator",
  description:
    "Calculate your influencer rate for brand deals and sponsorships. Set competitive pricing for Instagram, YouTube, TikTok, and podcast integrations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "influencer brand deal calculator",
    "how much to charge for sponsorship",
    "influencer rate calculator",
    "sponsored post pricing",
    "creator brand deal rate",
  ],
  variants: [
    {
      id: "rate",
      name: "Set Your Brand Deal Rate",
      description: "Calculate what to charge for brand partnerships",
      fields: [
        {
          name: "platform",
          label: "Platform",
          type: "select",
          options: [
            { label: "YouTube (video integration)", value: "youtube" },
            { label: "Instagram (Reel)", value: "instagram_reel" },
            { label: "Instagram (Static post)", value: "instagram_post" },
            { label: "TikTok (video)", value: "tiktok" },
            { label: "Podcast (host-read ad)", value: "podcast" },
            { label: "Newsletter (dedicated section)", value: "newsletter" },
          ],
          defaultValue: "youtube",
        },
        {
          name: "followers",
          label: "Followers / Subscribers",
          type: "number",
          placeholder: "e.g. 50000",
        },
        {
          name: "engagementRate",
          label: "Engagement Rate",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "%",
          defaultValue: 3,
        },
        {
          name: "niche",
          label: "Niche",
          type: "select",
          options: [
            { label: "Finance / Business", value: "finance" },
            { label: "Technology", value: "tech" },
            { label: "Health / Fitness", value: "health" },
            { label: "Lifestyle / Fashion", value: "lifestyle" },
            { label: "Gaming", value: "gaming" },
            { label: "Food / Travel", value: "food" },
          ],
          defaultValue: "finance",
        },
      ],
      calculate: (inputs) => {
        const platform = inputs.platform as string;
        const followers = parseFloat(inputs.followers as string) || 0;
        const engagement = parseFloat(inputs.engagementRate as string) || 3;
        const niche = inputs.niche as string;

        // Base CPM by platform
        const baseCpm: Record<string, number> = {
          youtube: 20, instagram_reel: 12, instagram_post: 8,
          tiktok: 6, podcast: 25, newsletter: 30,
        };
        const nicheMult: Record<string, number> = {
          finance: 1.5, tech: 1.3, health: 1.2, lifestyle: 1.0, gaming: 0.8, food: 0.9,
        };
        const engMult = Math.max(0.5, Math.min(2.0, engagement / 3));

        const cpm = baseCpm[platform] * (nicheMult[niche] || 1.0) * engMult;
        const baseRate = (followers / 1000) * cpm;

        // Exclusivity multiplier
        const exclusivityRate = baseRate * 1.25;

        return {
          primary: { label: "Recommended Rate", value: `$${formatNumber(baseRate, 0)}` },
          details: [
            { label: "Base rate (non-exclusive)", value: `$${formatNumber(baseRate, 0)}` },
            { label: "With 30-day exclusivity (+25%)", value: `$${formatNumber(exclusivityRate, 0)}` },
            { label: "Effective CPM", value: `$${formatNumber(cpm, 2)}` },
            { label: "Followers / reach", value: formatNumber(followers) },
            { label: "Engagement rate", value: `${engagement}%` },
            { label: "Annual income (2 deals/mo)", value: `$${formatNumber(baseRate * 24, 0)}` },
          ],
          note: "Charge 2x for usage rights (brand can repost your content). Charge 3–5x for exclusive long-term partnerships (6–12 months).",
        };
      },
    },
  ],
  relatedSlugs: ["content-creator-hourly-rate-calculator", "youtube-rpm-calculator", "podcast-sponsorship-rate-calculator"],
  faq: [
    {
      question: "How do I calculate my influencer rate?",
      answer:
        "A common formula: (Followers ÷ 1,000) × CPM Rate. YouTube integrations: $20–$50 CPM. Instagram Reels: $10–$15 CPM. TikTok: $5–$10 CPM. Finance/tech creators can charge 1.5–2x standard rates due to high-value audiences.",
    },
    {
      question: "What's the 1% rule for influencer pricing?",
      answer:
        "A common guideline is to charge $10–$20 per 1,000 followers per sponsored post. So 100,000 Instagram followers = $1,000–$2,000 per post. Engagement rate adjusts this: 10% ER commands 2–3x the rate of 1% ER.",
    },
    {
      question: "Should I negotiate brand deal rates?",
      answer:
        "Always. Initial offers are often 30–50% below a brand's actual budget. Counter at 1.5x their offer. Ask for usage rights, content rights, and exclusivity as add-ons. Top creators earn 70–80% of income from brand deals, not platform revenue.",
    },
  ],
  formula: "Brand Deal Rate = (Followers ÷ 1,000) × Platform CPM × Niche Multiplier × Engagement Multiplier",
};
