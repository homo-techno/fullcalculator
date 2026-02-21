import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const churnRateCalculator: CalculatorDefinition = {
  slug: "churn-rate-calculator",
  title: "Churn Rate Calculator",
  description: "Free churn rate calculator. Calculate customer churn rate, revenue churn, and net revenue retention for subscription businesses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["churn rate calculator", "customer churn", "revenue churn", "retention rate calculator", "attrition rate calculator"],
  variants: [
    {
      id: "customer",
      name: "Customer Churn Rate",
      description: "Calculate the percentage of customers lost in a period",
      fields: [
        { name: "customersStart", label: "Customers at Start of Period", type: "number", placeholder: "e.g. 1000" },
        { name: "customersLost", label: "Customers Lost During Period", type: "number", placeholder: "e.g. 50" },
        { name: "period", label: "Period", type: "select", options: [
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "Annually", value: "annually" },
        ], defaultValue: "monthly" },
      ],
      calculate: (inputs) => {
        const start = inputs.customersStart as number;
        const lost = inputs.customersLost as number;
        const period = inputs.period as string;
        if (!start || lost === undefined) return null;
        const churnRate = (lost / start) * 100;
        const retentionRate = 100 - churnRate;
        let annualChurn: number;
        if (period === "monthly") annualChurn = (1 - Math.pow(1 - churnRate / 100, 12)) * 100;
        else if (period === "quarterly") annualChurn = (1 - Math.pow(1 - churnRate / 100, 4)) * 100;
        else annualChurn = churnRate;
        const avgLifespan = churnRate > 0 ? 1 / (churnRate / 100) : 0;
        const lifespanLabel = period === "monthly" ? "months" : period === "quarterly" ? "quarters" : "years";
        return {
          primary: { label: `${period.charAt(0).toUpperCase() + period.slice(1)} Churn Rate`, value: formatNumber(churnRate), suffix: "%" },
          details: [
            { label: "Retention Rate", value: `${formatNumber(retentionRate)}%` },
            { label: "Annualized Churn Rate", value: `${formatNumber(annualChurn)}%` },
            { label: "Customers Lost", value: formatNumber(lost, 0) },
            { label: "Remaining Customers", value: formatNumber(start - lost, 0) },
            { label: "Avg Customer Lifespan", value: `${formatNumber(avgLifespan, 1)} ${lifespanLabel}` },
          ],
        };
      },
    },
    {
      id: "revenue",
      name: "Revenue Churn",
      description: "Calculate gross and net revenue churn (MRR churn)",
      fields: [
        { name: "mrrStart", label: "MRR at Start of Period", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "mrrLost", label: "MRR Lost (cancellations + downgrades)", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "mrrExpansion", label: "Expansion MRR (upsells + upgrades)", type: "number", placeholder: "e.g. 8000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const start = inputs.mrrStart as number;
        const lost = inputs.mrrLost as number;
        const expansion = (inputs.mrrExpansion as number) || 0;
        if (!start || lost === undefined) return null;
        const grossChurn = (lost / start) * 100;
        const netChurn = ((lost - expansion) / start) * 100;
        const netRetention = ((start - lost + expansion) / start) * 100;
        const annualGrossChurn = (1 - Math.pow(1 - grossChurn / 100, 12)) * 100;
        return {
          primary: { label: "Net Revenue Churn", value: formatNumber(netChurn), suffix: "%" },
          details: [
            { label: "Gross Revenue Churn", value: `${formatNumber(grossChurn)}%` },
            { label: "Net Revenue Retention (NRR)", value: `${formatNumber(netRetention)}%` },
            { label: "Annualized Gross Churn", value: `${formatNumber(annualGrossChurn)}%` },
            { label: "MRR Lost", value: `$${formatNumber(lost)}` },
            { label: "Expansion MRR", value: `$${formatNumber(expansion)}` },
            { label: "Net MRR Change", value: `$${formatNumber(expansion - lost)}` },
          ],
          note: netChurn < 0 ? "Negative net churn means expansion revenue exceeds lost revenue - this is excellent!" : undefined,
        };
      },
    },
    {
      id: "impact",
      name: "Churn Impact Analysis",
      description: "See how churn affects your revenue over time",
      fields: [
        { name: "currentCustomers", label: "Current Customers", type: "number", placeholder: "e.g. 500" },
        { name: "avgMRR", label: "Avg MRR per Customer", type: "number", placeholder: "e.g. 100", prefix: "$" },
        { name: "monthlyChurn", label: "Monthly Churn Rate %", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "monthlyNewCustomers", label: "New Customers per Month", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const customers = inputs.currentCustomers as number;
        const avgMRR = inputs.avgMRR as number;
        const churn = inputs.monthlyChurn as number;
        const newPerMonth = (inputs.monthlyNewCustomers as number) || 0;
        if (!customers || !avgMRR || !churn) return null;
        const retentionRate = 1 - churn / 100;
        let cust6 = customers;
        let cust12 = customers;
        for (let i = 0; i < 6; i++) cust6 = cust6 * retentionRate + newPerMonth;
        for (let i = 0; i < 12; i++) cust12 = cust12 * retentionRate + newPerMonth;
        const currentMRR = customers * avgMRR;
        const mrr6 = cust6 * avgMRR;
        const mrr12 = cust12 * avgMRR;
        const lostRevenue12 = (currentMRR * 12) - (mrr12 * 12 / 2 + currentMRR * 12 / 2);
        return {
          primary: { label: "Projected 12-Month MRR", value: `$${formatNumber(mrr12)}` },
          details: [
            { label: "Current MRR", value: `$${formatNumber(currentMRR)}` },
            { label: "6-Month MRR", value: `$${formatNumber(mrr6)}` },
            { label: "12-Month MRR", value: `$${formatNumber(mrr12)}` },
            { label: "Current Customers", value: formatNumber(customers, 0) },
            { label: "6-Month Customers", value: formatNumber(Math.round(cust6), 0) },
            { label: "12-Month Customers", value: formatNumber(Math.round(cust12), 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["customer-lifetime-value-calculator", "cac-calculator", "roi-marketing-calculator"],
  faq: [
    { question: "What is a good churn rate?", answer: "For SaaS businesses: monthly churn of 3-5% is average, below 2% is good, below 1% is excellent. Annual churn below 10% is considered best-in-class. B2B companies typically have lower churn (3-7% annual) than B2C (5-15% annual). Enterprise SaaS targets below 5% annual." },
    { question: "What is the difference between gross and net churn?", answer: "Gross churn only counts lost revenue (cancellations + downgrades). Net churn subtracts expansion revenue (upsells + upgrades) from lost revenue. Net churn can be negative (called 'negative churn'), which is ideal because it means existing customers are growing in value." },
    { question: "What is Net Revenue Retention (NRR)?", answer: "NRR measures total revenue retained from existing customers including expansions. NRR = (Start MRR - Lost + Expansion) / Start MRR. 100%+ means the cohort is growing. Top SaaS companies have NRR of 110-140%. NRR above 100% indicates negative net churn." },
  ],
  formula: "Customer Churn = Customers Lost / Customers at Start × 100 | Revenue Churn = MRR Lost / MRR at Start × 100 | NRR = (Start MRR - Lost + Expansion) / Start MRR × 100",
};
