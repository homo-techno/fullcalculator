import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecurityCalculator: CalculatorDefinition = {
  slug: "social-security-calculator",
  title: "Social Security Calculator",
  description:
    "Free Social Security benefits estimator. Estimate your monthly Social Security benefit at ages 62, 67, and 70. Compare early, full, and delayed retirement benefits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "social security calculator",
    "social security benefits calculator",
    "social security retirement calculator",
    "ssa benefit estimator",
    "social security at 62",
  ],
  variants: [
    {
      id: "benefit",
      name: "Estimate Social Security Benefit",
      description: "Estimate monthly benefit based on earnings and retirement age",
      fields: [
        {
          name: "currentAge",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 55",
          min: 22,
          max: 70,
          step: 1,
        },
        {
          name: "retirementAge",
          label: "Planned Retirement Age",
          type: "select",
          options: [
            { label: "62 (earliest)", value: "62" },
            { label: "63", value: "63" },
            { label: "64", value: "64" },
            { label: "65", value: "65" },
            { label: "66", value: "66" },
            { label: "67 (full retirement)", value: "67" },
            { label: "68", value: "68" },
            { label: "69", value: "69" },
            { label: "70 (maximum benefit)", value: "70" },
          ],
          defaultValue: "67",
        },
        {
          name: "avgMonthlyEarnings",
          label: "Average Monthly Earnings (AIME)",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const retireAge = parseInt(inputs.retirementAge as string) || 67;
        const aime = inputs.avgMonthlyEarnings as number;
        if (!currentAge || !aime) return null;

        // Simplified PIA calculation (2024 bend points)
        // PIA = 90% of first $1,174 + 32% of $1,174-$7,078 + 15% above $7,078
        const bendPoint1 = 1174;
        const bendPoint2 = 7078;

        let pia = 0;
        if (aime <= bendPoint1) {
          pia = aime * 0.90;
        } else if (aime <= bendPoint2) {
          pia = bendPoint1 * 0.90 + (aime - bendPoint1) * 0.32;
        } else {
          pia = bendPoint1 * 0.90 + (bendPoint2 - bendPoint1) * 0.32 + (aime - bendPoint2) * 0.15;
        }

        // Full retirement age = 67 for those born 1960+
        const fra = 67;

        // Adjustment for early or delayed retirement
        const calculateBenefit = (claimAge: number) => {
          if (claimAge < fra) {
            // Reduction: 6.67% per year for first 3 years, 5% per year after that
            const monthsEarly = (fra - claimAge) * 12;
            const first36 = Math.min(monthsEarly, 36);
            const remaining = Math.max(monthsEarly - 36, 0);
            const reductionPct = (first36 * 5 / 9 + remaining * 5 / 12) / 100;
            return pia * (1 - reductionPct);
          } else if (claimAge > fra) {
            // Delayed retirement credits: 8% per year
            const yearsDelayed = claimAge - fra;
            return pia * (1 + yearsDelayed * 0.08);
          }
          return pia;
        };

        const benefitAtAge = calculateBenefit(retireAge);
        const benefit62 = calculateBenefit(62);
        const benefit67 = calculateBenefit(67);
        const benefit70 = calculateBenefit(70);

        // Lifetime benefits comparison (assuming life expectancy of 85)
        const lifeExpectancy = 85;
        const lifetimeAtChosen = benefitAtAge * 12 * Math.max(0, lifeExpectancy - retireAge);
        const lifetimeAt62 = benefit62 * 12 * (lifeExpectancy - 62);
        const lifetimeAt67 = benefit67 * 12 * (lifeExpectancy - 67);
        const lifetimeAt70 = benefit70 * 12 * (lifeExpectancy - 70);

        return {
          primary: {
            label: `Monthly Benefit at Age ${retireAge}`,
            value: `$${formatNumber(benefitAtAge)}`,
          },
          details: [
            { label: "Estimated PIA (at FRA 67)", value: `$${formatNumber(pia)}` },
            { label: "Benefit at age 62", value: `$${formatNumber(benefit62)}/mo` },
            { label: "Benefit at age 67 (FRA)", value: `$${formatNumber(benefit67)}/mo` },
            { label: "Benefit at age 70", value: `$${formatNumber(benefit70)}/mo` },
            { label: "Annual benefit at chosen age", value: `$${formatNumber(benefitAtAge * 12)}` },
            { label: "Lifetime at 62 (to age 85)", value: `$${formatNumber(lifetimeAt62)}` },
            { label: "Lifetime at 67 (to age 85)", value: `$${formatNumber(lifetimeAt67)}` },
            { label: "Lifetime at 70 (to age 85)", value: `$${formatNumber(lifetimeAt70)}` },
          ],
          note: "This is a simplified estimate. Actual benefits depend on your 35 highest-earning years. Visit ssa.gov for an official estimate. PIA bend points are for 2024.",
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "pension-calculator", "rmd-calculator"],
  faq: [
    {
      question: "How is Social Security calculated?",
      answer:
        "Social Security benefits are based on your Average Indexed Monthly Earnings (AIME) from your 35 highest-earning years. The Primary Insurance Amount (PIA) formula applies 90% to the first $1,174, 32% from $1,174 to $7,078, and 15% above $7,078 (2024 bend points).",
    },
    {
      question: "Should I take Social Security at 62 or wait until 70?",
      answer:
        "Taking benefits at 62 gives you about 30% less than your full benefit at 67. Waiting until 70 gives you 24% more than age 67. If you live past about 80-82, waiting typically results in more total lifetime benefits. Health, finances, and other income sources should inform your decision.",
    },
    {
      question: "What is the maximum Social Security benefit?",
      answer:
        "The maximum Social Security benefit at full retirement age (67) in 2024 is $3,822/month. At age 70, the maximum is $4,873/month. To qualify for the maximum, you need 35 years of earnings at or above the Social Security wage base ($168,600 in 2024).",
    },
  ],
  formula:
    "PIA = 90% × first $1,174 + 32% × ($1,174-$7,078) + 15% × above $7,078. Early reduction: ~6.67%/yr first 3 years, 5%/yr after. Delayed credits: 8%/yr after FRA.",
};
