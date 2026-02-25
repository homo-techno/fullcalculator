import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const longTermCareCalculator: CalculatorDefinition = {
  slug: "long-term-care-insurance-calculator",
  title: "Long-Term Care Insurance Calculator",
  description:
    "Estimate long-term care costs and insurance needs. Calculate potential nursing home, assisted living, and home care expenses for retirement planning.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["long-term care", "nursing home cost", "assisted living", "home care", "LTC insurance"],
  variants: [
    {
      id: "costProjection",
      name: "Cost Projection",
      fields: [
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 55" },
        { name: "careStartAge", label: "Expected Care Start Age", type: "number", placeholder: "e.g. 80" },
        { name: "dailyNursingHomeCost", label: "Current Daily Nursing Home Cost ($)", type: "number", placeholder: "e.g. 290" },
        { name: "expectedCareYears", label: "Expected Years of Care Needed", type: "number", placeholder: "e.g. 3" },
        { name: "inflationRate", label: "Healthcare Inflation Rate (%)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const careStartAge = inputs.careStartAge as number;
        const dailyNursingHomeCost = inputs.dailyNursingHomeCost as number;
        const expectedCareYears = inputs.expectedCareYears as number;
        const inflationRate = (inputs.inflationRate as number) / 100;

        if (!currentAge || !careStartAge || !dailyNursingHomeCost || !expectedCareYears) return null;

        const yearsUntilCare = careStartAge - currentAge;
        const futureDailyCost = dailyNursingHomeCost * Math.pow(1 + inflationRate, yearsUntilCare);
        const futureAnnualCost = futureDailyCost * 365;
        const totalCostNeeded = futureAnnualCost * expectedCareYears;
        const currentAnnualCost = dailyNursingHomeCost * 365;
        const assistedLivingEstimate = totalCostNeeded * 0.6;
        const homeCareEstimate = totalCostNeeded * 0.5;

        return {
          primary: { label: "Projected Total Nursing Home Cost", value: `$${formatNumber(totalCostNeeded, 0)}` },
          details: [
            { label: "Future Daily Nursing Home Cost", value: `$${formatNumber(futureDailyCost, 2)}` },
            { label: "Future Annual Cost", value: `$${formatNumber(futureAnnualCost, 0)}` },
            { label: "Current Annual Cost (today's dollars)", value: `$${formatNumber(currentAnnualCost, 0)}` },
            { label: "Assisted Living Estimate", value: `$${formatNumber(assistedLivingEstimate, 0)}` },
            { label: "Home Care Estimate", value: `$${formatNumber(homeCareEstimate, 0)}` },
            { label: "Years Until Care Needed", value: `${yearsUntilCare}` },
          ],
        };
      },
    },
    {
      id: "premiumEstimate",
      name: "Premium Estimate",
      fields: [
        { name: "dailyBenefit", label: "Daily Benefit Amount ($)", type: "number", placeholder: "e.g. 200" },
        { name: "benefitPeriod", label: "Benefit Period (years)", type: "number", placeholder: "e.g. 3" },
        { name: "inflationProtection", label: "Inflation Protection? (0=No, 1=3%, 2=5%)", type: "number", placeholder: "e.g. 1" },
        { name: "eliminationPeriod", label: "Elimination Period (days)", type: "number", placeholder: "e.g. 90" },
        { name: "applicantAge", label: "Applicant Age", type: "number", placeholder: "e.g. 55" },
      ],
      calculate: (inputs) => {
        const dailyBenefit = inputs.dailyBenefit as number;
        const benefitPeriod = inputs.benefitPeriod as number;
        const inflationProtection = inputs.inflationProtection as number || 0;
        const eliminationPeriod = inputs.eliminationPeriod as number;
        const applicantAge = inputs.applicantAge as number;

        if (!dailyBenefit || !benefitPeriod || !applicantAge) return null;

        const baseMonthlyRate = dailyBenefit * 0.015;
        const ageFactor = 1 + Math.max(applicantAge - 50, 0) * 0.05;
        const inflationFactor = inflationProtection === 2 ? 1.6 : inflationProtection === 1 ? 1.35 : 1.0;
        const periodFactor = benefitPeriod > 5 ? 1.5 : benefitPeriod > 3 ? 1.25 : 1.0;
        const elimFactor = eliminationPeriod >= 180 ? 0.8 : eliminationPeriod >= 90 ? 0.9 : 1.0;

        const monthlyPremium = baseMonthlyRate * ageFactor * inflationFactor * periodFactor * elimFactor;
        const annualPremium = monthlyPremium * 12;
        const totalBenefitPool = dailyBenefit * 365 * benefitPeriod;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium, 2)}` },
          details: [
            { label: "Annual Premium", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Daily Benefit", value: `$${formatNumber(dailyBenefit, 0)}` },
            { label: "Total Benefit Pool", value: `$${formatNumber(totalBenefitPool, 0)}` },
            { label: "Benefit Period", value: `${benefitPeriod} years` },
            { label: "Elimination Period", value: `${eliminationPeriod || 90} days` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "health-insurance-cost-calculator", "medicare-cost-calculator"],
  faq: [
    { question: "When should I buy long-term care insurance?", answer: "Most experts recommend purchasing LTC insurance in your mid-50s to early 60s. Buying too early means paying premiums longer; buying too late means higher premiums or potential denial due to health issues." },
    { question: "What does long-term care insurance cover?", answer: "LTC insurance covers assistance with activities of daily living (bathing, dressing, eating) in settings like nursing homes, assisted living facilities, and in-home care. It typically does not cover standard medical expenses." },
  ],
  formula: "Future Cost = Daily Cost × (1 + inflation)^years × 365 × Care Duration",
};
