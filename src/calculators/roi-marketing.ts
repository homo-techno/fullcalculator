import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roiMarketingCalculator: CalculatorDefinition = {
  slug: "roi-marketing-calculator",
  title: "Marketing ROI Calculator",
  description: "Free marketing ROI calculator. Calculate return on investment for marketing campaigns, ad spend, and overall marketing budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["marketing ROI calculator", "ROAS calculator", "ad ROI calculator", "marketing return calculator", "campaign ROI"],
  variants: [
    {
      id: "basic",
      name: "Marketing ROI",
      description: "Calculate overall return on marketing investment",
      fields: [
        { name: "revenueGenerated", label: "Revenue Generated from Marketing", type: "number", placeholder: "e.g. 150000", prefix: "$" },
        { name: "marketingCost", label: "Total Marketing Cost", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "cogs", label: "Cost of Goods Sold (for that revenue)", type: "number", placeholder: "e.g. 60000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.revenueGenerated as number;
        const cost = inputs.marketingCost as number;
        const cogs = (inputs.cogs as number) || 0;
        if (!revenue || !cost) return null;
        const grossProfit = revenue - cogs;
        const roi = ((grossProfit - cost) / cost) * 100;
        const roas = revenue / cost;
        const netProfit = grossProfit - cost;
        return {
          primary: { label: "Marketing ROI", value: formatNumber(roi), suffix: "%" },
          details: [
            { label: "ROAS (Return on Ad Spend)", value: `${formatNumber(roas, 2)}x` },
            { label: "Net Profit from Marketing", value: `$${formatNumber(netProfit)}` },
            { label: "Gross Profit", value: `$${formatNumber(grossProfit)}` },
            { label: "Revenue Generated", value: `$${formatNumber(revenue)}` },
            { label: "Marketing Cost", value: `$${formatNumber(cost)}` },
            { label: "For every $1 spent", value: `$${formatNumber(roas)} revenue` },
          ],
        };
      },
    },
    {
      id: "roas",
      name: "ROAS (Return on Ad Spend)",
      description: "Calculate return on ad spend for paid advertising campaigns",
      fields: [
        { name: "adSpend", label: "Total Ad Spend", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "conversions", label: "Number of Conversions", type: "number", placeholder: "e.g. 100" },
        { name: "avgOrderValue", label: "Average Order Value", type: "number", placeholder: "e.g. 75", prefix: "$" },
        { name: "profitMargin", label: "Profit Margin %", type: "number", placeholder: "e.g. 40", suffix: "%" },
      ],
      calculate: (inputs) => {
        const adSpend = inputs.adSpend as number;
        const conversions = inputs.conversions as number;
        const aov = inputs.avgOrderValue as number;
        const margin = (inputs.profitMargin as number) || 100;
        if (!adSpend || !conversions || !aov) return null;
        const totalRevenue = conversions * aov;
        const roas = totalRevenue / adSpend;
        const costPerConversion = adSpend / conversions;
        const profitPerConversion = aov * (margin / 100) - costPerConversion;
        const totalProfit = totalRevenue * (margin / 100) - adSpend;
        const roi = (totalProfit / adSpend) * 100;
        return {
          primary: { label: "ROAS", value: `${formatNumber(roas, 2)}x` },
          details: [
            { label: "Marketing ROI", value: `${formatNumber(roi)}%` },
            { label: "Total Revenue", value: `$${formatNumber(totalRevenue)}` },
            { label: "Total Profit (after ad spend)", value: `$${formatNumber(totalProfit)}` },
            { label: "Cost per Conversion", value: `$${formatNumber(costPerConversion)}` },
            { label: "Profit per Conversion", value: `$${formatNumber(profitPerConversion)}` },
            { label: "Conversions", value: formatNumber(conversions, 0) },
          ],
          note: roas < 1 ? "ROAS below 1x means you are losing money on ad spend." : undefined,
        };
      },
    },
    {
      id: "channelComparison",
      name: "Channel Comparison",
      description: "Compare marketing ROI across different channels",
      fields: [
        { name: "channel1Name", label: "Channel 1 (e.g., Google Ads)", type: "select", options: [
          { label: "Google Ads", value: "Google Ads" },
          { label: "Facebook/Meta Ads", value: "Facebook Ads" },
          { label: "Email Marketing", value: "Email" },
          { label: "SEO/Content", value: "SEO" },
          { label: "Social Media", value: "Social" },
          { label: "Other", value: "Channel 1" },
        ], defaultValue: "Google Ads" },
        { name: "spend1", label: "Channel 1 Spend", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "revenue1", label: "Channel 1 Revenue", type: "number", placeholder: "e.g. 40000", prefix: "$" },
        { name: "channel2Name", label: "Channel 2 (e.g., Facebook)", type: "select", options: [
          { label: "Google Ads", value: "Google Ads" },
          { label: "Facebook/Meta Ads", value: "Facebook Ads" },
          { label: "Email Marketing", value: "Email" },
          { label: "SEO/Content", value: "SEO" },
          { label: "Social Media", value: "Social" },
          { label: "Other", value: "Channel 2" },
        ], defaultValue: "Facebook Ads" },
        { name: "spend2", label: "Channel 2 Spend", type: "number", placeholder: "e.g. 8000", prefix: "$" },
        { name: "revenue2", label: "Channel 2 Revenue", type: "number", placeholder: "e.g. 28000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const ch1 = inputs.channel1Name as string;
        const spend1 = inputs.spend1 as number;
        const rev1 = inputs.revenue1 as number;
        const ch2 = inputs.channel2Name as string;
        const spend2 = inputs.spend2 as number;
        const rev2 = inputs.revenue2 as number;
        if (!spend1 || !rev1 || !spend2 || !rev2) return null;
        const roas1 = rev1 / spend1;
        const roas2 = rev2 / spend2;
        const roi1 = ((rev1 - spend1) / spend1) * 100;
        const roi2 = ((rev2 - spend2) / spend2) * 100;
        const better = roas1 >= roas2 ? ch1 : ch2;
        return {
          primary: { label: "Better Performing Channel", value: better, suffix: `${formatNumber(Math.max(roas1, roas2), 2)}x ROAS` },
          details: [
            { label: `${ch1} ROAS`, value: `${formatNumber(roas1, 2)}x` },
            { label: `${ch2} ROAS`, value: `${formatNumber(roas2, 2)}x` },
            { label: `${ch1} ROI`, value: `${formatNumber(roi1)}%` },
            { label: `${ch2} ROI`, value: `${formatNumber(roi2)}%` },
            { label: `${ch1} Profit`, value: `$${formatNumber(rev1 - spend1)}` },
            { label: `${ch2} Profit`, value: `$${formatNumber(rev2 - spend2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "cac-calculator", "customer-lifetime-value-calculator"],
  faq: [
    { question: "What is marketing ROI?", answer: "Marketing ROI measures the profit generated relative to marketing spend. Formula: ROI = (Gross Profit - Marketing Cost) / Marketing Cost × 100. A 200% marketing ROI means every $1 spent generated $2 in profit. It is the key metric for evaluating marketing effectiveness." },
    { question: "What is ROAS and how is it different from ROI?", answer: "ROAS (Return on Ad Spend) = Revenue / Ad Spend. It measures revenue per dollar, not profit. ROI accounts for product costs (COGS). Example: $5,000 ad spend generates $20,000 revenue = 4x ROAS. If COGS is $10,000, ROI = ($10,000 profit - $5,000 ads) / $5,000 = 100%." },
    { question: "What is a good marketing ROI?", answer: "A 5:1 ratio (500% ROI or 5x ROAS) is considered good. 10:1 is exceptional. 2:1 is break-even for most businesses after COGS. Average benchmarks: Google Ads ROAS 2-4x, Facebook Ads 2-5x, Email marketing ROI 4,200% (DMA study), SEO varies but compounds over time." },
  ],
  formula: "Marketing ROI = (Gross Profit - Marketing Cost) / Marketing Cost × 100 | ROAS = Revenue / Ad Spend | Cost per Conversion = Ad Spend / Conversions",
};
