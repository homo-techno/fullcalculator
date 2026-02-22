import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seoRoiCalculator: CalculatorDefinition = {
  slug: "seo-roi",
  title: "SEO ROI Calculator",
  description: "Free SEO ROI calculator. Estimate the return on investment from your search engine optimization efforts based on traffic, conversions, and revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["seo roi", "search engine optimization", "organic traffic", "seo investment", "seo revenue"],
  variants: [
    {
      id: "basic",
      name: "Basic SEO ROI",
      fields: [
        { name: "monthlyOrganicTraffic", label: "Monthly Organic Traffic", type: "number", placeholder: "e.g. 50000" },
        { name: "conversionRate", label: "Conversion Rate (%)", type: "number", placeholder: "e.g. 2.5" },
        { name: "avgConversionValue", label: "Avg Conversion Value ($)", type: "number", placeholder: "e.g. 100" },
        { name: "monthlySeoSpend", label: "Monthly SEO Spend ($)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const traffic = inputs.monthlyOrganicTraffic as number;
        const convRate = inputs.conversionRate as number;
        const convValue = inputs.avgConversionValue as number;
        const seoSpend = inputs.monthlySeoSpend as number;
        if (!traffic || !convRate || !convValue || !seoSpend) return null;
        const conversions = traffic * (convRate / 100);
        const revenue = conversions * convValue;
        const profit = revenue - seoSpend;
        const roi = ((revenue - seoSpend) / seoSpend) * 100;
        const costPerAcquisition = seoSpend / conversions;
        return {
          primary: { label: "SEO ROI", value: `${formatNumber(roi, 1)}%` },
          details: [
            { label: "Monthly Conversions", value: formatNumber(conversions, 0) },
            { label: "Monthly Revenue", value: `$${formatNumber(revenue, 2)}` },
            { label: "Monthly Profit", value: `$${formatNumber(profit, 2)}` },
            { label: "Cost Per Acquisition", value: `$${formatNumber(costPerAcquisition, 2)}` },
            { label: "Annual Revenue", value: `$${formatNumber(revenue * 12, 2)}` },
          ],
        };
      },
    },
    {
      id: "vsPaid",
      name: "SEO vs Paid Traffic Value",
      fields: [
        { name: "monthlyOrganicTraffic", label: "Monthly Organic Traffic", type: "number", placeholder: "e.g. 50000" },
        { name: "avgCpc", label: "Equivalent Avg CPC ($)", type: "number", placeholder: "e.g. 2.50" },
        { name: "monthlySeoSpend", label: "Monthly SEO Spend ($)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const traffic = inputs.monthlyOrganicTraffic as number;
        const avgCpc = inputs.avgCpc as number;
        const seoSpend = inputs.monthlySeoSpend as number;
        if (!traffic || !avgCpc || !seoSpend) return null;
        const paidEquivalent = traffic * avgCpc;
        const savings = paidEquivalent - seoSpend;
        const roiMultiple = paidEquivalent / seoSpend;
        return {
          primary: { label: "Organic Traffic Value", value: `$${formatNumber(paidEquivalent, 2)}/mo` },
          details: [
            { label: "Paid Traffic Equivalent", value: `$${formatNumber(paidEquivalent, 2)}` },
            { label: "Monthly SEO Spend", value: `$${formatNumber(seoSpend, 2)}` },
            { label: "Monthly Savings vs Paid", value: `$${formatNumber(savings, 2)}` },
            { label: "Value Multiple", value: `${formatNumber(roiMultiple, 1)}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["content-roi", "keyword-density", "cpc-calculator"],
  faq: [
    { question: "What is a good SEO ROI?", answer: "A good SEO ROI is typically 5:1 or higher (500%+). Unlike paid ads, SEO compounds over time, so ROI often increases as organic rankings stabilize. Most businesses see meaningful ROI within 6-12 months." },
    { question: "How long does it take to see SEO ROI?", answer: "Most SEO campaigns start showing ROI within 6-12 months. Initial results may appear in 3-4 months, but significant returns typically come after consistent effort over 12+ months." },
  ],
  formula: "SEO ROI = ((Revenue from Organic - SEO Cost) / SEO Cost) x 100",
};
