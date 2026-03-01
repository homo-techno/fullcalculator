import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saasMrrCalculator: CalculatorDefinition = {
  slug: "saas-mrr-calculator",
  title: "SaaS MRR Calculator",
  description: "Calculate monthly recurring revenue for a SaaS business including new, expansion, and churned revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["SaaS MRR", "monthly recurring revenue", "SaaS revenue calculator"],
  variants: [{
    id: "standard",
    name: "SaaS MRR",
    description: "Calculate monthly recurring revenue for a SaaS business including new, expansion, and churned revenue",
    fields: [
      { name: "customers", label: "Total Customers", type: "number", suffix: "customers", min: 1, max: 100000, defaultValue: 500 },
      { name: "arpu", label: "Average Revenue per User (Monthly)", type: "number", suffix: "$", min: 5, max: 10000, defaultValue: 50 },
      { name: "newMRR", label: "New MRR This Month", type: "number", suffix: "$", min: 0, max: 500000, defaultValue: 3000 },
      { name: "churnedMRR", label: "Churned MRR This Month", type: "number", suffix: "$", min: 0, max: 500000, defaultValue: 1000 },
    ],
    calculate: (inputs) => {
      const customers = inputs.customers as number;
      const arpu = inputs.arpu as number;
      const newMRR = inputs.newMRR as number;
      const churnedMRR = inputs.churnedMRR as number;
      if (!customers || !arpu) return null;
      const baseMRR = customers * arpu;
      const netNewMRR = newMRR - churnedMRR;
      const totalMRR = baseMRR + netNewMRR;
      const arr = totalMRR * 12;
      const revenueChurnRate = baseMRR > 0 ? (churnedMRR / baseMRR) * 100 : 0;
      return {
        primary: { label: "Total MRR", value: "$" + formatNumber(totalMRR) },
        details: [
          { label: "Base MRR", value: "$" + formatNumber(baseMRR) },
          { label: "New MRR", value: "$" + formatNumber(newMRR) },
          { label: "Churned MRR", value: "$" + formatNumber(churnedMRR) },
          { label: "Net New MRR", value: "$" + formatNumber(netNewMRR) },
          { label: "ARR (Annualized)", value: "$" + formatNumber(arr) },
          { label: "Revenue Churn Rate", value: formatNumber(revenueChurnRate) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["churn-rate-calculator", "burn-rate-calculator"],
  faq: [
    { question: "What is MRR?", answer: "Monthly Recurring Revenue (MRR) is the predictable monthly income from subscriptions. It equals the number of paying customers multiplied by the average revenue per user." },
    { question: "What is a good MRR growth rate?", answer: "A healthy SaaS company grows MRR by 10 to 20 percent month over month in early stages. Mature SaaS companies typically grow 5 to 10 percent monthly." },
  ],
  formula: "MRR = Customers x ARPU + New MRR - Churned MRR; ARR = MRR x 12",
};
