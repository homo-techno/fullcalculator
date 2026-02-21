import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const unemploymentBenefitCalculator: CalculatorDefinition = {
  slug: "unemployment-benefit-calculator",
  title: "Unemployment Benefit Calculator",
  description: "Free unemployment benefit calculator. Estimate your weekly unemployment insurance payments based on prior earnings. Benefits vary by state.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["unemployment calculator", "unemployment benefits calculator", "unemployment insurance", "unemployment check calculator", "jobless benefits"],
  variants: [
    {
      id: "unemployment",
      name: "Unemployment Benefit Estimator",
      description: "Estimate weekly unemployment benefits based on your prior quarterly earnings",
      fields: [
        { name: "quarterlyEarnings", label: "Highest Quarter Earnings", type: "number", placeholder: "e.g. 15000", prefix: "$" },
        { name: "method", label: "Calculation Method", type: "select", options: [
          { label: "High Quarter Method (most states)", value: "high-quarter" },
          { label: "Two Highest Quarters Average", value: "two-quarter" },
          { label: "Annual Wage Method", value: "annual" },
        ], defaultValue: "high-quarter" },
        { name: "secondQuarter", label: "Second Highest Quarter (if applicable)", type: "number", placeholder: "e.g. 13000", prefix: "$", defaultValue: 0 },
        { name: "annualWage", label: "Total Base Period Wages (if annual method)", type: "number", placeholder: "e.g. 52000", prefix: "$", defaultValue: 0 },
        { name: "dependents", label: "Number of Dependents", type: "select", options: [
          { label: "0", value: "0" },
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3+", value: "3" },
        ], defaultValue: "0" },
        { name: "maxBenefit", label: "State Maximum Weekly Benefit", type: "number", placeholder: "e.g. 600", prefix: "$", defaultValue: 600 },
      ],
      calculate: (inputs) => {
        const quarterlyEarnings = inputs.quarterlyEarnings as number;
        const method = inputs.method as string;
        const secondQuarter = (inputs.secondQuarter as number) || 0;
        const annualWage = (inputs.annualWage as number) || 0;
        const dependents = parseInt(inputs.dependents as string) || 0;
        const maxBenefit = (inputs.maxBenefit as number) || 600;

        if (!quarterlyEarnings) return null;

        let weeklyBenefit: number;

        if (method === "high-quarter") {
          weeklyBenefit = quarterlyEarnings / 26;
        } else if (method === "two-quarter") {
          weeklyBenefit = (quarterlyEarnings + secondQuarter) / 2 / 26;
        } else {
          weeklyBenefit = (annualWage || quarterlyEarnings * 4) * 0.0385;
        }

        const dependentAllowance = dependents * 25;
        weeklyBenefit = weeklyBenefit + dependentAllowance;
        weeklyBenefit = Math.min(weeklyBenefit, maxBenefit);
        weeklyBenefit = Math.max(0, weeklyBenefit);

        const maxWeeks = 26;
        const totalBenefits = weeklyBenefit * maxWeeks;
        const monthlyEstimate = weeklyBenefit * 4.33;

        return {
          primary: { label: "Estimated Weekly Benefit", value: `$${formatNumber(weeklyBenefit)}` },
          details: [
            { label: "Monthly estimate", value: `$${formatNumber(monthlyEstimate)}` },
            { label: "Maximum benefit weeks", value: `${maxWeeks} weeks` },
            { label: "Total potential benefits", value: `$${formatNumber(totalBenefits)}` },
            { label: "Dependent allowance", value: `$${formatNumber(dependentAllowance)}/week` },
            { label: "State maximum applied", value: weeklyBenefit >= maxBenefit ? "Yes (capped)" : "No" },
            { label: "Wage replacement rate", value: `~${formatNumber((weeklyBenefit / (quarterlyEarnings / 13)) * 100)}%` },
          ],
          note: "Unemployment benefits vary by state. Most states provide benefits for up to 26 weeks. Some states offer extended benefits during high unemployment. You must meet eligibility requirements including sufficient work history and being laid off through no fault of your own.",
        };
      },
    },
  ],
  relatedSlugs: ["disability-benefit-calculator", "workers-comp-calculator", "paycheck-calculator"],
  faq: [
    { question: "How are unemployment benefits calculated?", answer: "Most states use the 'high quarter' method: they look at your highest-earning quarter during the base period (typically the first 4 of the last 5 completed calendar quarters) and divide by 26 to get your weekly benefit. Some states average your two highest quarters or use a percentage of annual wages." },
    { question: "How long can I collect unemployment?", answer: "Standard unemployment benefits last up to 26 weeks in most states. Some states offer fewer weeks (e.g., Florida and North Carolina at 12-16 weeks). During recessions, federal extensions may provide additional weeks." },
    { question: "Are unemployment benefits taxable?", answer: "Yes. Unemployment compensation is fully taxable as income at the federal level. Most states also tax unemployment benefits. You can choose to have taxes withheld from your payments or pay estimated taxes quarterly." },
  ],
  formula: "High Quarter Method: Weekly Benefit = Highest Quarter Earnings / 26. Two-Quarter: Weekly Benefit = Average of Two Highest Quarters / 26. Subject to state minimum and maximum limits.",
};
