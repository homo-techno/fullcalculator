import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecurityAgeCalculator: CalculatorDefinition = {
  slug: "social-security-age-calculator",
  title: "SS Break-Even Age Calculator",
  description:
    "Calculate the break-even age for claiming Social Security at different ages. Compare early, full, and delayed claiming strategies to maximize your lifetime benefits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Social Security", "break-even age", "claiming age", "SS benefits", "delayed retirement credits"],
  variants: [
    {
      id: "breakEvenAnalysis",
      name: "Break-Even Analysis",
      fields: [
        { name: "fullRetirementAge", label: "Full Retirement Age (e.g. 67)", type: "number", placeholder: "e.g. 67" },
        { name: "benefitAtFRA", label: "Monthly Benefit at Full Retirement Age ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "earlyAge", label: "Early Claiming Age", type: "number", placeholder: "e.g. 62" },
        { name: "delayedAge", label: "Delayed Claiming Age", type: "number", placeholder: "e.g. 70" },
      ],
      calculate: (inputs) => {
        const fullRetirementAge = inputs.fullRetirementAge as number || 67;
        const benefitAtFRA = inputs.benefitAtFRA as number;
        const earlyAge = inputs.earlyAge as number || 62;
        const delayedAge = inputs.delayedAge as number || 70;

        if (!benefitAtFRA) return null;

        const earlyMonths = (fullRetirementAge - earlyAge) * 12;
        const earlyReduction = Math.min(earlyMonths, 36) * (5 / 900) + Math.max(earlyMonths - 36, 0) * (5 / 1200);
        const earlyBenefit = benefitAtFRA * (1 - earlyReduction);

        const delayedMonths = (delayedAge - fullRetirementAge) * 12;
        const delayedCredit = delayedMonths * (2 / 3 / 100);
        const delayedBenefit = benefitAtFRA * (1 + delayedCredit);

        // Break-even: early vs FRA
        let earlyVsFraAge = 0;
        let earlyCumulative = 0;
        let fraCumulative = 0;
        for (let age = earlyAge; age <= 100; age++) {
          earlyCumulative += earlyBenefit * 12;
          if (age >= fullRetirementAge) fraCumulative += benefitAtFRA * 12;
          if (fraCumulative > earlyCumulative && earlyVsFraAge === 0) {
            earlyVsFraAge = age;
          }
        }

        // Break-even: FRA vs delayed
        let fraVsDelayedAge = 0;
        let fraCum2 = 0;
        let delayedCum = 0;
        for (let age = fullRetirementAge; age <= 100; age++) {
          fraCum2 += benefitAtFRA * 12;
          if (age >= delayedAge) delayedCum += delayedBenefit * 12;
          if (delayedCum > fraCum2 && fraVsDelayedAge === 0) {
            fraVsDelayedAge = age;
          }
        }

        return {
          primary: { label: "Early vs FRA Break-Even Age", value: `${earlyVsFraAge || "N/A"}` },
          details: [
            { label: `Monthly Benefit at ${earlyAge}`, value: `$${formatNumber(earlyBenefit, 2)}` },
            { label: `Monthly Benefit at ${fullRetirementAge} (FRA)`, value: `$${formatNumber(benefitAtFRA, 2)}` },
            { label: `Monthly Benefit at ${delayedAge}`, value: `$${formatNumber(delayedBenefit, 2)}` },
            { label: `FRA vs Delayed Break-Even Age`, value: `${fraVsDelayedAge || "N/A"}` },
            { label: "Early Benefit Reduction", value: `${formatNumber(earlyReduction * 100, 1)}%` },
            { label: "Delayed Benefit Increase", value: `${formatNumber(delayedCredit * 100, 1)}%` },
          ],
        };
      },
    },
    {
      id: "lifetimeComparison",
      name: "Lifetime Benefits Comparison",
      fields: [
        { name: "benefitAtFRA", label: "Monthly Benefit at FRA ($)", type: "number", placeholder: "e.g. 2500" },
        { name: "fullRetirementAge", label: "Full Retirement Age", type: "number", placeholder: "e.g. 67" },
        { name: "lifeExpectancy", label: "Life Expectancy", type: "number", placeholder: "e.g. 85" },
        { name: "discountRate", label: "Discount Rate / Inflation (%)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const benefitAtFRA = inputs.benefitAtFRA as number;
        const fullRetirementAge = inputs.fullRetirementAge as number || 67;
        const lifeExpectancy = inputs.lifeExpectancy as number;
        const discountRate = (inputs.discountRate as number) / 100;

        if (!benefitAtFRA || !lifeExpectancy) return null;

        const calcLifetime = (startAge: number, monthlyBenefit: number) => {
          let total = 0;
          for (let year = startAge; year < lifeExpectancy; year++) {
            const discount = Math.pow(1 + discountRate, -(year - 62));
            total += monthlyBenefit * 12 * discount;
          }
          return total;
        };

        const earlyMonths = (fullRetirementAge - 62) * 12;
        const earlyReduction = Math.min(earlyMonths, 36) * (5 / 900) + Math.max(earlyMonths - 36, 0) * (5 / 1200);
        const earlyBenefit = benefitAtFRA * (1 - earlyReduction);
        const delayedBenefit = benefitAtFRA * (1 + (70 - fullRetirementAge) * 0.08);

        const lifetime62 = calcLifetime(62, earlyBenefit);
        const lifetimeFRA = calcLifetime(fullRetirementAge, benefitAtFRA);
        const lifetime70 = calcLifetime(70, delayedBenefit);

        const best = Math.max(lifetime62, lifetimeFRA, lifetime70);
        const bestAge = best === lifetime62 ? "62" : best === lifetimeFRA ? `${fullRetirementAge}` : "70";

        return {
          primary: { label: "Optimal Claiming Age", value: `Age ${bestAge}` },
          details: [
            { label: "Lifetime Benefits (claim at 62)", value: `$${formatNumber(lifetime62, 0)}` },
            { label: `Lifetime Benefits (claim at ${fullRetirementAge})`, value: `$${formatNumber(lifetimeFRA, 0)}` },
            { label: "Lifetime Benefits (claim at 70)", value: `$${formatNumber(lifetime70, 0)}` },
            { label: "Difference (best vs worst)", value: `$${formatNumber(best - Math.min(lifetime62, lifetimeFRA, lifetime70), 0)}` },
            { label: "Life Expectancy Used", value: `${lifeExpectancy}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["social-security-calculator", "social-security-benefit-calculator", "retirement-income-calculator"],
  faq: [
    { question: "What is the Social Security break-even age?", answer: "The break-even age is when the total cumulative benefits from claiming later surpass the total from claiming earlier. If you live beyond this age, delaying was the better financial choice." },
    { question: "Should I claim Social Security early?", answer: "Claiming early (age 62) permanently reduces your benefit by up to 30%. However, if you have health concerns, need the income, or can invest it wisely, claiming early may make sense. Waiting until 70 maximizes your monthly benefit." },
  ],
  formula: "Break-Even Age = Age where Cumulative Benefits (Later Claim) > Cumulative Benefits (Earlier Claim)",
};
