import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cpcCalculator: CalculatorDefinition = {
  slug: "cpc-calculator",
  title: "Cost Per Click Calculator",
  description: "Free cost per click (CPC) calculator. Determine how much each click costs in your advertising campaigns and optimize your ad spend efficiency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cpc", "cost per click", "ppc", "advertising cost", "ad spend", "paid search"],
  variants: [
    {
      id: "basic",
      name: "Basic CPC",
      fields: [
        { name: "totalSpend", label: "Total Ad Spend ($)", type: "number", placeholder: "e.g. 500" },
        { name: "totalClicks", label: "Total Clicks", type: "number", placeholder: "e.g. 250" },
      ],
      calculate: (inputs) => {
        const totalSpend = inputs.totalSpend as number;
        const totalClicks = inputs.totalClicks as number;
        if (!totalSpend || !totalClicks) return null;
        const cpc = totalSpend / totalClicks;
        return {
          primary: { label: "Cost Per Click", value: `$${formatNumber(cpc, 2)}` },
          details: [
            { label: "Total Ad Spend", value: `$${formatNumber(totalSpend, 2)}` },
            { label: "Total Clicks", value: formatNumber(totalClicks, 0) },
            { label: "Clicks per $100", value: formatNumber(100 / cpc, 1) },
          ],
        };
      },
    },
    {
      id: "withConversion",
      name: "CPC with Conversion Data",
      fields: [
        { name: "totalSpend", label: "Total Ad Spend ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "totalClicks", label: "Total Clicks", type: "number", placeholder: "e.g. 500" },
        { name: "conversions", label: "Conversions", type: "number", placeholder: "e.g. 25" },
        { name: "revenuePerConversion", label: "Revenue Per Conversion ($)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const totalSpend = inputs.totalSpend as number;
        const totalClicks = inputs.totalClicks as number;
        const conversions = inputs.conversions as number;
        const revenuePerConversion = inputs.revenuePerConversion as number;
        if (!totalSpend || !totalClicks || !conversions || !revenuePerConversion) return null;
        const cpc = totalSpend / totalClicks;
        const conversionRate = (conversions / totalClicks) * 100;
        const costPerConversion = totalSpend / conversions;
        const totalRevenue = conversions * revenuePerConversion;
        const profit = totalRevenue - totalSpend;
        const roas = totalRevenue / totalSpend;
        return {
          primary: { label: "Cost Per Click", value: `$${formatNumber(cpc, 2)}` },
          details: [
            { label: "Conversion Rate", value: `${formatNumber(conversionRate, 2)}%` },
            { label: "Cost Per Conversion", value: `$${formatNumber(costPerConversion, 2)}` },
            { label: "Total Revenue", value: `$${formatNumber(totalRevenue, 2)}` },
            { label: "Profit / Loss", value: `$${formatNumber(profit, 2)}` },
            { label: "ROAS", value: `${formatNumber(roas, 2)}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ctr-calculator", "cpm-calculator", "roas-calculator"],
  faq: [
    { question: "What is a good cost per click?", answer: "A good CPC depends on your industry and profit margins. For Google Ads, the average CPC is $1-$2 for search and under $1 for display. High-value industries like law or insurance can see CPCs of $5-$50+." },
    { question: "How do I lower my CPC?", answer: "Lower CPC by improving your Quality Score, refining keyword targeting, using negative keywords, adjusting bids, and testing different ad variations." },
  ],
  formula: "CPC = Total Ad Spend / Total Clicks",
};
