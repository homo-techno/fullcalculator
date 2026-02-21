import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workersCompCalculator: CalculatorDefinition = {
  slug: "workers-comp-calculator",
  title: "Workers Compensation Calculator",
  description: "Free workers' compensation calculator. Estimate weekly benefit amounts based on your average weekly wage and state guidelines. Actual benefits vary by state.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["workers comp calculator", "workers compensation calculator", "work injury benefits", "workers comp benefits", "workplace injury compensation"],
  variants: [
    {
      id: "workers-comp-benefit",
      name: "Workers' Comp Benefit Estimator",
      description: "Estimate temporary total disability (TTD) benefits",
      fields: [
        { name: "weeklyWage", label: "Average Weekly Wage (Pre-Injury)", type: "number", placeholder: "e.g. 1000", prefix: "$" },
        { name: "benefitRate", label: "Benefit Rate", type: "select", options: [
          { label: "66.67% (Most states)", value: "66.67" },
          { label: "70%", value: "70" },
          { label: "75%", value: "75" },
          { label: "80%", value: "80" },
        ], defaultValue: "66.67" },
        { name: "maxWeeklyBenefit", label: "State Maximum Weekly Benefit", type: "number", placeholder: "e.g. 1200", prefix: "$", defaultValue: 1200 },
        { name: "weeksOff", label: "Expected Weeks Off Work", type: "number", placeholder: "e.g. 12", min: 1 },
        { name: "waitingPeriod", label: "Waiting Period (days)", type: "select", options: [
          { label: "3 days (most states)", value: "3" },
          { label: "5 days", value: "5" },
          { label: "7 days", value: "7" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const weeklyWage = inputs.weeklyWage as number;
        const benefitRate = parseFloat(inputs.benefitRate as string) / 100;
        const maxWeeklyBenefit = (inputs.maxWeeklyBenefit as number) || 1200;
        const weeksOff = inputs.weeksOff as number;
        const waitingPeriod = parseInt(inputs.waitingPeriod as string) || 3;

        if (!weeklyWage || !weeksOff) return null;

        const calculatedBenefit = weeklyWage * benefitRate;
        const weeklyBenefit = Math.min(calculatedBenefit, maxWeeklyBenefit);
        const waitingPeriodWeeks = waitingPeriod / 7;
        const paidWeeks = Math.max(0, weeksOff - waitingPeriodWeeks);
        const totalBenefits = weeklyBenefit * paidWeeks;
        const wageLoss = (weeklyWage * weeksOff) - totalBenefits;

        return {
          primary: { label: "Weekly Benefit Amount", value: `$${formatNumber(weeklyBenefit)}` },
          details: [
            { label: "Pre-injury weekly wage", value: `$${formatNumber(weeklyWage)}` },
            { label: "Benefit rate", value: `${formatNumber(benefitRate * 100)}%` },
            { label: "Calculated benefit", value: `$${formatNumber(calculatedBenefit)}` },
            { label: "State maximum applied", value: calculatedBenefit > maxWeeklyBenefit ? "Yes" : "No" },
            { label: "Waiting period", value: `${waitingPeriod} days` },
            { label: "Compensable weeks", value: formatNumber(paidWeeks, 1) },
            { label: "Total estimated benefits", value: `$${formatNumber(totalBenefits)}` },
            { label: "Estimated wage loss (gap)", value: `$${formatNumber(wageLoss)}` },
          ],
          note: "Workers' compensation benefits vary significantly by state. Most states pay 66.67% of average weekly wage for temporary total disability (TTD), subject to state minimums and maximums. Consult your state's workers' comp board for exact rates.",
        };
      },
    },
  ],
  relatedSlugs: ["disability-benefit-calculator", "unemployment-benefit-calculator", "paycheck-calculator"],
  faq: [
    { question: "How much does workers' comp pay?", answer: "Most states pay approximately two-thirds (66.67%) of your average weekly wage for temporary total disability benefits, subject to state minimum and maximum limits. For example, if you earned $900/week, you'd receive about $600/week in benefits." },
    { question: "Is there a waiting period for workers' comp?", answer: "Yes. Most states have a 3-7 day waiting period before benefits begin. If your disability extends beyond a certain period (typically 14-21 days), you may receive retroactive pay for the waiting period." },
    { question: "Are workers' comp benefits taxable?", answer: "Generally, workers' compensation benefits are not taxable at the federal or state level. However, if you also receive Social Security disability benefits, a portion may become taxable due to offset rules." },
  ],
  formula: "Weekly Benefit = Min(Average Weekly Wage × Benefit Rate, State Maximum). Total Benefits = Weekly Benefit × (Weeks Off - Waiting Period in Weeks).",
};
