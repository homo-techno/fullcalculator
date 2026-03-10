import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const youtubeRpmCalculator: CalculatorDefinition = {
  slug: "youtube-rpm-calculator",
  title: "YouTube RPM Calculator",
  description:
    "Calculate your YouTube RPM (Revenue Per Mille) and monthly earnings by niche, region, and view count. Estimate ad revenue accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "YouTube RPM calculator",
    "YouTube revenue per 1000 views",
    "YouTube ad revenue",
    "YouTube monetization calculator",
    "YouTube earnings estimator",
  ],
  variants: [
    {
      id: "by-niche",
      name: "Estimate by Niche",
      description: "Calculate RPM based on your channel niche and region",
      fields: [
        {
          name: "niche",
          label: "Channel Niche",
          type: "select",
          options: [
            { label: "Finance & Investing", value: "finance" },
            { label: "Technology & Software", value: "tech" },
            { label: "Business & Entrepreneurship", value: "business" },
            { label: "Health & Fitness", value: "health" },
            { label: "Education & Tutorials", value: "education" },
            { label: "Gaming", value: "gaming" },
            { label: "Entertainment & Vlogs", value: "entertainment" },
            { label: "Food & Cooking", value: "food" },
            { label: "Travel", value: "travel" },
            { label: "Kids & Family", value: "kids" },
          ],
          defaultValue: "finance",
        },
        {
          name: "region",
          label: "Audience Region",
          type: "select",
          options: [
            { label: "USA / Canada", value: "us" },
            { label: "UK / Australia", value: "uk" },
            { label: "Europe (W)", value: "eu" },
            { label: "India", value: "india" },
            { label: "Latin America", value: "latam" },
            { label: "Global Mix", value: "global" },
          ],
          defaultValue: "us",
        },
        {
          name: "monthlyViews",
          label: "Monthly Views",
          type: "number",
          placeholder: "e.g. 100000",
          suffix: "views",
        },
      ],
      calculate: (inputs) => {
        const niche = inputs.niche as string;
        const region = inputs.region as string;
        const views = parseFloat(inputs.monthlyViews as string) || 0;

        const nicheRpm: Record<string, number> = {
          finance: 12, tech: 8, business: 10, health: 6,
          education: 5, gaming: 3, entertainment: 2.5, food: 3.5,
          travel: 4, kids: 2,
        };
        const regionMult: Record<string, number> = {
          us: 1.0, uk: 0.9, eu: 0.75, india: 0.15, latam: 0.25, global: 0.6,
        };

        const baseRpm = nicheRpm[niche] || 5;
        const rpm = baseRpm * (regionMult[region] || 0.6);
        const monthlyRevenue = (views / 1000) * rpm;
        const annualRevenue = monthlyRevenue * 12;

        return {
          primary: { label: "Estimated Monthly Earnings", value: `$${formatNumber(monthlyRevenue, 2)}` },
          details: [
            { label: "Estimated RPM", value: `$${formatNumber(rpm, 2)}` },
            { label: "Monthly views", value: formatNumber(views) },
            { label: "Monthly revenue", value: `$${formatNumber(monthlyRevenue, 2)}` },
            { label: "Annual projection", value: `$${formatNumber(annualRevenue, 2)}` },
            { label: "Revenue per 1k views", value: `$${formatNumber(rpm, 2)}` },
          ],
          note: "RPM varies by season (Q4 is 30-50% higher), ad blockers, and video length. Actual RPM visible in YouTube Studio.",
        };
      },
    },
    {
      id: "by-rpm",
      name: "Calculate from Known RPM",
      description: "Use your actual RPM from YouTube Studio",
      fields: [
        {
          name: "rpm",
          label: "Your RPM (from YouTube Studio)",
          type: "number",
          placeholder: "e.g. 4.50",
          prefix: "$",
        },
        {
          name: "monthlyViews",
          label: "Monthly Views",
          type: "number",
          placeholder: "e.g. 100000",
          suffix: "views",
        },
      ],
      calculate: (inputs) => {
        const rpm = parseFloat(inputs.rpm as string) || 0;
        const views = parseFloat(inputs.monthlyViews as string) || 0;
        const monthly = (views / 1000) * rpm;
        return {
          primary: { label: "Monthly Revenue", value: `$${formatNumber(monthly, 2)}` },
          details: [
            { label: "RPM", value: `$${formatNumber(rpm, 2)}` },
            { label: "Views", value: formatNumber(views) },
            { label: "Monthly earnings", value: `$${formatNumber(monthly, 2)}` },
            { label: "Annual earnings", value: `$${formatNumber(monthly * 12, 2)}` },
            { label: "Daily average", value: `$${formatNumber(monthly / 30, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["youtube-channel-revenue-estimator", "youtube-shorts-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "What is YouTube RPM?",
      answer:
        "RPM (Revenue Per Mille) is how much YouTube pays you per 1,000 video views, after YouTube's 45% cut. CPM is what advertisers pay; RPM is what you actually receive. RPM = (Total Revenue / Total Views) × 1000.",
    },
    {
      question: "What's a good RPM on YouTube?",
      answer:
        "Average YouTube RPM is $1.50–$5. Finance channels earn $8–$15 RPM. Gaming is $2–$4. Entertainment is $1.50–$3. Finance niches command premium rates because viewers are high-income buyers.",
    },
    {
      question: "Why does RPM fluctuate?",
      answer:
        "RPM is highest in Q4 (Oct–Dec) due to holiday ad spending—often 2x the Q1 rate. It also varies by upload frequency, video length (8+ minutes enables mid-rolls), and audience engagement rate.",
    },
  ],
  formula: "Monthly Revenue = (Monthly Views ÷ 1,000) × RPM",
};
