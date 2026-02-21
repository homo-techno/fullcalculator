import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disabilityBenefitCalculator: CalculatorDefinition = {
  slug: "disability-benefit-calculator",
  title: "Disability Benefit Calculator",
  description: "Free disability benefit calculator. Estimate Social Security Disability Insurance (SSDI) and short-term disability benefits based on your earnings history.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["disability calculator", "SSDI calculator", "disability benefit estimator", "social security disability", "short term disability calculator"],
  variants: [
    {
      id: "ssdi-estimate",
      name: "SSDI Benefit Estimator",
      description: "Estimate Social Security Disability Insurance benefits based on average earnings",
      fields: [
        { name: "avgMonthlyEarnings", label: "Average Indexed Monthly Earnings (AIME)", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "age", label: "Current Age", type: "number", placeholder: "e.g. 45", min: 18, max: 66 },
        { name: "dependents", label: "Eligible Dependents", type: "select", options: [
          { label: "None", value: "0" },
          { label: "Spouse", value: "spouse" },
          { label: "Spouse + 1 Child", value: "spouse-1" },
          { label: "Spouse + 2+ Children", value: "spouse-2" },
          { label: "Children Only (1)", value: "child-1" },
          { label: "Children Only (2+)", value: "child-2" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const aime = inputs.avgMonthlyEarnings as number;
        const age = inputs.age as number;
        const dependents = inputs.dependents as string;

        if (!aime) return null;

        // 2024 SSDI PIA bend points
        const bendPoint1 = 1174;
        const bendPoint2 = 7078;

        let pia = 0;
        if (aime <= bendPoint1) {
          pia = aime * 0.9;
        } else if (aime <= bendPoint2) {
          pia = bendPoint1 * 0.9 + (aime - bendPoint1) * 0.32;
        } else {
          pia = bendPoint1 * 0.9 + (bendPoint2 - bendPoint1) * 0.32 + (aime - bendPoint2) * 0.15;
        }

        pia = Math.round(pia * 10) / 10;

        const maxFamilyBenefit = pia * 1.5;
        let familyBenefit = 0;

        if (dependents === "spouse") familyBenefit = pia * 0.5;
        else if (dependents === "spouse-1") familyBenefit = pia * 0.5 + pia * 0.5;
        else if (dependents === "spouse-2") familyBenefit = maxFamilyBenefit - pia;
        else if (dependents === "child-1") familyBenefit = pia * 0.5;
        else if (dependents === "child-2") familyBenefit = maxFamilyBenefit - pia;

        familyBenefit = Math.min(familyBenefit, maxFamilyBenefit - pia);
        const totalMonthly = pia + familyBenefit;
        const annualBenefit = totalMonthly * 12;

        return {
          primary: { label: "Estimated Monthly SSDI Benefit", value: `$${formatNumber(pia)}` },
          details: [
            { label: "Your monthly benefit (PIA)", value: `$${formatNumber(pia)}` },
            { label: "Dependent benefits", value: `$${formatNumber(familyBenefit)}/month` },
            { label: "Total family monthly benefit", value: `$${formatNumber(totalMonthly)}` },
            { label: "Annual benefit", value: `$${formatNumber(annualBenefit)}` },
            { label: "Maximum family benefit", value: `$${formatNumber(maxFamilyBenefit)}/month` },
            { label: "AIME used", value: `$${formatNumber(aime)}` },
          ],
          note: "SSDI benefits are based on your Primary Insurance Amount (PIA), calculated from your Average Indexed Monthly Earnings (AIME). Find your AIME on your Social Security statement at ssa.gov. A 5-month waiting period applies before benefits begin.",
        };
      },
    },
    {
      id: "short-term-disability",
      name: "Short-Term Disability Estimator",
      description: "Estimate short-term disability insurance benefits",
      fields: [
        { name: "weeklyWage", label: "Gross Weekly Wage", type: "number", placeholder: "e.g. 1200", prefix: "$" },
        { name: "coveragePercent", label: "Coverage Percentage", type: "select", options: [
          { label: "50%", value: "50" },
          { label: "60% (most common)", value: "60" },
          { label: "66.67%", value: "66.67" },
          { label: "70%", value: "70" },
        ], defaultValue: "60" },
        { name: "eliminationPeriod", label: "Elimination Period", type: "select", options: [
          { label: "7 days", value: "7" },
          { label: "14 days", value: "14" },
          { label: "30 days", value: "30" },
        ], defaultValue: "7" },
        { name: "benefitDuration", label: "Benefit Duration (weeks)", type: "number", placeholder: "e.g. 12", min: 1, defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const weeklyWage = inputs.weeklyWage as number;
        const coveragePercent = parseFloat(inputs.coveragePercent as string) / 100;
        const eliminationPeriod = parseInt(inputs.eliminationPeriod as string);
        const benefitDuration = (inputs.benefitDuration as number) || 12;

        if (!weeklyWage) return null;

        const weeklyBenefit = weeklyWage * coveragePercent;
        const totalBenefits = weeklyBenefit * benefitDuration;
        const wageLoss = (weeklyWage * (benefitDuration + eliminationPeriod / 7)) - totalBenefits;

        return {
          primary: { label: "Weekly Disability Benefit", value: `$${formatNumber(weeklyBenefit)}` },
          details: [
            { label: "Coverage rate", value: `${formatNumber(coveragePercent * 100)}%` },
            { label: "Elimination period", value: `${eliminationPeriod} days (unpaid)` },
            { label: "Benefit duration", value: `${benefitDuration} weeks` },
            { label: "Total benefits over period", value: `$${formatNumber(totalBenefits)}` },
            { label: "Estimated wage gap", value: `$${formatNumber(wageLoss)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["social-security-benefit-calculator", "workers-comp-calculator", "unemployment-benefit-calculator"],
  faq: [
    { question: "How much does SSDI pay?", answer: "The average SSDI benefit is approximately $1,500/month, with a maximum of about $3,800/month in 2024. Your benefit is based on your lifetime average earnings covered by Social Security. Use your Social Security statement to find your AIME for a more accurate estimate." },
    { question: "What is the SSDI waiting period?", answer: "There is a mandatory 5-month waiting period for SSDI benefits. Benefits begin in the 6th full month after disability onset. If you're approved, you may also be eligible for back pay from your application date." },
    { question: "What is the difference between SSDI and SSI?", answer: "SSDI (Social Security Disability Insurance) is based on your work history and earnings. SSI (Supplemental Security Income) is needs-based for disabled individuals with limited income/resources regardless of work history. You may qualify for both." },
  ],
  formula: "SSDI PIA = 90% × first $1,174 of AIME + 32% × AIME between $1,174 and $7,078 + 15% × AIME over $7,078. Short-Term Disability = Weekly Wage × Coverage Percentage.",
};
