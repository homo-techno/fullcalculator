import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecurityBreakEvenCalculator: CalculatorDefinition = {
  slug: "social-security-break-even-calculator",
  title: "Social Security Break-Even Calculator",
  description:
    "Free Social Security break-even age calculator. Compare claiming at 62, 67, or 70 to find the optimal age to start collecting benefits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "social security break even",
    "when to claim social security",
    "social security calculator",
    "ss break even age",
    "optimal claiming age",
  ],
  variants: [
    {
      id: "compare",
      name: "Break-Even Age Comparison",
      description:
        "Compare total lifetime benefits when claiming at different ages",
      fields: [
        {
          name: "benefitAt67",
          label: "Monthly Benefit at Full Retirement Age (67)",
          type: "number",
          placeholder: "e.g. 2500",
          prefix: "$",
        },
        {
          name: "claimAge1",
          label: "Early Claiming Age",
          type: "select",
          options: [
            { label: "62", value: "62" },
            { label: "63", value: "63" },
            { label: "64", value: "64" },
            { label: "65", value: "65" },
            { label: "66", value: "66" },
          ],
          defaultValue: "62",
        },
        {
          name: "claimAge2",
          label: "Later Claiming Age",
          type: "select",
          options: [
            { label: "67", value: "67" },
            { label: "68", value: "68" },
            { label: "69", value: "69" },
            { label: "70", value: "70" },
          ],
          defaultValue: "70",
        },
      ],
      calculate: (inputs) => {
        const benefitAt67 = parseFloat(inputs.benefitAt67 as string);
        const earlyAge = parseInt(inputs.claimAge1 as string, 10);
        const laterAge = parseInt(inputs.claimAge2 as string, 10);

        if (!benefitAt67 || benefitAt67 <= 0) return null;
        if (earlyAge >= laterAge) return null;

        const getMonthlyBenefit = (claimAge: number): number => {
          const monthsDiff = (claimAge - 67) * 12;
          if (monthsDiff < 0) {
            const monthsEarly = Math.abs(monthsDiff);
            const first36 = Math.min(monthsEarly, 36);
            const beyond36 = Math.max(0, monthsEarly - 36);
            const reduction = first36 * (5 / 900) + beyond36 * (5 / 1200);
            return benefitAt67 * (1 - reduction);
          } else {
            const monthsLate = monthsDiff;
            const increase = monthsLate * (2 / 3 / 100);
            return benefitAt67 * (1 + increase);
          }
        };

        const earlyBenefit = getMonthlyBenefit(earlyAge);
        const laterBenefit = getMonthlyBenefit(laterAge);

        let breakEvenAge = 0;
        let earlyCumulative = 0;
        let laterCumulative = 0;

        for (let age = earlyAge; age <= 100; age++) {
          for (let month = 0; month < 12; month++) {
            if (age >= earlyAge) earlyCumulative += earlyBenefit;
            if (age >= laterAge) laterCumulative += laterBenefit;

            if (laterCumulative > 0 && laterCumulative >= earlyCumulative && breakEvenAge === 0) {
              breakEvenAge = age + month / 12;
            }
          }
        }

        const earlyAnnual = earlyBenefit * 12;
        const laterAnnual = laterBenefit * 12;

        return {
          primary: {
            label: "Break-Even Age",
            value: breakEvenAge > 0 ? `${formatNumber(breakEvenAge)} years` : "Beyond 100",
          },
          details: [
            { label: `Monthly benefit at age ${earlyAge}`, value: `$${formatNumber(earlyBenefit)}` },
            { label: `Monthly benefit at age ${laterAge}`, value: `$${formatNumber(laterBenefit)}` },
            { label: `Annual benefit at age ${earlyAge}`, value: `$${formatNumber(earlyAnnual)}` },
            { label: `Annual benefit at age ${laterAge}`, value: `$${formatNumber(laterAnnual)}` },
            { label: "Monthly benefit difference", value: `$${formatNumber(laterBenefit - earlyBenefit)}` },
          ],
          note: `If you live beyond age ${formatNumber(breakEvenAge)}, claiming at ${laterAge} yields more total lifetime benefits than claiming at ${earlyAge}. Average life expectancy is ~84 for men and ~87 for women.`,
        };
      },
    },
    {
      id: "all-ages",
      name: "62 vs 67 vs 70 Summary",
      description:
        "Quick comparison of benefits at the three most common claiming ages",
      fields: [
        {
          name: "benefitAt67",
          label: "Monthly Benefit at Full Retirement Age (67)",
          type: "number",
          placeholder: "e.g. 2500",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const fra = parseFloat(inputs.benefitAt67 as string);
        if (!fra || fra <= 0) return null;

        const at62 = fra * (1 - 60 * (5 / 900));
        const at70 = fra * (1 + 36 * (2 / 3 / 100));

        const breakEven62vs67 = (() => {
          let e = 0; let l = 0;
          for (let m = 0; m < 600; m++) {
            const age = 62 + m / 12;
            if (age >= 62) e += at62;
            if (age >= 67) l += fra;
            if (l >= e && l > 0) return age;
          }
          return 0;
        })();

        const breakEven67vs70 = (() => {
          let e = 0; let l = 0;
          for (let m = 0; m < 600; m++) {
            const age = 67 + m / 12;
            if (age >= 67) e += fra;
            if (age >= 70) l += at70;
            if (l >= e && l > 0) return age;
          }
          return 0;
        })();

        return {
          primary: { label: "Benefit at Age 62", value: `$${formatNumber(at62)}/mo` },
          details: [
            { label: "Benefit at age 67 (FRA)", value: `$${formatNumber(fra)}/mo` },
            { label: "Benefit at age 70", value: `$${formatNumber(at70)}/mo` },
            { label: "Age 62 reduction", value: `${formatNumber(((fra - at62) / fra) * 100)}%` },
            { label: "Age 70 increase", value: `${formatNumber(((at70 - fra) / fra) * 100)}%` },
            { label: "Break-even: 62 vs 67", value: `Age ${formatNumber(breakEven62vs67)}` },
            { label: "Break-even: 67 vs 70", value: `Age ${formatNumber(breakEven67vs70)}` },
          ],
          note: "Claiming at 62 reduces benefits by ~30%. Delaying to 70 increases benefits by ~24%. The break-even ages assume no investment of benefits and no inflation adjustment.",
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "annuity-payout-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "What is the Social Security break-even age?",
      answer:
        "The break-even age is when cumulative benefits from claiming later equal cumulative benefits from claiming earlier. After this age, you come out ahead by having waited. For 62 vs 67, break-even is typically around age 78-80.",
    },
    {
      question: "Should I claim Social Security at 62, 67, or 70?",
      answer:
        "It depends on your health, financial needs, and life expectancy. Claiming at 62 gives smaller checks but more of them. Waiting until 70 gives the largest checks (~24% more than 67). If you expect to live past 80, waiting often pays off.",
    },
  ],
  formula:
    "Early reduction: 5/9% per month for first 36 months before FRA + 5/12% per additional month. Delayed credits: 2/3% per month after FRA up to age 70.",
};
