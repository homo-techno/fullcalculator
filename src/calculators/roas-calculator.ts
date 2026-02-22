import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roasCalculator: CalculatorDefinition = {
  slug: "roas-calculator",
  title: "ROAS Calculator (Return On Ad Spend)",
  description: "Free ROAS calculator. Measure the effectiveness of your advertising campaigns by calculating the revenue generated for every dollar spent on ads.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["roas", "return on ad spend", "ad revenue", "advertising roi", "campaign performance"],
  variants: [
    {
      id: "basic",
      name: "Basic ROAS",
      fields: [
        { name: "revenue", label: "Revenue from Ads ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "adSpend", label: "Total Ad Spend ($)", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.revenue as number;
        const adSpend = inputs.adSpend as number;
        if (!revenue || !adSpend) return null;
        const roas = revenue / adSpend;
        const roasPercent = roas * 100;
        const profit = revenue - adSpend;
        return {
          primary: { label: "ROAS", value: `${formatNumber(roas, 2)}x` },
          details: [
            { label: "ROAS Percentage", value: `${formatNumber(roasPercent, 1)}%` },
            { label: "Revenue from Ads", value: `$${formatNumber(revenue, 2)}` },
            { label: "Total Ad Spend", value: `$${formatNumber(adSpend, 2)}` },
            { label: "Gross Profit from Ads", value: `$${formatNumber(profit, 2)}` },
            { label: "Revenue per $1 Spent", value: `$${formatNumber(roas, 2)}` },
          ],
        };
      },
    },
    {
      id: "withMargin",
      name: "ROAS with Profit Margin",
      fields: [
        { name: "revenue", label: "Revenue from Ads ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "adSpend", label: "Total Ad Spend ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "profitMargin", label: "Product Profit Margin (%)", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.revenue as number;
        const adSpend = inputs.adSpend as number;
        const profitMargin = inputs.profitMargin as number;
        if (!revenue || !adSpend || !profitMargin) return null;
        const roas = revenue / adSpend;
        const grossProfit = revenue * (profitMargin / 100);
        const netProfit = grossProfit - adSpend;
        const breakEvenRoas = 1 / (profitMargin / 100);
        const profitable = roas > breakEvenRoas;
        return {
          primary: { label: "ROAS", value: `${formatNumber(roas, 2)}x` },
          details: [
            { label: "Gross Profit from Revenue", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Net Profit after Ad Spend", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Break-Even ROAS", value: `${formatNumber(breakEvenRoas, 2)}x` },
            { label: "Campaign Profitable?", value: profitable ? "Yes" : "No" },
            { label: "Revenue per $1 Spent", value: `$${formatNumber(roas, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cpc-calculator", "ctr-calculator", "content-roi"],
  faq: [
    { question: "What is a good ROAS?", answer: "A ROAS of 4:1 ($4 revenue for every $1 spent) is generally considered good. However, this depends on your profit margins. If your margin is 50%, you need at least a 2:1 ROAS to break even." },
    { question: "What is the difference between ROAS and ROI?", answer: "ROAS measures gross revenue relative to ad spend, while ROI measures net profit relative to total investment. ROAS = Revenue / Ad Spend. ROI = (Profit - Cost) / Cost x 100." },
  ],
  formula: "ROAS = Revenue from Ads / Total Ad Spend",
};
