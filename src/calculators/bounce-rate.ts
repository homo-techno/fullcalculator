import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bounceRateCalculator: CalculatorDefinition = {
  slug: "bounce-rate",
  title: "Bounce Rate Calculator",
  description: "Free bounce rate calculator. Calculate your website bounce rate to understand how many visitors leave without interacting with your site.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bounce rate", "website analytics", "single page sessions", "user engagement", "seo metrics"],
  variants: [
    {
      id: "basic",
      name: "Basic Bounce Rate",
      fields: [
        { name: "singlePageSessions", label: "Single Page Sessions", type: "number", placeholder: "e.g. 3000" },
        { name: "totalSessions", label: "Total Sessions", type: "number", placeholder: "e.g. 10000" },
      ],
      calculate: (inputs) => {
        const singlePageSessions = inputs.singlePageSessions as number;
        const totalSessions = inputs.totalSessions as number;
        if (!singlePageSessions || !totalSessions) return null;
        const bounceRate = (singlePageSessions / totalSessions) * 100;
        const engagedSessions = totalSessions - singlePageSessions;
        const engagementRate = (engagedSessions / totalSessions) * 100;
        return {
          primary: { label: "Bounce Rate", value: `${formatNumber(bounceRate, 2)}%` },
          details: [
            { label: "Single Page Sessions", value: formatNumber(singlePageSessions, 0) },
            { label: "Total Sessions", value: formatNumber(totalSessions, 0) },
            { label: "Engaged Sessions", value: formatNumber(engagedSessions, 0) },
            { label: "Engagement Rate", value: `${formatNumber(engagementRate, 2)}%` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Page Comparison",
      fields: [
        { name: "bouncesA", label: "Page A Bounces", type: "number", placeholder: "e.g. 400" },
        { name: "sessionsA", label: "Page A Sessions", type: "number", placeholder: "e.g. 1000" },
        { name: "bouncesB", label: "Page B Bounces", type: "number", placeholder: "e.g. 250" },
        { name: "sessionsB", label: "Page B Sessions", type: "number", placeholder: "e.g. 1000" },
      ],
      calculate: (inputs) => {
        const bouncesA = inputs.bouncesA as number;
        const sessionsA = inputs.sessionsA as number;
        const bouncesB = inputs.bouncesB as number;
        const sessionsB = inputs.sessionsB as number;
        if (!bouncesA || !sessionsA || !bouncesB || !sessionsB) return null;
        const rateA = (bouncesA / sessionsA) * 100;
        const rateB = (bouncesB / sessionsB) * 100;
        const diff = rateB - rateA;
        return {
          primary: { label: "Bounce Rate Difference", value: `${formatNumber(diff, 2)} pp` },
          details: [
            { label: "Page A Bounce Rate", value: `${formatNumber(rateA, 2)}%` },
            { label: "Page B Bounce Rate", value: `${formatNumber(rateB, 2)}%` },
            { label: "Better Performing Page", value: rateA < rateB ? "Page A" : "Page B" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["page-load-impact", "ctr-calculator", "engagement-rate"],
  faq: [
    { question: "What is a good bounce rate?", answer: "A bounce rate of 26-40% is excellent, 41-55% is average, and 56-70% is higher than average. Rates above 70% may indicate issues. Blog posts and landing pages naturally have higher bounce rates." },
    { question: "How can I reduce my bounce rate?", answer: "Reduce bounce rate by improving page load speed, creating compelling content, using clear navigation, ensuring mobile responsiveness, and matching page content to user search intent." },
  ],
  formula: "Bounce Rate = (Single Page Sessions / Total Sessions) x 100",
};
