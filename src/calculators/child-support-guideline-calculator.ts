import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childSupportGuidelineCalculator: CalculatorDefinition = {
  slug: "child-support-guideline-calculator",
  title: "Child Support Guideline Calculator",
  description: "Estimate child support payments using income shares model guidelines.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["child support","child support calculator","custody support","parental support"],
  variants: [{
    id: "standard",
    name: "Child Support Guideline",
    description: "Estimate child support payments using income shares model guidelines.",
    fields: [
      { name: "payorIncome", label: "Payor Monthly Gross Income ($)", type: "number", min: 0, max: 100000, defaultValue: 6000 },
      { name: "recipientIncome", label: "Recipient Monthly Gross Income ($)", type: "number", min: 0, max: 100000, defaultValue: 3000 },
      { name: "children", label: "Number of Children", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "overnights", label: "Payor Overnights per Year", type: "number", min: 0, max: 365, defaultValue: 90 },
      { name: "healthInsurance", label: "Monthly Health Insurance for Children ($)", type: "number", min: 0, max: 5000, defaultValue: 300 },
    ],
    calculate: (inputs) => {
    const payorIncome = inputs.payorIncome as number;
    const recipientIncome = inputs.recipientIncome as number;
    const children = inputs.children as number;
    const overnights = inputs.overnights as number;
    const healthInsurance = inputs.healthInsurance as number;
    const combinedIncome = payorIncome + recipientIncome;
    const childPctTable = [0.2, 0.3, 0.35, 0.38, 0.4];
    const childPct = childPctTable[Math.min(children, 5) - 1] || 0.2;
    const totalObligation = combinedIncome * childPct;
    const payorShare = combinedIncome > 0 ? payorIncome / combinedIncome : 0.5;
    const baseSupport = totalObligation * payorShare;
    const overnightCredit = overnights > 109 ? baseSupport * ((overnights - 109) / 365) * 0.5 : 0;
    const insuranceCredit = healthInsurance * payorShare;
    const monthlySupport = Math.max(baseSupport - overnightCredit - insuranceCredit, 0);
    return {
      primary: { label: "Estimated Monthly Child Support", value: "$" + formatNumber(monthlySupport) },
      details: [
        { label: "Combined Monthly Income", value: "$" + formatNumber(combinedIncome) },
        { label: "Total Child Obligation", value: "$" + formatNumber(totalObligation) },
        { label: "Payor Income Share", value: formatNumber(payorShare * 100) + "%" },
        { label: "Overnight Credit", value: "$" + formatNumber(overnightCredit) },
        { label: "Annual Support", value: "$" + formatNumber(monthlySupport * 12) }
      ]
    };
  },
  }],
  relatedSlugs: ["alimony-estimator-calculator","legal-fee-estimator-calculator","settlement-value-estimator-calculator"],
  faq: [
    { question: "How is child support calculated?", answer: "Most states use the income shares model, which combines both parents incomes and determines each parent's proportional share of child-rearing costs." },
    { question: "Can child support be modified?", answer: "Yes, child support can be modified when there is a material change in circumstances such as job loss, income change, or change in custody." },
    { question: "Does overnight custody affect child support?", answer: "Yes, in many states the number of overnights the payor has reduces the support obligation, typically after exceeding a threshold like 110 nights." },
  ],
  formula: "Monthly Support = (Combined Income x Child%) x Payor Share - Overnight Credit - Insurance Credit",
};
