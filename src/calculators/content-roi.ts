import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contentRoiCalculator: CalculatorDefinition = {
  slug: "content-roi",
  title: "Content Marketing ROI Calculator",
  description: "Free content marketing ROI calculator. Measure the return on investment from your content marketing efforts including blog posts, videos, and other content.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["content marketing roi", "content roi", "blog roi", "content investment", "marketing return"],
  variants: [
    {
      id: "basic",
      name: "Basic Content ROI",
      fields: [
        { name: "contentCost", label: "Content Production Cost ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "distributionCost", label: "Distribution/Promotion Cost ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "revenueGenerated", label: "Revenue Generated ($)", type: "number", placeholder: "e.g. 15000" },
      ],
      calculate: (inputs) => {
        const contentCost = inputs.contentCost as number;
        const distributionCost = inputs.distributionCost as number;
        const revenueGenerated = inputs.revenueGenerated as number;
        if (!contentCost || !revenueGenerated) return null;
        const totalCost = contentCost + (distributionCost || 0);
        const profit = revenueGenerated - totalCost;
        const roi = ((revenueGenerated - totalCost) / totalCost) * 100;
        const revenuePerDollar = revenueGenerated / totalCost;
        return {
          primary: { label: "Content ROI", value: `${formatNumber(roi, 1)}%` },
          details: [
            { label: "Total Investment", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Revenue Generated", value: `$${formatNumber(revenueGenerated, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(profit, 2)}` },
            { label: "Revenue per $1 Invested", value: `$${formatNumber(revenuePerDollar, 2)}` },
          ],
        };
      },
    },
    {
      id: "perPiece",
      name: "Per Content Piece Analysis",
      fields: [
        { name: "costPerPiece", label: "Cost Per Content Piece ($)", type: "number", placeholder: "e.g. 500" },
        { name: "totalPieces", label: "Number of Pieces", type: "number", placeholder: "e.g. 12" },
        { name: "totalTraffic", label: "Total Traffic Generated", type: "number", placeholder: "e.g. 50000" },
        { name: "conversionRate", label: "Conversion Rate (%)", type: "number", placeholder: "e.g. 3" },
        { name: "avgConversionValue", label: "Avg Conversion Value ($)", type: "number", placeholder: "e.g. 80" },
      ],
      calculate: (inputs) => {
        const costPerPiece = inputs.costPerPiece as number;
        const totalPieces = inputs.totalPieces as number;
        const totalTraffic = inputs.totalTraffic as number;
        const convRate = inputs.conversionRate as number;
        const convValue = inputs.avgConversionValue as number;
        if (!costPerPiece || !totalPieces || !totalTraffic || !convRate || !convValue) return null;
        const totalCost = costPerPiece * totalPieces;
        const conversions = totalTraffic * (convRate / 100);
        const revenue = conversions * convValue;
        const roi = ((revenue - totalCost) / totalCost) * 100;
        const trafficPerPiece = totalTraffic / totalPieces;
        const revenuePerPiece = revenue / totalPieces;
        return {
          primary: { label: "Content ROI", value: `${formatNumber(roi, 1)}%` },
          details: [
            { label: "Total Content Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Total Revenue", value: `$${formatNumber(revenue, 2)}` },
            { label: "Traffic per Piece", value: formatNumber(trafficPerPiece, 0) },
            { label: "Revenue per Piece", value: `$${formatNumber(revenuePerPiece, 2)}` },
            { label: "Total Conversions", value: formatNumber(conversions, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["seo-roi", "social-media-roi", "blog-traffic"],
  faq: [
    { question: "What is a good content marketing ROI?", answer: "A content marketing ROI of 300-500% or higher is considered good. Content marketing typically delivers compounding returns over time, as evergreen content continues generating traffic and leads long after publication." },
    { question: "How do I measure content marketing ROI?", answer: "Measure content ROI by tracking organic traffic, lead generation, conversions, and revenue attributable to content. Use tools like Google Analytics to track content performance and attribution models to assign revenue." },
  ],
  formula: "Content ROI = ((Revenue - Total Cost) / Total Cost) x 100",
};
