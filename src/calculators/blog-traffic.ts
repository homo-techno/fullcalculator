import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const blogTrafficCalculator: CalculatorDefinition = {
  slug: "blog-traffic",
  title: "Blog Traffic Estimator",
  description: "Free blog traffic estimator. Project your blog traffic growth based on publishing frequency, SEO performance, and content promotion efforts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["blog traffic", "traffic estimator", "content traffic", "organic traffic growth", "blog analytics"],
  variants: [
    {
      id: "basic",
      name: "Traffic Growth Projection",
      fields: [
        { name: "currentMonthlyTraffic", label: "Current Monthly Traffic", type: "number", placeholder: "e.g. 10000" },
        { name: "postsPerMonth", label: "New Posts per Month", type: "number", placeholder: "e.g. 8" },
        { name: "avgTrafficPerPost", label: "Avg Monthly Traffic per Post", type: "number", placeholder: "e.g. 200" },
        { name: "monthsProjection", label: "Projection Period (months)", type: "number", placeholder: "e.g. 12" },
        { name: "organicGrowthRate", label: "Monthly Organic Growth (%)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentMonthlyTraffic as number;
        const posts = inputs.postsPerMonth as number;
        const avgTraffic = inputs.avgTrafficPerPost as number;
        const months = inputs.monthsProjection as number;
        const growthRate = inputs.organicGrowthRate as number;
        if (!current || !posts || !avgTraffic || !months) return null;
        let traffic = current;
        const growth = (growthRate || 0) / 100;
        for (let i = 0; i < months; i++) {
          traffic = traffic * (1 + growth) + (posts * avgTraffic);
        }
        const totalNewPosts = posts * months;
        const trafficGain = traffic - current;
        const growthMultiple = traffic / current;
        return {
          primary: { label: "Projected Monthly Traffic", value: formatNumber(Math.round(traffic), 0) },
          details: [
            { label: "Current Monthly Traffic", value: formatNumber(current, 0) },
            { label: "Traffic Increase", value: formatNumber(Math.round(trafficGain), 0) },
            { label: "Growth Multiple", value: `${formatNumber(growthMultiple, 1)}x` },
            { label: "Total New Posts", value: formatNumber(totalNewPosts, 0) },
            { label: "Avg New Traffic per Post", value: formatNumber(avgTraffic, 0) },
          ],
        };
      },
    },
    {
      id: "revenue",
      name: "Blog Revenue Estimate",
      fields: [
        { name: "monthlyTraffic", label: "Monthly Blog Traffic", type: "number", placeholder: "e.g. 50000" },
        { name: "conversionRate", label: "Conversion Rate (%)", type: "number", placeholder: "e.g. 2" },
        { name: "avgConversionValue", label: "Avg Conversion Value ($)", type: "number", placeholder: "e.g. 50" },
        { name: "adRpm", label: "Ad RPM ($)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const traffic = inputs.monthlyTraffic as number;
        const convRate = inputs.conversionRate as number;
        const convValue = inputs.avgConversionValue as number;
        const adRpm = inputs.adRpm as number;
        if (!traffic) return null;
        const conversions = convRate ? traffic * (convRate / 100) : 0;
        const conversionRevenue = conversions * (convValue || 0);
        const adRevenue = adRpm ? (traffic / 1000) * adRpm : 0;
        const totalRevenue = conversionRevenue + adRevenue;
        const revenuePerVisitor = totalRevenue / traffic;
        return {
          primary: { label: "Estimated Monthly Revenue", value: `$${formatNumber(totalRevenue, 2)}` },
          details: [
            { label: "Conversion Revenue", value: `$${formatNumber(conversionRevenue, 2)}` },
            { label: "Ad Revenue", value: `$${formatNumber(adRevenue, 2)}` },
            { label: "Revenue per Visitor", value: `$${formatNumber(revenuePerVisitor, 4)}` },
            { label: "Monthly Conversions", value: formatNumber(conversions, 0) },
            { label: "Annual Revenue Estimate", value: `$${formatNumber(totalRevenue * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["seo-roi", "content-roi", "keyword-density"],
  faq: [
    { question: "How long does it take for a blog to get traffic?", answer: "Most new blogs take 3-6 months to start seeing organic traffic, and 12-18 months to build significant traffic. Consistent publishing, quality content, and SEO optimization accelerate growth." },
    { question: "How much traffic does a blog need to make money?", answer: "With display ads, you need roughly 50,000+ monthly pageviews to earn meaningful ad revenue. With affiliate marketing or products, even 1,000 targeted monthly visitors can generate revenue if conversion rates are high." },
  ],
  formula: "Projected Traffic = Current Traffic x (1 + Growth Rate) + New Posts x Avg Traffic per Post",
};
