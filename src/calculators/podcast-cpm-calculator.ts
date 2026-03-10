import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const podcastCpmCalculator: CalculatorDefinition = {
  slug: "podcast-cpm-calculator",
  title: "Podcast CPM & Sponsorship Calculator",
  description:
    "Calculate podcast ad revenue from CPM sponsorships. Estimate monthly earnings from host-read ads, pre-rolls, and mid-rolls based on downloads.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "podcast CPM calculator",
    "podcast sponsorship earnings",
    "podcast ad revenue",
    "podcast monetization calculator",
    "how much do podcasts make",
  ],
  variants: [
    {
      id: "sponsorship",
      name: "Sponsorship Revenue",
      description: "Calculate income from podcast sponsorships",
      fields: [
        {
          name: "monthlyDownloads",
          label: "Monthly Downloads per Episode",
          type: "number",
          placeholder: "e.g. 5000",
          suffix: "downloads",
        },
        {
          name: "episodesPerMonth",
          label: "Episodes per Month",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 4,
        },
        {
          name: "niche",
          label: "Podcast Niche",
          type: "select",
          options: [
            { label: "Business / Finance", value: "business" },
            { label: "Technology", value: "tech" },
            { label: "True Crime", value: "truecrime" },
            { label: "Health / Wellness", value: "health" },
            { label: "Comedy / Entertainment", value: "comedy" },
            { label: "News / Politics", value: "news" },
            { label: "Education", value: "education" },
          ],
          defaultValue: "business",
        },
        {
          name: "adSlots",
          label: "Ad Slots per Episode",
          type: "select",
          options: [
            { label: "1 slot (pre-roll only)", value: "1" },
            { label: "2 slots (pre + mid)", value: "2" },
            { label: "3 slots (pre + 2 mid)", value: "3" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const downloads = parseFloat(inputs.monthlyDownloads as string) || 0;
        const episodes = parseFloat(inputs.episodesPerMonth as string) || 4;
        const niche = inputs.niche as string;
        const slots = parseFloat(inputs.adSlots as string) || 2;

        // CPM rates by niche
        const nicheCpm: Record<string, number> = {
          business: 35, tech: 30, truecrime: 25, health: 28,
          comedy: 20, news: 25, education: 22,
        };
        const cpm = nicheCpm[niche] || 25;

        const revenuePerEpisode = (downloads / 1000) * cpm * slots;
        const monthlyRevenue = revenuePerEpisode * episodes;

        return {
          primary: { label: "Monthly Ad Revenue", value: `$${formatNumber(monthlyRevenue, 2)}` },
          details: [
            { label: "CPM rate (est.)", value: `$${cpm}` },
            { label: "Revenue per episode", value: `$${formatNumber(revenuePerEpisode, 2)}` },
            { label: "Episodes per month", value: `${episodes}` },
            { label: "Ad slots per episode", value: `${slots}` },
            { label: "Monthly downloads (total)", value: formatNumber(downloads * episodes) },
            { label: "Annual projection", value: `$${formatNumber(monthlyRevenue * 12, 2)}` },
          ],
          note: "These are host-read ad CPMs. Programmatic podcast ads pay 30–50% less. You typically need 1,000+ downloads per episode to attract sponsors.",
        };
      },
    },
  ],
  relatedSlugs: ["podcast-sponsorship-rate-calculator", "newsletter-sponsorship-calculator", "substack-revenue-calculator"],
  faq: [
    {
      question: "How many podcast downloads do you need to get sponsors?",
      answer:
        "Most sponsors require 1,000–5,000 downloads per episode minimum. Direct sponsors contact podcasts at 5,000+ downloads. Top podcast ad networks like AdvertiseCast work with shows at 1,000+ downloads.",
    },
    {
      question: "What is a good CPM rate for podcasts?",
      answer:
        "Average podcast CPM is $18–$50. Business/finance podcasts command $25–$60 CPM. True crime and entertainment are $15–$30 CPM. Host-read ads typically pay 2x more than programmatic ads.",
    },
    {
      question: "What's the difference between podcast CPM and RPM?",
      answer:
        "CPM is what advertisers pay per 1,000 impressions. In podcasting, you typically receive the full CPM (unlike YouTube where you get 55%). A 60-second mid-roll at $25 CPM with 5,000 downloads = $125 per episode.",
    },
  ],
  formula: "Monthly Revenue = (Downloads ÷ 1,000) × CPM × Slots × Episodes",
};
