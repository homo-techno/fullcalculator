import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ssdiBenefitCalculator: CalculatorDefinition = {
  slug: "ssdi-benefit",
  title: "SSDI Disability Benefit Calculator",
  description: "Free online SSDI benefit estimator. Estimate Social Security Disability Insurance monthly payments based on your work history and earnings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["SSDI", "disability benefits", "social security disability", "disability insurance", "SSDI payment", "disability income", "SSA"],
  variants: [
    {
      id: "benefit-estimate",
      name: "Estimate Monthly SSDI Benefit",
      fields: [
        {
          name: "averageMonthlyEarnings",
          label: "Average Indexed Monthly Earnings (AIME) ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "yearsWorked",
          label: "Years of Substantial Work",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
          max: 45,
        },
        {
          name: "age",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 50",
          min: 18,
          max: 67,
        },
        {
          name: "hasSpouse",
          label: "Spouse Eligible for Benefits?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes - Spouse under 62", value: "spouseUnder62" },
            { label: "Yes - Spouse 62+", value: "spouse62Plus" },
            { label: "Yes - Spouse caring for child", value: "spouseWithChild" },
          ],
        },
        {
          name: "dependentChildren",
          label: "Number of Dependent Children",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 10,
        },
      ],
      calculate: (inputs) => {
        const aime = parseFloat(inputs.averageMonthlyEarnings as string) || 0;
        const yearsWorked = parseFloat(inputs.yearsWorked as string) || 0;
        const age = parseFloat(inputs.age as string) || 50;
        const hasSpouse = inputs.hasSpouse as string;
        const dependentChildren = parseFloat(inputs.dependentChildren as string) || 0;

        // 2024 bend points (simplified)
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

        pia = Math.round(pia * 10) / 10;

        // Spouse benefit (up to 50% of PIA)
        let spouseBenefit = 0;
        if (hasSpouse === "spouse62Plus") {
          spouseBenefit = pia * 0.35; // reduced for early filing
        } else if (hasSpouse === "spouseWithChild") {
          spouseBenefit = pia * 0.50;
        }

        // Child benefit (up to 50% of PIA each)
        const childBenefit = dependentChildren * (pia * 0.50);

        // Family maximum (roughly 150-180% of PIA)
        const familyMax = pia * 1.75;
        const totalAuxiliary = Math.min(spouseBenefit + childBenefit, familyMax - pia);
        const totalFamilyBenefit = pia + Math.max(0, totalAuxiliary);

        const annualBenefit = pia * 12;

        // Check work credit eligibility
        const creditsNeeded = Math.min(40, Math.max(6, (age - 21) * 0.5 + 20));
        const creditsEarned = yearsWorked * 4;
        const eligible = creditsEarned >= creditsNeeded;

        return {
          primary: { label: "Estimated Monthly SSDI Benefit", value: "$" + formatNumber(pia) },
          details: [
            { label: "Primary Insurance Amount (PIA)", value: "$" + formatNumber(pia) },
            { label: "Annual Benefit", value: "$" + formatNumber(annualBenefit) },
            { label: "Spouse Benefit", value: "$" + formatNumber(spouseBenefit) },
            { label: "Children Benefit", value: "$" + formatNumber(childBenefit) },
            { label: "Total Family Benefit", value: "$" + formatNumber(totalFamilyBenefit) },
            { label: "Work Credits Earned (est.)", value: formatNumber(creditsEarned, 0) },
            { label: "Work Credits Needed", value: formatNumber(creditsNeeded, 0) },
            { label: "Likely Eligible", value: eligible ? "Yes" : "No - Need more work credits" },
          ],
          note: "This is an estimate based on the PIA formula. Your actual benefit is calculated by SSA using your complete earnings record. The maximum SSDI benefit in 2024 is approximately $3,822/month.",
        };
      },
    },
  ],
  relatedSlugs: ["overtime-pay-calc", "side-hustle-tax", "consulting-rate-calc"],
  faq: [
    {
      question: "How is the SSDI benefit amount calculated?",
      answer: "SSDI benefits are based on your Average Indexed Monthly Earnings (AIME) over your 35 highest-earning years. The SSA applies a formula with 'bend points' to calculate your Primary Insurance Amount (PIA): 90% of the first $1,174, plus 32% of amounts between $1,174 and $7,078, plus 15% of amounts over $7,078.",
    },
    {
      question: "How many work credits do I need for SSDI?",
      answer: "Generally, you need 40 work credits (about 10 years of work), with 20 credits earned in the last 10 years before disability. Younger workers may qualify with fewer credits. You can earn up to 4 credits per year.",
    },
    {
      question: "Can my family members receive benefits too?",
      answer: "Yes. Your spouse (if over 62 or caring for your child under 16) and unmarried dependent children can each receive up to 50% of your benefit. However, total family benefits are capped at approximately 150-180% of your benefit.",
    },
  ],
  formula: "PIA = 90% x first $1,174 of AIME + 32% x ($1,174 to $7,078) + 15% x (over $7,078)",
};
