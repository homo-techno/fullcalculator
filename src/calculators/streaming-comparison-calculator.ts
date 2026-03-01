import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const streamingComparisonCalculator: CalculatorDefinition = {
  slug: "streaming-comparison-calculator",
  title: "Streaming Comparison Calculator",
  description: "Compare the annual cost of streaming services and calculate total entertainment spending across platforms.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["streaming cost comparison", "streaming service calculator", "entertainment subscription cost"],
  variants: [{
    id: "standard",
    name: "Streaming Comparison",
    description: "Compare the annual cost of streaming services and calculate total entertainment spending across platforms",
    fields: [
      { name: "service1", label: "Primary Service Monthly Cost", type: "number", prefix: "$", min: 0, max: 50, step: 0.99, defaultValue: 15.49 },
      { name: "service2", label: "Second Service Monthly Cost", type: "number", prefix: "$", min: 0, max: 50, step: 0.99, defaultValue: 13.99 },
      { name: "service3", label: "Third Service Monthly Cost", type: "number", prefix: "$", min: 0, max: 50, step: 0.99, defaultValue: 9.99 },
      { name: "householdMembers", label: "Household Members Using Services", type: "number", min: 1, max: 10, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const s1 = inputs.service1 as number;
      const s2 = inputs.service2 as number;
      const s3 = inputs.service3 as number;
      const members = inputs.householdMembers as number;
      const totalMonthly = (s1 || 0) + (s2 || 0) + (s3 || 0);
      if (totalMonthly <= 0) return null;
      const totalAnnual = totalMonthly * 12;
      const perPerson = members > 0 ? totalMonthly / members : totalMonthly;
      const perPersonAnnual = perPerson * 12;
      const serviceCount = (s1 > 0 ? 1 : 0) + (s2 > 0 ? 1 : 0) + (s3 > 0 ? 1 : 0);
      return {
        primary: { label: "Total Annual Cost", value: "$" + formatNumber(Math.round(totalAnnual * 100) / 100) },
        details: [
          { label: "Total Monthly Cost", value: "$" + formatNumber(Math.round(totalMonthly * 100) / 100) },
          { label: "Cost Per Person Per Month", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
          { label: "Active Services", value: formatNumber(serviceCount) },
        ],
      };
    },
  }],
  relatedSlugs: ["meal-kit-comparison-calculator", "hourly-rate-calculator"],
  faq: [
    { question: "How much does the average household spend on streaming?", answer: "The average American household spends approximately $50 to $75 per month on streaming services, subscribing to 3 to 5 services. This totals $600 to $900 per year on streaming entertainment alone." },
    { question: "How can I reduce streaming costs?", answer: "Consider rotating subscriptions monthly instead of maintaining all at once, sharing eligible family plans, choosing ad-supported tiers, and canceling services you use less than once per week." },
  ],
  formula: "Total Annual Cost = (Service 1 + Service 2 + Service 3) x 12; Per Person = Total / Household Members",
};
