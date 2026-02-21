import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecurityBenefitCalculator: CalculatorDefinition = {
  slug: "social-security-benefit-calculator",
  title: "Social Security Benefit Calculator",
  description: "Free Social Security benefit estimator. Estimate your retirement, survivor, and spousal Social Security benefits based on earnings and retirement age.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["social security calculator", "social security benefit estimator", "SSA calculator", "retirement benefit calculator", "social security retirement"],
  variants: [
    {
      id: "retirement-benefit",
      name: "Retirement Benefit Estimator",
      description: "Estimate your Social Security retirement benefit based on AIME and claiming age",
      fields: [
        { name: "aime", label: "Average Indexed Monthly Earnings (AIME)", type: "number", placeholder: "e.g. 6000", prefix: "$" },
        { name: "claimingAge", label: "Planned Claiming Age", type: "select", options: [
          { label: "62 (earliest - reduced)", value: "62" },
          { label: "63", value: "63" },
          { label: "64", value: "64" },
          { label: "65", value: "65" },
          { label: "66", value: "66" },
          { label: "67 (Full Retirement Age)", value: "67" },
          { label: "68", value: "68" },
          { label: "69", value: "69" },
          { label: "70 (maximum benefit)", value: "70" },
        ], defaultValue: "67" },
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1965", min: 1940, max: 2005 },
      ],
      calculate: (inputs) => {
        const aime = inputs.aime as number;
        const claimingAge = parseInt(inputs.claimingAge as string);
        const birthYear = (inputs.birthYear as number) || 1965;

        if (!aime) return null;

        // Calculate PIA using 2024 bend points
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

        // Full retirement age
        let fra = 67;
        if (birthYear <= 1954) fra = 66;
        else if (birthYear <= 1959) fra = 66 + (birthYear - 1954) * 2 / 12;

        // Adjustment for early or delayed claiming
        let monthlyBenefit: number;
        const monthsDiff = (claimingAge - fra) * 12;

        if (claimingAge < fra) {
          const monthsEarly = Math.abs(monthsDiff);
          const reductionFirst36 = Math.min(monthsEarly, 36) * (5 / 9 / 100);
          const reductionOver36 = Math.max(0, monthsEarly - 36) * (5 / 12 / 100);
          monthlyBenefit = pia * (1 - reductionFirst36 - reductionOver36);
        } else if (claimingAge > fra) {
          const monthsDelayed = monthsDiff;
          const delayedCredit = monthsDelayed * (2 / 3 / 100);
          monthlyBenefit = pia * (1 + delayedCredit);
        } else {
          monthlyBenefit = pia;
        }

        const annualBenefit = monthlyBenefit * 12;
        const reductionOrIncrease = ((monthlyBenefit - pia) / pia) * 100;
        const spousalBenefit = pia * 0.5;

        // Break-even analysis vs age 62
        const benefit62months = (claimingAge - fra) < 0 ? pia * 0.7 : pia * 0.7;
        const earlyMonthly = pia * (1 - Math.min(60, (fra - 62) * 12) * (5 / 9 / 100));

        return {
          primary: { label: "Estimated Monthly Benefit", value: `$${formatNumber(monthlyBenefit)}` },
          details: [
            { label: "Primary Insurance Amount (PIA)", value: `$${formatNumber(pia)}` },
            { label: "Full Retirement Age", value: `${fra >= 67 ? "67" : formatNumber(fra, 1)}` },
            { label: "Claiming age", value: `${claimingAge}` },
            { label: "Adjustment from PIA", value: `${reductionOrIncrease >= 0 ? "+" : ""}${formatNumber(reductionOrIncrease)}%` },
            { label: "Annual benefit", value: `$${formatNumber(annualBenefit)}` },
            { label: "Max spousal benefit (at FRA)", value: `$${formatNumber(spousalBenefit)}/month` },
          ],
          note: "This is an estimate based on current formulas. Your actual benefit depends on your complete earnings history. Check ssa.gov/myaccount for your personalized estimate. COLA adjustments are not included.",
        };
      },
    },
  ],
  relatedSlugs: ["disability-benefit-calculator", "medicare-premium-calculator", "retirement-calculator"],
  faq: [
    { question: "When should I claim Social Security?", answer: "It depends on your health, finances, and life expectancy. Claiming at 62 gives the smallest monthly benefit (about 30% less than FRA). Waiting until 70 gives the largest benefit (24% more than FRA). If you expect to live past ~80, delaying usually pays more in total lifetime benefits." },
    { question: "What is the maximum Social Security benefit?", answer: "The maximum benefit depends on your claiming age. In 2024, the maximum at age 62 is about $2,710/month, at FRA (67) about $3,822/month, and at age 70 about $4,873/month. To receive the maximum, you need 35 years of earnings at or above the taxable maximum." },
    { question: "Can I work while collecting Social Security?", answer: "Yes, but if you're under FRA, benefits are reduced by $1 for every $2 earned above $22,320 (2024). In the year you reach FRA, the reduction is $1 for every $3 above $59,520. After FRA, there's no earnings limit." },
  ],
  formula: "PIA = 90% × first $1,174 AIME + 32% × AIME $1,174-$7,078 + 15% × AIME over $7,078. Early reduction: 5/9% per month for first 36 months + 5/12% per month beyond. Delayed credit: 8% per year (2/3% per month) after FRA.",
};
