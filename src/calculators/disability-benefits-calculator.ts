import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disabilityBenefitsCalculator: CalculatorDefinition = {
  slug: "disability-benefits-calculator",
  title: "Disability Benefits Calculator",
  description: "Estimate Social Security Disability Insurance (SSDI) benefits based on work history and earnings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["SSDI calculator", "disability benefits estimate", "social security disability"],
  variants: [{
    id: "standard",
    name: "Disability Benefits",
    description: "Estimate Social Security Disability Insurance (SSDI) benefits based on work history and earnings",
    fields: [
      { name: "avgMonthlyEarnings", label: "Average Indexed Monthly Earnings", type: "number", prefix: "$", min: 500, max: 15000, step: 100, defaultValue: 5000 },
      { name: "workYears", label: "Years of Work History", type: "number", suffix: "years", min: 5, max: 45, defaultValue: 20 },
      { name: "age", label: "Current Age", type: "number", suffix: "years", min: 21, max: 66, defaultValue: 45 },
    ],
    calculate: (inputs) => {
      const aime = inputs.avgMonthlyEarnings as number;
      const workYears = inputs.workYears as number;
      const age = inputs.age as number;
      if (!aime || aime <= 0 || !workYears) return null;
      const bendPoint1 = 1115;
      const bendPoint2 = 6721;
      let pia = 0;
      if (aime <= bendPoint1) {
        pia = aime * 0.9;
      } else if (aime <= bendPoint2) {
        pia = bendPoint1 * 0.9 + (aime - bendPoint1) * 0.32;
      } else {
        pia = bendPoint1 * 0.9 + (bendPoint2 - bendPoint1) * 0.32 + (aime - bendPoint2) * 0.15;
      }
      const monthlyBenefit = Math.round(pia);
      const annualBenefit = monthlyBenefit * 12;
      const familyMax = monthlyBenefit * 1.5;
      return {
        primary: { label: "Estimated Monthly SSDI Benefit", value: "$" + formatNumber(monthlyBenefit) },
        details: [
          { label: "Annual Benefit", value: "$" + formatNumber(annualBenefit) },
          { label: "Family Maximum Benefit", value: "$" + formatNumber(Math.round(familyMax)) + "/month" },
          { label: "Work Credits Earned", value: formatNumber(Math.min(workYears * 4, 40)) + " of 40 needed" },
        ],
      };
    },
  }],
  relatedSlugs: ["workers-comp-calculator", "veteran-benefits-calculator"],
  faq: [
    { question: "How is the SSDI benefit amount calculated?", answer: "SSDI benefits are based on your Average Indexed Monthly Earnings (AIME) using a formula with bend points. The formula replaces 90 percent of the first $1,115, 32 percent of earnings up to $6,721, and 15 percent above that." },
    { question: "How many work credits do you need for SSDI?", answer: "Generally, you need 40 work credits (about 10 years of work) to qualify for SSDI. Younger workers may qualify with fewer credits depending on their age at the onset of disability." },
  ],
  formula: "PIA = 90% of first $1,115 AIME + 32% of AIME up to $6,721 + 15% above",
};
