import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const podcastDownloadCalculator: CalculatorDefinition = {
  slug: "podcast-download",
  title: "Podcast Download Estimator",
  description: "Free podcast download estimator. Project your podcast download growth and estimate monetization potential based on audience size and engagement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["podcast downloads", "podcast analytics", "podcast growth", "podcast monetization", "podcast audience"],
  variants: [
    {
      id: "basic",
      name: "Download Growth Projection",
      fields: [
        { name: "currentDownloads", label: "Current Downloads per Episode", type: "number", placeholder: "e.g. 500" },
        { name: "episodesPerMonth", label: "Episodes per Month", type: "number", placeholder: "e.g. 4" },
        { name: "monthlyGrowthRate", label: "Monthly Growth Rate (%)", type: "number", placeholder: "e.g. 10" },
        { name: "projectionMonths", label: "Projection Period (months)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentDownloads as number;
        const episodes = inputs.episodesPerMonth as number;
        const growth = inputs.monthlyGrowthRate as number;
        const months = inputs.projectionMonths as number;
        if (!current || !episodes || !growth || !months) return null;
        let downloadsPerEpisode = current;
        let totalDownloads = 0;
        for (let i = 0; i < months; i++) {
          totalDownloads += downloadsPerEpisode * episodes;
          downloadsPerEpisode = downloadsPerEpisode * (1 + growth / 100);
        }
        const futureDownloads = Math.round(downloadsPerEpisode);
        const growthMultiple = futureDownloads / current;
        const totalEpisodes = episodes * months;
        return {
          primary: { label: "Projected Downloads per Episode", value: formatNumber(futureDownloads, 0) },
          details: [
            { label: "Current Downloads per Episode", value: formatNumber(current, 0) },
            { label: "Growth Multiple", value: `${formatNumber(growthMultiple, 1)}x` },
            { label: "Total Downloads Over Period", value: formatNumber(Math.round(totalDownloads), 0) },
            { label: "Total Episodes Released", value: formatNumber(totalEpisodes, 0) },
            { label: "Avg Monthly Downloads", value: formatNumber(Math.round(totalDownloads / months), 0) },
          ],
        };
      },
    },
    {
      id: "monetization",
      name: "Podcast Monetization Estimate",
      fields: [
        { name: "downloadsPerEpisode", label: "Downloads per Episode", type: "number", placeholder: "e.g. 5000" },
        { name: "episodesPerMonth", label: "Episodes per Month", type: "number", placeholder: "e.g. 4" },
        { name: "cpmRate", label: "CPM Rate ($)", type: "number", placeholder: "e.g. 25" },
        { name: "adSpotsPerEpisode", label: "Ad Spots per Episode", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const downloads = inputs.downloadsPerEpisode as number;
        const episodes = inputs.episodesPerMonth as number;
        const cpmRate = inputs.cpmRate as number;
        const adSpots = inputs.adSpotsPerEpisode as number;
        if (!downloads || !episodes || !cpmRate || !adSpots) return null;
        const revenuePerEpisode = (downloads / 1000) * cpmRate * adSpots;
        const monthlyRevenue = revenuePerEpisode * episodes;
        const annualRevenue = monthlyRevenue * 12;
        const revenuePerDownload = revenuePerEpisode / downloads;
        return {
          primary: { label: "Monthly Podcast Revenue", value: `$${formatNumber(monthlyRevenue, 2)}` },
          details: [
            { label: "Revenue per Episode", value: `$${formatNumber(revenuePerEpisode, 2)}` },
            { label: "Annual Revenue", value: `$${formatNumber(annualRevenue, 2)}` },
            { label: "Revenue per Download", value: `$${formatNumber(revenuePerDownload, 4)}` },
            { label: "Monthly Downloads", value: formatNumber(downloads * episodes, 0) },
            { label: "Effective CPM (all spots)", value: `$${formatNumber(cpmRate * adSpots, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cpm-calculator", "blog-traffic", "subscriber-value"],
  faq: [
    { question: "How many downloads is good for a podcast?", answer: "After 7 days, 28 downloads puts you in the top 50% of podcasts, 72 downloads in the top 25%, 231 downloads in the top 10%, and 1,000+ downloads in the top 5%. Most successful independent podcasters get 1,000-10,000 downloads per episode." },
    { question: "How do podcasts make money?", answer: "Podcasts monetize through sponsorships (CPM-based ads), listener donations (Patreon), premium content, merchandise, affiliate marketing, and live events. Sponsorships typically pay $18-$50 CPM depending on niche and audience size." },
  ],
  formula: "Monthly Revenue = (Downloads / 1,000) x CPM Rate x Ad Spots x Episodes",
};
