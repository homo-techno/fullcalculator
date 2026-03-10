import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newsletterSponsorshipCalculator: CalculatorDefinition = {
  slug: "newsletter-sponsorship-calculator",
  title: "Newsletter Sponsorship Rate Calculator",
  description:
    "Calculate newsletter sponsorship pricing based on subscribers, open rate, and niche. Set competitive CPM rates for email ad placements.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "newsletter sponsorship calculator",
    "email newsletter ad rates",
    "newsletter CPM pricing",
    "how much to charge for newsletter ads",
    "email list monetization",
  ],
  variants: [
    {
      id: "rate",
      name: "Calculate Sponsorship Rate",
      description: "Determine what to charge for newsletter ads",
      fields: [
        {
          name: "subscribers",
          label: "Email Subscribers",
          type: "number",
          placeholder: "e.g. 10000",
        },
        {
          name: "openRate",
          label: "Average Open Rate",
          type: "number",
          placeholder: "e.g. 45",
          suffix: "%",
          defaultValue: 40,
        },
        {
          name: "niche",
          label: "Newsletter Niche",
          type: "select",
          options: [
            { label: "Finance / Investing", value: "finance" },
            { label: "SaaS / Tech / Startups", value: "tech" },
            { label: "Marketing / Growth", value: "marketing" },
            { label: "Health / Wellness", value: "health" },
            { label: "News / General", value: "news" },
            { label: "Lifestyle / Consumer", value: "lifestyle" },
          ],
          defaultValue: "finance",
        },
        {
          name: "issuesPerMonth",
          label: "Issues per Month",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const subs = parseFloat(inputs.subscribers as string) || 0;
        const openRate = parseFloat(inputs.openRate as string) || 40;
        const niche = inputs.niche as string;
        const issues = parseFloat(inputs.issuesPerMonth as string) || 4;

        const nicheCpm: Record<string, number> = {
          finance: 45, tech: 40, marketing: 35, health: 30, news: 25, lifestyle: 20,
        };
        const baseCpm = nicheCpm[niche] || 30;

        // Adjust CPM for open rate vs industry avg (40%)
        const openRateAdj = openRate / 40;
        const effectiveCpm = baseCpm * openRateAdj;

        const opensPerIssue = subs * (openRate / 100);
        const ratePerIssue = (opensPerIssue / 1000) * effectiveCpm;
        const monthlyRevenue = ratePerIssue * issues;

        return {
          primary: { label: "Rate per Issue", value: `$${formatNumber(ratePerIssue, 0)}` },
          details: [
            { label: "Subscribers", value: formatNumber(subs) },
            { label: "Opens per issue", value: formatNumber(opensPerIssue) },
            { label: "Effective CPM", value: `$${formatNumber(effectiveCpm, 2)}` },
            { label: "Rate per issue", value: `$${formatNumber(ratePerIssue, 0)}` },
            { label: "Monthly revenue", value: `$${formatNumber(monthlyRevenue, 0)}` },
            { label: "Annual revenue", value: `$${formatNumber(monthlyRevenue * 12, 0)}` },
          ],
          note: "Finance and B2B newsletters command 2–3x higher CPMs than consumer newsletters due to higher-income readership.",
        };
      },
    },
  ],
  relatedSlugs: ["substack-revenue-calculator", "podcast-sponsorship-rate-calculator", "podcast-cpm-calculator"],
  faq: [
    {
      question: "What CPM should I charge for newsletter sponsorships?",
      answer:
        "Newsletter CPMs range from $20 (lifestyle) to $50+ (finance/B2B). CPM is calculated on opens, not total subscribers. A 10,000-subscriber finance newsletter with 45% open rate (4,500 opens) at $45 CPM = $202 per issue.",
    },
    {
      question: "How big does my newsletter need to be to get sponsors?",
      answer:
        "Direct sponsor deals typically start at 1,000–5,000 engaged subscribers in a valuable niche. B2B/finance newsletters can attract sponsors at 500+ subscribers if the audience is highly targeted (e.g., CFOs, VCs, developers).",
    },
    {
      question: "Should I price on total subscribers or opens?",
      answer:
        "Price on opens (or clicks) to be transparent and credible. Sponsors care about engaged readers. Pricing on opens rewards you for list quality, not just size.",
    },
  ],
  formula: "Rate = (Opens ÷ 1,000) × CPM Rate × Open Rate Adjustment",
};
