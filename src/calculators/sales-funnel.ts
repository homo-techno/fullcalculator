import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salesFunnelCalculator: CalculatorDefinition = {
  slug: "sales-funnel",
  title: "Sales Funnel Conversion Calculator",
  description: "Free sales funnel conversion calculator. Analyze conversion rates at each stage of your sales funnel and identify bottlenecks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sales funnel", "conversion funnel", "funnel analysis", "pipeline conversion", "sales pipeline"],
  variants: [
    {
      id: "basic",
      name: "Funnel Conversion",
      fields: [
        { name: "visitors", label: "Website Visitors", type: "number", placeholder: "e.g. 10000" },
        { name: "leads", label: "Leads Generated", type: "number", placeholder: "e.g. 500" },
        { name: "qualifiedLeads", label: "Qualified Leads (MQL)", type: "number", placeholder: "e.g. 200" },
        { name: "opportunities", label: "Sales Opportunities", type: "number", placeholder: "e.g. 80" },
        { name: "closedDeals", label: "Closed Deals", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const visitors = inputs.visitors as number;
        const leads = inputs.leads as number;
        const qualified = inputs.qualifiedLeads as number;
        const opportunities = inputs.opportunities as number;
        const closed = inputs.closedDeals as number;
        if (!visitors || !leads || !qualified || !opportunities || !closed) return null;
        const visitorToLead = (leads / visitors) * 100;
        const leadToQualified = (qualified / leads) * 100;
        const qualifiedToOpportunity = (opportunities / qualified) * 100;
        const opportunityToClose = (closed / opportunities) * 100;
        const overallRate = (closed / visitors) * 100;
        return {
          primary: { label: "Overall Conversion Rate", value: `${formatNumber(overallRate, 2)}%` },
          details: [
            { label: "Visitor to Lead", value: `${formatNumber(visitorToLead, 2)}%` },
            { label: "Lead to Qualified", value: `${formatNumber(leadToQualified, 2)}%` },
            { label: "Qualified to Opportunity", value: `${formatNumber(qualifiedToOpportunity, 2)}%` },
            { label: "Opportunity to Close", value: `${formatNumber(opportunityToClose, 2)}%` },
            { label: "Closed Deals", value: formatNumber(closed, 0) },
          ],
        };
      },
    },
    {
      id: "revenue",
      name: "Funnel Revenue Analysis",
      fields: [
        { name: "visitors", label: "Website Visitors", type: "number", placeholder: "e.g. 10000" },
        { name: "conversionRate", label: "Overall Conversion Rate (%)", type: "number", placeholder: "e.g. 0.2" },
        { name: "avgDealValue", label: "Avg Deal Value ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "marketingCost", label: "Total Marketing Cost ($)", type: "number", placeholder: "e.g. 15000" },
      ],
      calculate: (inputs) => {
        const visitors = inputs.visitors as number;
        const convRate = inputs.conversionRate as number;
        const dealValue = inputs.avgDealValue as number;
        const cost = inputs.marketingCost as number;
        if (!visitors || !convRate || !dealValue || !cost) return null;
        const deals = visitors * (convRate / 100);
        const revenue = deals * dealValue;
        const roi = ((revenue - cost) / cost) * 100;
        const costPerDeal = cost / deals;
        const revenuePerVisitor = revenue / visitors;
        return {
          primary: { label: "Projected Revenue", value: `$${formatNumber(revenue, 2)}` },
          details: [
            { label: "Expected Deals", value: formatNumber(deals, 1) },
            { label: "Marketing ROI", value: `${formatNumber(roi, 1)}%` },
            { label: "Cost per Deal", value: `$${formatNumber(costPerDeal, 2)}` },
            { label: "Revenue per Visitor", value: `$${formatNumber(revenuePerVisitor, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["customer-acquisition-cost", "lead-scoring", "retention-rate"],
  faq: [
    { question: "What is a sales funnel?", answer: "A sales funnel represents the journey from initial awareness to purchase. Typical stages include: Visitors > Leads > Qualified Leads > Opportunities > Closed Deals. Each stage has a conversion rate that determines how many prospects advance." },
    { question: "What is a good funnel conversion rate?", answer: "Overall funnel conversion rates of 1-5% are typical for B2B. Individual stage rates vary: visitor-to-lead 2-5%, lead-to-MQL 30-40%, MQL-to-opportunity 30-50%, opportunity-to-close 20-30%." },
  ],
  formula: "Overall Conversion = (Closed Deals / Total Visitors) x 100",
};
