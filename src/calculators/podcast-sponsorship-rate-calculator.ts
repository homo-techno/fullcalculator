import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const podcastSponsorshipRateCalculator: CalculatorDefinition = {
  slug: "podcast-sponsorship-rate-calculator",
  title: "Podcast Sponsorship Rate Calculator",
  description:
    "Calculate what to charge for podcast sponsorships. Set competitive rates for pre-roll, mid-roll, and host-read ads based on your audience size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "podcast sponsorship rate calculator",
    "how much to charge for podcast ads",
    "podcast ad pricing",
    "podcast sponsor rate",
    "podcast CPM pricing guide",
  ],
  variants: [
    {
      id: "rate",
      name: "Set Your Sponsorship Rate",
      description: "Calculate what to charge sponsors",
      fields: [
        {
          name: "avgDownloads",
          label: "Average Downloads per Episode",
          type: "number",
          placeholder: "e.g. 3000",
          suffix: "downloads",
        },
        {
          name: "adType",
          label: "Ad Type",
          type: "select",
          options: [
            { label: "Pre-roll (15–30 sec)", value: "preroll" },
            { label: "Mid-roll (60 sec, host-read)", value: "midroll" },
            { label: "Post-roll (30 sec)", value: "postroll" },
            { label: "Episode Title Sponsor", value: "title" },
          ],
          defaultValue: "midroll",
        },
        {
          name: "audience",
          label: "Audience Engagement",
          type: "select",
          options: [
            { label: "Highly engaged (niche B2B)", value: "high" },
            { label: "Average engagement", value: "medium" },
            { label: "Broad / general audience", value: "low" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const downloads = parseFloat(inputs.avgDownloads as string) || 0;
        const adType = inputs.adType as string;
        const engagement = inputs.audience as string;

        const cpmBase: Record<string, number> = {
          preroll: 18, midroll: 30, postroll: 12, title: 50,
        };
        const engMult: Record<string, number> = { high: 1.4, medium: 1.0, low: 0.75 };

        const cpm = cpmBase[adType] * (engMult[engagement] || 1.0);
        const ratePerEpisode = (downloads / 1000) * cpm;
        const monthlyRate4 = ratePerEpisode * 4;
        const monthly8 = ratePerEpisode * 8;

        return {
          primary: { label: "Rate per Episode", value: `$${formatNumber(ratePerEpisode, 0)}` },
          details: [
            { label: "Recommended CPM", value: `$${formatNumber(cpm, 2)}` },
            { label: "Rate per episode", value: `$${formatNumber(ratePerEpisode, 0)}` },
            { label: "Monthly (4 eps)", value: `$${formatNumber(monthlyRate4, 0)}` },
            { label: "Monthly (8 eps)", value: `$${formatNumber(monthly8, 0)}` },
            { label: "Annual (4 eps/mo)", value: `$${formatNumber(monthlyRate4 * 12, 0)}` },
            { label: "Ad type", value: adType },
          ],
          note: "Add 20–30% for exclusivity. Offer package deals (3–6 episodes) for 10% discount to secure longer commitments.",
        };
      },
    },
  ],
  relatedSlugs: ["podcast-cpm-calculator", "newsletter-sponsorship-calculator", "youtube-rpm-calculator"],
  faq: [
    {
      question: "How do I price podcast sponsorships?",
      answer:
        "Use CPM pricing: (Your downloads ÷ 1,000) × CPM rate. Pre-rolls ($15–25 CPM), mid-rolls ($25–50 CPM), title sponsors ($40–75 CPM). Niche B2B podcasts command higher rates regardless of size.",
    },
    {
      question: "Should I charge per episode or per month?",
      answer:
        "Per-episode pricing is standard for smaller shows. Monthly packages (4–8 episodes) give stability and are preferred by sponsors. Offer a 10–15% discount for 3-month commitments.",
    },
    {
      question: "What information do sponsors want before booking?",
      answer:
        "Sponsors typically want: average downloads per episode, audience demographics (age, income, location), download trends (growing/declining), conversion data from past sponsors, and a media kit with show description and listener persona.",
    },
  ],
  formula: "Rate = (Downloads ÷ 1,000) × CPM Rate × Engagement Multiplier",
};
