import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retentionRateCalculator: CalculatorDefinition = {
  slug: "retention-rate",
  title: "Customer Retention Rate Calculator",
  description: "Free customer retention rate calculator. Measure how effectively you retain customers over a given period and estimate the revenue impact of improving retention.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retention rate", "customer retention", "churn rate", "customer loyalty", "repeat customers"],
  variants: [
    {
      id: "basic",
      name: "Basic Retention Rate",
      fields: [
        { name: "customersStart", label: "Customers at Start", type: "number", placeholder: "e.g. 1000" },
        { name: "customersEnd", label: "Customers at End", type: "number", placeholder: "e.g. 950" },
        { name: "newCustomers", label: "New Customers Acquired", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const start = inputs.customersStart as number;
        const end = inputs.customersEnd as number;
        const newCust = inputs.newCustomers as number;
        if (!start || !end) return null;
        const retained = end - (newCust || 0);
        const retentionRate = (retained / start) * 100;
        const churnRate = 100 - retentionRate;
        const churned = start - retained;
        return {
          primary: { label: "Retention Rate", value: `${formatNumber(retentionRate, 2)}%` },
          details: [
            { label: "Churn Rate", value: `${formatNumber(churnRate, 2)}%` },
            { label: "Customers Retained", value: formatNumber(retained, 0) },
            { label: "Customers Lost", value: formatNumber(churned, 0) },
            { label: "New Customers Added", value: formatNumber(newCust || 0, 0) },
          ],
        };
      },
    },
    {
      id: "revenue",
      name: "Retention Revenue Impact",
      fields: [
        { name: "totalCustomers", label: "Total Customers", type: "number", placeholder: "e.g. 1000" },
        { name: "currentRetention", label: "Current Retention Rate (%)", type: "number", placeholder: "e.g. 85" },
        { name: "targetRetention", label: "Target Retention Rate (%)", type: "number", placeholder: "e.g. 90" },
        { name: "avgRevenuePerCustomer", label: "Avg Revenue per Customer ($)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const customers = inputs.totalCustomers as number;
        const currentRate = inputs.currentRetention as number;
        const targetRate = inputs.targetRetention as number;
        const avgRevenue = inputs.avgRevenuePerCustomer as number;
        if (!customers || !currentRate || !targetRate || !avgRevenue) return null;
        const currentRetained = customers * (currentRate / 100);
        const targetRetained = customers * (targetRate / 100);
        const additionalRetained = targetRetained - currentRetained;
        const additionalRevenue = additionalRetained * avgRevenue;
        const currentRevenue = currentRetained * avgRevenue;
        const targetRevenue = targetRetained * avgRevenue;
        return {
          primary: { label: "Additional Revenue from Retention", value: `$${formatNumber(additionalRevenue, 2)}` },
          details: [
            { label: "Additional Customers Retained", value: formatNumber(additionalRetained, 0) },
            { label: "Current Revenue", value: `$${formatNumber(currentRevenue, 2)}` },
            { label: "Target Revenue", value: `$${formatNumber(targetRevenue, 2)}` },
            { label: "Revenue Increase", value: `${formatNumber(((targetRevenue - currentRevenue) / currentRevenue) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["customer-acquisition-cost", "sales-funnel", "subscriber-value"],
  faq: [
    { question: "What is a good customer retention rate?", answer: "Retention rates vary by industry: SaaS averages 90-95%, e-commerce 30-40%, banking 75-85%. A 5% increase in retention can increase profits by 25-95% according to research by Bain & Company." },
    { question: "How is retention rate different from churn rate?", answer: "Retention rate and churn rate are complements: Retention Rate + Churn Rate = 100%. If 90% of customers stay (retention), then 10% leave (churn). Both measure customer loyalty from different perspectives." },
  ],
  formula: "Retention Rate = ((Customers at End - New Customers) / Customers at Start) x 100",
};
