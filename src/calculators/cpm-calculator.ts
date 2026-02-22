import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cpmCalculator: CalculatorDefinition = {
  slug: "cpm-calculator",
  title: "CPM Calculator (Cost Per Mille)",
  description: "Free CPM calculator. Calculate cost per thousand impressions for your advertising campaigns and compare ad placement costs across platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cpm", "cost per mille", "cost per thousand", "impressions", "advertising", "media buying"],
  variants: [
    {
      id: "basic",
      name: "Calculate CPM",
      fields: [
        { name: "totalSpend", label: "Total Ad Spend ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "impressions", label: "Total Impressions", type: "number", placeholder: "e.g. 500000" },
      ],
      calculate: (inputs) => {
        const totalSpend = inputs.totalSpend as number;
        const impressions = inputs.impressions as number;
        if (!totalSpend || !impressions) return null;
        const cpm = (totalSpend / impressions) * 1000;
        const costPerImpression = totalSpend / impressions;
        return {
          primary: { label: "CPM (Cost Per 1,000 Impressions)", value: `$${formatNumber(cpm, 2)}` },
          details: [
            { label: "Total Ad Spend", value: `$${formatNumber(totalSpend, 2)}` },
            { label: "Total Impressions", value: formatNumber(impressions, 0) },
            { label: "Cost Per Single Impression", value: `$${formatNumber(costPerImpression, 4)}` },
            { label: "Impressions per $1", value: formatNumber(impressions / totalSpend, 1) },
          ],
        };
      },
    },
    {
      id: "fromCpm",
      name: "Estimate Cost from CPM",
      fields: [
        { name: "cpm", label: "CPM Rate ($)", type: "number", placeholder: "e.g. 5.00" },
        { name: "desiredImpressions", label: "Desired Impressions", type: "number", placeholder: "e.g. 1000000" },
      ],
      calculate: (inputs) => {
        const cpm = inputs.cpm as number;
        const desiredImpressions = inputs.desiredImpressions as number;
        if (!cpm || !desiredImpressions) return null;
        const totalCost = (cpm / 1000) * desiredImpressions;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "CPM Rate", value: `$${formatNumber(cpm, 2)}` },
            { label: "Desired Impressions", value: formatNumber(desiredImpressions, 0) },
            { label: "Cost Per Single Impression", value: `$${formatNumber(cpm / 1000, 4)}` },
            { label: "Impressions per $100", value: formatNumber((100 / cpm) * 1000, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cpc-calculator", "ctr-calculator", "roas-calculator"],
  faq: [
    { question: "What does CPM mean?", answer: "CPM stands for Cost Per Mille (mille means thousand in Latin). It represents the cost an advertiser pays per 1,000 impressions of their ad. It is one of the most common pricing models in digital advertising." },
    { question: "What is a good CPM?", answer: "Average CPMs vary widely by platform: Facebook $5-$15, Google Display $2-$5, LinkedIn $6-$9, programmatic display $1-$5. B2B typically has higher CPMs than B2C." },
  ],
  formula: "CPM = (Total Ad Spend / Total Impressions) x 1,000",
};
