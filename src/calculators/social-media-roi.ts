import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialMediaRoiCalculator: CalculatorDefinition = {
  slug: "social-media-roi",
  title: "Social Media ROI Calculator",
  description: "Free social media ROI calculator. Measure the return on investment from your social media marketing campaigns across all platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["social media roi", "social marketing", "social media investment", "facebook roi", "instagram roi"],
  variants: [
    {
      id: "basic",
      name: "Basic Social ROI",
      fields: [
        { name: "totalSpend", label: "Total Social Media Spend ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "revenueFromSocial", label: "Revenue from Social ($)", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const totalSpend = inputs.totalSpend as number;
        const revenue = inputs.revenueFromSocial as number;
        if (!totalSpend || !revenue) return null;
        const profit = revenue - totalSpend;
        const roi = ((revenue - totalSpend) / totalSpend) * 100;
        return {
          primary: { label: "Social Media ROI", value: `${formatNumber(roi, 1)}%` },
          details: [
            { label: "Total Spend", value: `$${formatNumber(totalSpend, 2)}` },
            { label: "Revenue from Social", value: `$${formatNumber(revenue, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(profit, 2)}` },
            { label: "Revenue per $1 Spent", value: `$${formatNumber(revenue / totalSpend, 2)}` },
          ],
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed Social ROI",
      fields: [
        { name: "adSpend", label: "Ad Spend ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "laborCost", label: "Labor/Management Cost ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "toolsCost", label: "Tools/Software Cost ($)", type: "number", placeholder: "e.g. 200" },
        { name: "revenueFromSocial", label: "Revenue from Social ($)", type: "number", placeholder: "e.g. 15000" },
        { name: "leadsGenerated", label: "Leads Generated", type: "number", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const adSpend = inputs.adSpend as number;
        const laborCost = inputs.laborCost as number;
        const toolsCost = inputs.toolsCost as number;
        const revenue = inputs.revenueFromSocial as number;
        const leads = inputs.leadsGenerated as number;
        if (!adSpend || !revenue) return null;
        const totalCost = adSpend + (laborCost || 0) + (toolsCost || 0);
        const roi = ((revenue - totalCost) / totalCost) * 100;
        const costPerLead = leads ? totalCost / leads : 0;
        const revenuePerLead = leads ? revenue / leads : 0;
        return {
          primary: { label: "Social Media ROI", value: `${formatNumber(roi, 1)}%` },
          details: [
            { label: "Total Investment", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Revenue Generated", value: `$${formatNumber(revenue, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(revenue - totalCost, 2)}` },
            { label: "Cost per Lead", value: `$${formatNumber(costPerLead, 2)}` },
            { label: "Revenue per Lead", value: `$${formatNumber(revenuePerLead, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["content-roi", "engagement-rate", "roas-calculator"],
  faq: [
    { question: "How do you calculate social media ROI?", answer: "Social Media ROI = ((Revenue from Social - Total Social Cost) / Total Social Cost) x 100. Include all costs: ad spend, labor, tools, and content creation." },
    { question: "What is a good social media ROI?", answer: "Any positive ROI is good for social media. A 200-300%+ ROI is considered strong. Remember that social media also provides brand awareness and engagement value that is harder to quantify." },
  ],
  formula: "Social ROI = ((Revenue - Total Cost) / Total Cost) x 100",
};
