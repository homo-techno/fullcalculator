import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disabilityInsuranceCalculator: CalculatorDefinition = {
  slug: "disability-insurance-calculator",
  title: "Disability Insurance Calculator",
  description:
    "Calculate how much disability insurance coverage you need and estimate monthly premiums. Protect your income against illness or injury.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["disability insurance", "income protection", "short term disability", "long term disability", "insurance premium"],
  variants: [
    {
      id: "coverageNeed",
      name: "Coverage Need",
      fields: [
        { name: "monthlyIncome", label: "Monthly Gross Income ($)", type: "number", placeholder: "e.g. 7000" },
        { name: "monthlyExpenses", label: "Monthly Essential Expenses ($)", type: "number", placeholder: "e.g. 4500" },
        { name: "otherIncome", label: "Other Monthly Income if Disabled ($)", type: "number", placeholder: "e.g. 500" },
        { name: "emergencyFundMonths", label: "Emergency Fund (months)", type: "number", placeholder: "e.g. 3" },
        { name: "benefitPeriodYears", label: "Desired Benefit Period (years)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const monthlyIncome = inputs.monthlyIncome as number;
        const monthlyExpenses = inputs.monthlyExpenses as number;
        const otherIncome = inputs.otherIncome as number || 0;
        const emergencyFundMonths = inputs.emergencyFundMonths as number || 0;
        const benefitPeriodYears = inputs.benefitPeriodYears as number;

        if (!monthlyIncome || !monthlyExpenses || !benefitPeriodYears) return null;

        const incomeGap = monthlyExpenses - otherIncome;
        const coverageNeeded = Math.max(incomeGap, 0);
        const replacementRatio = (coverageNeeded / monthlyIncome) * 100;
        const totalBenefitNeeded = coverageNeeded * benefitPeriodYears * 12;
        const emergencyCoverage = emergencyFundMonths * monthlyExpenses;
        const estimatedPremium = coverageNeeded * 0.02;

        return {
          primary: { label: "Monthly Coverage Needed", value: `$${formatNumber(coverageNeeded, 2)}` },
          details: [
            { label: "Income Replacement Ratio", value: `${formatNumber(replacementRatio, 1)}%` },
            { label: "Total Benefit Over Period", value: `$${formatNumber(totalBenefitNeeded, 0)}` },
            { label: "Emergency Fund Coverage", value: `$${formatNumber(emergencyCoverage, 0)}` },
            { label: "Estimated Monthly Premium", value: `$${formatNumber(estimatedPremium, 2)}` },
            { label: "Benefit Period", value: `${benefitPeriodYears} years` },
          ],
        };
      },
    },
    {
      id: "premiumEstimate",
      name: "Premium Estimate",
      fields: [
        { name: "monthlyBenefit", label: "Monthly Benefit Amount ($)", type: "number", placeholder: "e.g. 4000" },
        { name: "age", label: "Current Age", type: "number", placeholder: "e.g. 40" },
        { name: "eliminationPeriod", label: "Elimination Period (days)", type: "number", placeholder: "e.g. 90" },
        { name: "benefitPeriod", label: "Benefit Period (years)", type: "number", placeholder: "e.g. 5" },
        { name: "occupation", label: "Occupation Class (1=Office, 2=Light Physical, 3=Heavy Physical)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const monthlyBenefit = inputs.monthlyBenefit as number;
        const age = inputs.age as number;
        const eliminationPeriod = inputs.eliminationPeriod as number;
        const benefitPeriod = inputs.benefitPeriod as number;
        const occupation = inputs.occupation as number || 1;

        if (!monthlyBenefit || !age || !eliminationPeriod || !benefitPeriod) return null;

        const baseRate = 0.018;
        const ageFactor = 1 + (age - 30) * 0.025;
        const elimDiscount = eliminationPeriod >= 180 ? 0.7 : eliminationPeriod >= 90 ? 0.85 : 1.0;
        const periodFactor = benefitPeriod >= 10 ? 1.3 : benefitPeriod >= 5 ? 1.1 : 1.0;
        const occFactor = occupation === 1 ? 1.0 : occupation === 2 ? 1.4 : 2.0;

        const monthlyPremium = monthlyBenefit * baseRate * ageFactor * elimDiscount * periodFactor * occFactor;
        const annualPremium = monthlyPremium * 12;
        const premiumToBenefitRatio = (monthlyPremium / monthlyBenefit) * 100;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium, 2)}` },
          details: [
            { label: "Annual Premium", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Monthly Benefit", value: `$${formatNumber(monthlyBenefit, 0)}` },
            { label: "Premium-to-Benefit Ratio", value: `${formatNumber(premiumToBenefitRatio, 1)}%` },
            { label: "Elimination Period", value: `${eliminationPeriod} days` },
            { label: "Benefit Period", value: `${benefitPeriod} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["life-insurance-need-calculator", "health-insurance-cost-calculator", "retirement-income-calculator"],
  faq: [
    { question: "What is disability insurance?", answer: "Disability insurance replaces a portion of your income if you become unable to work due to illness or injury. It typically covers 60-70% of your gross income." },
    { question: "What is an elimination period?", answer: "The elimination period is the waiting time between when a disability occurs and when benefits begin. Common periods are 30, 60, 90, or 180 days. Longer elimination periods mean lower premiums." },
  ],
  formula: "Premium ≈ Monthly Benefit × Base Rate × Age Factor × Elimination Discount × Period Factor × Occupation Factor",
};
