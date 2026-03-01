import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costPerLeadCalculator: CalculatorDefinition = {
  slug: "cost-per-lead-calculator",
  title: "Cost Per Lead Calculator",
  description: "Calculate the cost per lead from your marketing campaigns to measure advertising efficiency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost per lead", "CPL calculator", "marketing cost per lead"],
  variants: [{
    id: "standard",
    name: "Cost Per Lead",
    description: "Calculate the cost per lead from your marketing campaigns to measure advertising efficiency",
    fields: [
      { name: "adSpend", label: "Total Ad Spend", type: "number", suffix: "$", min: 100, max: 1000000, defaultValue: 5000 },
      { name: "leads", label: "Number of Leads Generated", type: "number", suffix: "leads", min: 1, max: 100000, defaultValue: 200 },
      { name: "conversionRate", label: "Lead to Customer Rate", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 10 },
      { name: "avgDealValue", label: "Average Deal Value", type: "number", suffix: "$", min: 10, max: 100000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const spend = inputs.adSpend as number;
      const leads = inputs.leads as number;
      const convRate = inputs.conversionRate as number;
      const dealValue = inputs.avgDealValue as number;
      if (!spend || !leads) return null;
      const cpl = spend / leads;
      const customers = leads * (convRate / 100);
      const cpa = customers > 0 ? spend / customers : 0;
      const revenue = customers * dealValue;
      const roas = spend > 0 ? revenue / spend : 0;
      return {
        primary: { label: "Cost Per Lead", value: "$" + formatNumber(cpl) },
        details: [
          { label: "Total Leads", value: formatNumber(leads) },
          { label: "Estimated Customers", value: formatNumber(Math.round(customers)) },
          { label: "Cost Per Acquisition", value: "$" + formatNumber(cpa) },
          { label: "Estimated Revenue", value: "$" + formatNumber(revenue) },
          { label: "Return on Ad Spend", value: formatNumber(roas) + "x" },
        ],
      };
    },
  }],
  relatedSlugs: ["customer-acquisition-cost-calculator", "churn-rate-calculator"],
  faq: [
    { question: "What is a good cost per lead?", answer: "A good cost per lead varies by industry. B2B leads typically cost $30 to $200, while B2C leads cost $5 to $50. The key metric is whether the CPL allows profitable customer acquisition." },
    { question: "How do you reduce cost per lead?", answer: "Reduce CPL by improving ad targeting, optimizing landing pages, A/B testing ad creative, using retargeting campaigns, and focusing on channels that produce the highest quality leads." },
  ],
  formula: "CPL = Total Ad Spend / Number of Leads; CPA = Ad Spend / Customers",
};
