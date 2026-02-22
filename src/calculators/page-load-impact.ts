import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pageLoadImpactCalculator: CalculatorDefinition = {
  slug: "page-load-impact",
  title: "Page Load Impact on Conversion",
  description: "Free page load impact calculator. Estimate how page load time affects your conversion rate and revenue based on industry benchmarks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["page load", "page speed", "conversion rate", "site performance", "web performance", "core web vitals"],
  variants: [
    {
      id: "basic",
      name: "Revenue Impact",
      fields: [
        { name: "currentLoadTime", label: "Current Load Time (seconds)", type: "number", placeholder: "e.g. 5" },
        { name: "targetLoadTime", label: "Target Load Time (seconds)", type: "number", placeholder: "e.g. 2" },
        { name: "monthlyVisitors", label: "Monthly Visitors", type: "number", placeholder: "e.g. 100000" },
        { name: "currentConversionRate", label: "Current Conversion Rate (%)", type: "number", placeholder: "e.g. 2.5" },
        { name: "avgOrderValue", label: "Average Order Value ($)", type: "number", placeholder: "e.g. 75" },
      ],
      calculate: (inputs) => {
        const currentLoadTime = inputs.currentLoadTime as number;
        const targetLoadTime = inputs.targetLoadTime as number;
        const monthlyVisitors = inputs.monthlyVisitors as number;
        const currentConversionRate = inputs.currentConversionRate as number;
        const avgOrderValue = inputs.avgOrderValue as number;
        if (!currentLoadTime || !targetLoadTime || !monthlyVisitors || !currentConversionRate || !avgOrderValue) return null;
        const improvementSeconds = currentLoadTime - targetLoadTime;
        const conversionLiftPercent = improvementSeconds * 7;
        const newConversionRate = currentConversionRate * (1 + conversionLiftPercent / 100);
        const currentRevenue = monthlyVisitors * (currentConversionRate / 100) * avgOrderValue;
        const newRevenue = monthlyVisitors * (newConversionRate / 100) * avgOrderValue;
        const additionalRevenue = newRevenue - currentRevenue;
        return {
          primary: { label: "Additional Monthly Revenue", value: `$${formatNumber(additionalRevenue, 2)}` },
          details: [
            { label: "Load Time Improvement", value: `${formatNumber(improvementSeconds, 1)}s` },
            { label: "Estimated Conversion Lift", value: `${formatNumber(conversionLiftPercent, 1)}%` },
            { label: "New Conversion Rate", value: `${formatNumber(newConversionRate, 2)}%` },
            { label: "Current Monthly Revenue", value: `$${formatNumber(currentRevenue, 2)}` },
            { label: "Projected Monthly Revenue", value: `$${formatNumber(newRevenue, 2)}` },
            { label: "Annual Revenue Gain", value: `$${formatNumber(additionalRevenue * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bounce-rate", "seo-roi", "ab-test-significance"],
  faq: [
    { question: "How does page speed affect conversions?", answer: "Studies show that each additional second of load time can reduce conversions by about 7%. Pages loading in under 2 seconds have significantly higher conversion rates than those loading in 5+ seconds." },
    { question: "What is a good page load time?", answer: "Google recommends pages load in under 2.5 seconds. For e-commerce, under 2 seconds is ideal. The average page load time is about 3.2 seconds on desktop and 8.6 seconds on mobile." },
  ],
  formula: "Revenue Impact = Monthly Visitors x Conversion Lift x Avg Order Value",
};
