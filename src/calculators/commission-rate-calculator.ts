import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commissionRateCalculator: CalculatorDefinition = {
  slug: "commission-rate-calculator",
  title: "Commission Rate Calculator",
  description: "Calculate sales commission earnings based on revenue, commission rate, and tiered bonus thresholds.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["commission calculator", "sales commission", "commission rate calculator"],
  variants: [{
    id: "standard",
    name: "Commission Rate",
    description: "Calculate sales commission earnings based on revenue, commission rate, and tiered bonus thresholds",
    fields: [
      { name: "salesRevenue", label: "Total Sales Revenue", type: "number", prefix: "$", min: 0, max: 10000000, step: 1000, defaultValue: 250000 },
      { name: "commissionRate", label: "Base Commission Rate", type: "number", suffix: "%", min: 0.5, max: 50, step: 0.5, defaultValue: 5 },
      { name: "quota", label: "Sales Quota", type: "number", prefix: "$", min: 0, max: 10000000, step: 1000, defaultValue: 200000 },
      { name: "acceleratorRate", label: "Above-Quota Accelerator Rate", type: "number", suffix: "%", min: 0, max: 50, step: 0.5, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const revenue = inputs.salesRevenue as number;
      const rate = inputs.commissionRate as number;
      const quota = inputs.quota as number;
      const accel = inputs.acceleratorRate as number;
      if (!revenue || revenue <= 0 || !rate) return null;
      const quotaAmount = quota || 0;
      const belowQuota = Math.min(revenue, quotaAmount);
      const aboveQuota = Math.max(0, revenue - quotaAmount);
      const baseCommission = belowQuota * (rate / 100);
      const accelCommission = aboveQuota * ((accel || rate) / 100);
      const totalCommission = baseCommission + accelCommission;
      const quotaAttainment = quotaAmount > 0 ? (revenue / quotaAmount) * 100 : 0;
      const effectiveRate = (totalCommission / revenue) * 100;
      return {
        primary: { label: "Total Commission", value: "$" + formatNumber(Math.round(totalCommission)) },
        details: [
          { label: "Base Commission", value: "$" + formatNumber(Math.round(baseCommission)) },
          { label: "Accelerator Commission", value: "$" + formatNumber(Math.round(accelCommission)) },
          { label: "Quota Attainment", value: formatNumber(Math.round(quotaAttainment)) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["hourly-rate-calculator", "cost-per-hire-calculator"],
  faq: [
    { question: "What is a typical sales commission rate?", answer: "Commission rates vary widely by industry. Software sales typically offer 5 to 10 percent, real estate 2.5 to 3 percent per side, retail 1 to 5 percent, and insurance 5 to 20 percent of the premium." },
    { question: "What is an accelerator in sales compensation?", answer: "An accelerator is a higher commission rate applied to sales that exceed the quota. For example, a salesperson might earn 5 percent on sales up to quota and 8 percent on all sales above quota, rewarding over-performance." },
  ],
  formula: "Commission = (Sales up to Quota x Base Rate) + (Sales above Quota x Accelerator Rate)",
};
