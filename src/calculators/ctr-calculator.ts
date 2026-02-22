import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ctrCalculator: CalculatorDefinition = {
  slug: "ctr-calculator",
  title: "Click-Through Rate Calculator",
  description: "Free click-through rate (CTR) calculator. Measure your ad, email, or search listing performance by calculating the percentage of impressions that result in clicks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ctr", "click-through rate", "impressions", "clicks", "ad performance", "marketing metrics"],
  variants: [
    {
      id: "basic",
      name: "Basic CTR",
      fields: [
        { name: "clicks", label: "Number of Clicks", type: "number", placeholder: "e.g. 150" },
        { name: "impressions", label: "Number of Impressions", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const clicks = inputs.clicks as number;
        const impressions = inputs.impressions as number;
        if (!clicks || !impressions) return null;
        const ctr = (clicks / impressions) * 100;
        return {
          primary: { label: "Click-Through Rate", value: `${formatNumber(ctr, 2)}%` },
          details: [
            { label: "Total Clicks", value: formatNumber(clicks, 0) },
            { label: "Total Impressions", value: formatNumber(impressions, 0) },
            { label: "Non-Click Impressions", value: formatNumber(impressions - clicks, 0) },
            { label: "Clicks per 1,000 Impressions", value: formatNumber((clicks / impressions) * 1000, 1) },
          ],
        };
      },
    },
    {
      id: "campaign",
      name: "Campaign CTR Comparison",
      fields: [
        { name: "clicksA", label: "Campaign A Clicks", type: "number", placeholder: "e.g. 200" },
        { name: "impressionsA", label: "Campaign A Impressions", type: "number", placeholder: "e.g. 10000" },
        { name: "clicksB", label: "Campaign B Clicks", type: "number", placeholder: "e.g. 350" },
        { name: "impressionsB", label: "Campaign B Impressions", type: "number", placeholder: "e.g. 15000" },
      ],
      calculate: (inputs) => {
        const clicksA = inputs.clicksA as number;
        const impressionsA = inputs.impressionsA as number;
        const clicksB = inputs.clicksB as number;
        const impressionsB = inputs.impressionsB as number;
        if (!clicksA || !impressionsA || !clicksB || !impressionsB) return null;
        const ctrA = (clicksA / impressionsA) * 100;
        const ctrB = (clicksB / impressionsB) * 100;
        const difference = ctrB - ctrA;
        const relativeChange = ((ctrB - ctrA) / ctrA) * 100;
        return {
          primary: { label: "CTR Difference", value: `${formatNumber(difference, 2)} pp` },
          details: [
            { label: "Campaign A CTR", value: `${formatNumber(ctrA, 2)}%` },
            { label: "Campaign B CTR", value: `${formatNumber(ctrB, 2)}%` },
            { label: "Relative Change", value: `${formatNumber(relativeChange, 1)}%` },
            { label: "Better Campaign", value: ctrA > ctrB ? "Campaign A" : "Campaign B" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cpc-calculator", "cpm-calculator", "roas-calculator"],
  faq: [
    { question: "What is a good click-through rate?", answer: "A good CTR varies by industry and channel. For Google Ads search, the average is around 3-5%. For display ads, 0.5-1% is typical. Email CTR averages 2-3%." },
    { question: "How can I improve my CTR?", answer: "Improve CTR by writing compelling headlines and ad copy, using strong calls-to-action, targeting the right audience, A/B testing, and ensuring your content matches user intent." },
  ],
  formula: "CTR = (Clicks / Impressions) x 100",
};
