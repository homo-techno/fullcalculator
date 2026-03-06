import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecuritySpousalBenefitCalculator: CalculatorDefinition = {
  slug: "social-security-spousal-benefit-calculator",
  title: "Social Security Spousal Benefit Calculator",
  description: "Calculate the optimal Social Security spousal benefit strategy by comparing individual and spousal benefit amounts at different claiming ages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Social Security spousal benefit","spousal benefit calculator","spouse Social Security","married Social Security"],
  variants: [{
    id: "standard",
    name: "Social Security Spousal Benefit",
    description: "Calculate the optimal Social Security spousal benefit strategy by comparing individual and spousal benefit amounts at different claiming ages.",
    fields: [
      { name: "workerBenefitFRA", label: "Worker Benefit at FRA ($)", type: "number", min: 500, max: 10000, defaultValue: 2500 },
      { name: "spouseBenefitFRA", label: "Spouse Own Benefit at FRA ($)", type: "number", min: 0, max: 10000, defaultValue: 800 },
      { name: "workerClaimAge", label: "Worker Claiming Age", type: "number", min: 62, max: 70, defaultValue: 67 },
      { name: "spouseClaimAge", label: "Spouse Claiming Age", type: "number", min: 62, max: 70, defaultValue: 67 },
      { name: "fra", label: "Full Retirement Age", type: "number", min: 66, max: 67, defaultValue: 67 },
    ],
    calculate: (inputs) => {
    const workerFRA = inputs.workerBenefitFRA as number;
    const spouseOwnFRA = inputs.spouseBenefitFRA as number;
    const workerAge = inputs.workerClaimAge as number;
    const spouseAge = inputs.spouseClaimAge as number;
    const fra = inputs.fra as number;
    const workerAdj = workerAge < fra ? workerFRA * (1 - (fra - workerAge) * 0.0667) : workerFRA * (1 + (workerAge - fra) * 0.08);
    const spouseOwnAdj = spouseAge < fra ? spouseOwnFRA * (1 - (fra - spouseAge) * 0.0667) : spouseOwnFRA * (1 + (spouseAge - fra) * 0.08);
    const maxSpousalAtFRA = workerFRA * 0.5;
    const spousalBenefit = Math.max(0, maxSpousalAtFRA - spouseOwnFRA);
    const spouseReducedSpousal = spouseAge < fra ? spousalBenefit * (1 - (fra - spouseAge) * 0.05) : spousalBenefit;
    const totalSpouseBenefit = spouseOwnAdj + Math.max(0, spouseReducedSpousal);
    const betterOption = totalSpouseBenefit > spouseOwnAdj ? "Spousal Benefit is Higher" : "Own Benefit is Higher";
    const combinedMonthly = workerAdj + totalSpouseBenefit;
    return {
      primary: { label: "Combined Monthly Benefit", value: "$" + formatNumber(Math.round(combinedMonthly)) },
      details: [
        { label: "Worker Monthly Benefit", value: "$" + formatNumber(Math.round(workerAdj)) },
        { label: "Spouse Total Monthly Benefit", value: "$" + formatNumber(Math.round(totalSpouseBenefit)) },
        { label: "Spouse Own Benefit (adjusted)", value: "$" + formatNumber(Math.round(spouseOwnAdj)) },
        { label: "Spousal Top-Up Amount", value: "$" + formatNumber(Math.round(Math.max(0, spouseReducedSpousal))) },
        { label: "Recommendation", value: betterOption }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","retirement-tax-bracket-calculator"],
  faq: [
    { question: "What is the Social Security spousal benefit?", answer: "The spousal benefit allows a married person to receive up to 50 percent of their higher-earning spouse benefit at full retirement age, if that amount is more than their own benefit. The higher-earning spouse must have filed for benefits for the spousal benefit to begin." },
    { question: "Can I receive both my own benefit and a spousal benefit?", answer: "You cannot receive both in full. When you apply, Social Security automatically pays your own benefit first. If the spousal amount is higher, you receive a top-up to bring you to the spousal level. The combined amount equals the higher of the two." },
    { question: "Does the spousal benefit increase if I delay past FRA?", answer: "No. Unlike your own benefit, the spousal benefit does not increase with delayed retirement credits past full retirement age. The maximum spousal benefit is 50 percent of the worker benefit at FRA." },
  ],
  formula: "Worker Adjusted = FRA Benefit x (1 +/- age adjustment); Max Spousal = 50% of Worker FRA Benefit; Spousal Top-Up = max(0, Max Spousal - Spouse Own FRA Benefit); Combined = Worker Benefit + max(Spouse Own, Spouse Own + Top-Up)",
};
