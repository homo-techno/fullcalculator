import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecurityEarningsTestCalculator: CalculatorDefinition = {
  slug: "social-security-earnings-test-calculator",
  title: "Social Security Earnings Test Calculator",
  description: "Calculate how much of your Social Security benefits will be withheld if you continue working while collecting benefits before your full retirement age.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Social Security earnings test","Social Security work limit","working while collecting Social Security","earnings limit Social Security"],
  variants: [{
    id: "standard",
    name: "Social Security Earnings Test",
    description: "Calculate how much of your Social Security benefits will be withheld if you continue working while collecting benefits before your full retirement age.",
    fields: [
      { name: "annualEarnings", label: "Expected Annual Earnings ($)", type: "number", min: 0, max: 500000, defaultValue: 40000 },
      { name: "monthlyBenefit", label: "Monthly Social Security Benefit ($)", type: "number", min: 500, max: 10000, defaultValue: 1800 },
      { name: "age", label: "Your Age", type: "number", min: 62, max: 69, defaultValue: 63 },
      { name: "fra", label: "Full Retirement Age", type: "number", min: 66, max: 67, defaultValue: 67 },
      { name: "earningsLimit", label: "Annual Earnings Limit ($)", type: "number", min: 10000, max: 100000, defaultValue: 22320 },
    ],
    calculate: (inputs) => {
    const earnings = inputs.annualEarnings as number;
    const benefit = inputs.monthlyBenefit as number;
    const age = inputs.age as number;
    const fra = inputs.fra as number;
    const limit = inputs.earningsLimit as number;
    const isYearOfFRA = age === fra - 1 || age === fra;
    const excessEarnings = Math.max(0, earnings - limit);
    const withheldRate = isYearOfFRA ? 3 : 2;
    const annualBenefit = benefit * 12;
    const amountWithheld = Math.min(annualBenefit, Math.floor(excessEarnings / withheldRate));
    const benefitReceived = annualBenefit - amountWithheld;
    const monthsWithheld = benefit > 0 ? Math.ceil(amountWithheld / benefit) : 0;
    const effectiveBenefit = benefitReceived / 12;
    return {
      primary: { label: "Annual Benefits Withheld", value: "$" + formatNumber(Math.round(amountWithheld)) },
      details: [
        { label: "Excess Earnings Above Limit", value: "$" + formatNumber(Math.round(excessEarnings)) },
        { label: "Withholding Rate", value: "$1 per $" + formatNumber(withheldRate) + " over limit" },
        { label: "Annual Benefits Received", value: "$" + formatNumber(Math.round(benefitReceived)) },
        { label: "Effective Monthly Benefit", value: "$" + formatNumber(Math.round(effectiveBenefit)) },
        { label: "Months of Benefits Withheld", value: formatNumber(monthsWithheld) }
      ]
    };
  },
  }],
  relatedSlugs: ["social-security-spousal-benefit-calculator","retirement-tax-bracket-calculator"],
  faq: [
    { question: "What is the Social Security earnings test?", answer: "If you collect Social Security before your full retirement age and earn more than the annual limit, benefits are temporarily reduced. In 2024, $1 is withheld for every $2 you earn above $22,320. In the year you reach FRA, $1 is withheld for every $3 above a higher limit." },
    { question: "Are withheld benefits lost forever?", answer: "No. Benefits withheld due to the earnings test are not lost permanently. When you reach full retirement age, Social Security recalculates your benefit upward to credit you for the months benefits were withheld, resulting in higher monthly payments going forward." },
    { question: "Does the earnings test apply after full retirement age?", answer: "No. Once you reach your full retirement age, the earnings test no longer applies. You can earn any amount without any reduction in your Social Security benefits." },
  ],
  formula: "Excess Earnings = Annual Earnings - Earnings Limit
Before FRA Year: Withheld = Excess / 2
In FRA Year: Withheld = Excess / 3
Benefits Received = Annual Benefit - Amount Withheld",
};
