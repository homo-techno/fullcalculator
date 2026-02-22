import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adFrequencyCalculator: CalculatorDefinition = {
  slug: "ad-frequency",
  title: "Ad Frequency Calculator",
  description: "Free ad frequency calculator. Calculate how many times your target audience sees your ad on average and identify ad fatigue risk.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ad frequency", "ad impressions", "reach", "ad fatigue", "frequency cap", "advertising"],
  variants: [
    {
      id: "basic",
      name: "Basic Ad Frequency",
      fields: [
        { name: "impressions", label: "Total Impressions", type: "number", placeholder: "e.g. 500000" },
        { name: "reach", label: "Unique Reach", type: "number", placeholder: "e.g. 100000" },
      ],
      calculate: (inputs) => {
        const impressions = inputs.impressions as number;
        const reach = inputs.reach as number;
        if (!impressions || !reach) return null;
        const frequency = impressions / reach;
        const fatigueRisk = frequency > 8 ? "High" : frequency > 5 ? "Moderate" : frequency > 3 ? "Low" : "Minimal";
        return {
          primary: { label: "Ad Frequency", value: `${formatNumber(frequency, 2)}x` },
          details: [
            { label: "Total Impressions", value: formatNumber(impressions, 0) },
            { label: "Unique Reach", value: formatNumber(reach, 0) },
            { label: "Ad Fatigue Risk", value: fatigueRisk },
            { label: "Avg Views per Person", value: formatNumber(frequency, 1) },
          ],
        };
      },
    },
    {
      id: "budget",
      name: "Frequency from Budget",
      fields: [
        { name: "budget", label: "Campaign Budget ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "cpm", label: "CPM ($)", type: "number", placeholder: "e.g. 8" },
        { name: "targetAudience", label: "Target Audience Size", type: "number", placeholder: "e.g. 200000" },
        { name: "reachPercent", label: "Estimated Reach (%)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const budget = inputs.budget as number;
        const cpm = inputs.cpm as number;
        const audience = inputs.targetAudience as number;
        const reachPct = inputs.reachPercent as number;
        if (!budget || !cpm || !audience || !reachPct) return null;
        const totalImpressions = (budget / cpm) * 1000;
        const estimatedReach = audience * (reachPct / 100);
        const frequency = totalImpressions / estimatedReach;
        const fatigueRisk = frequency > 8 ? "High" : frequency > 5 ? "Moderate" : frequency > 3 ? "Low" : "Minimal";
        return {
          primary: { label: "Estimated Ad Frequency", value: `${formatNumber(frequency, 2)}x` },
          details: [
            { label: "Total Impressions", value: formatNumber(totalImpressions, 0) },
            { label: "Estimated Reach", value: formatNumber(estimatedReach, 0) },
            { label: "Ad Fatigue Risk", value: fatigueRisk },
            { label: "Budget", value: `$${formatNumber(budget, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cpm-calculator", "ctr-calculator", "brand-awareness"],
  faq: [
    { question: "What is the ideal ad frequency?", answer: "The ideal ad frequency depends on your goals. For brand awareness, 3-5x is often recommended. For direct response, 1-3x may be sufficient. Frequencies above 8-10x often lead to ad fatigue and declining performance." },
    { question: "What is ad fatigue?", answer: "Ad fatigue occurs when your audience sees your ad too many times, leading to banner blindness, lower CTR, higher CPC, and negative brand sentiment. Combat it by refreshing creative, adjusting frequency caps, and rotating ad variations." },
  ],
  formula: "Ad Frequency = Total Impressions / Unique Reach",
};
