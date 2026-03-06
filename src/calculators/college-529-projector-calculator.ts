import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const college529ProjectorCalculator: CalculatorDefinition = {
  slug: "college-529-projector-calculator",
  title: "College 529 Plan Projector Calculator",
  description: "Project the future value of 529 college savings plan contributions with tax-free growth to estimate college funding readiness.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["529 plan projector","college savings growth","529 calculator","education fund projector","college investment"],
  variants: [{
    id: "standard",
    name: "College 529 Plan Projector",
    description: "Project the future value of 529 college savings plan contributions with tax-free growth to estimate college funding readiness.",
    fields: [
      { name: "currentBalance", label: "Current 529 Balance ($)", type: "number", min: 0, max: 500000, defaultValue: 5000 },
      { name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", min: 0, max: 5000, defaultValue: 300 },
      { name: "yearsToCollege", label: "Years Until College", type: "number", min: 1, max: 18, defaultValue: 12 },
      { name: "annualReturn", label: "Expected Annual Return (%)", type: "number", min: 2, max: 12, defaultValue: 7 },
      { name: "annualCollegeCost", label: "Projected Annual College Cost ($)", type: "number", min: 10000, max: 100000, defaultValue: 35000 },
    ],
    calculate: (inputs) => {
    const currentBalance = inputs.currentBalance as number;
    const monthlyContribution = inputs.monthlyContribution as number;
    const yearsToCollege = inputs.yearsToCollege as number;
    const annualReturn = inputs.annualReturn as number;
    const annualCollegeCost = inputs.annualCollegeCost as number;
    const r = annualReturn / 100 / 12;
    const n = yearsToCollege * 12;
    const futureValueLump = currentBalance * Math.pow(1 + r, n);
    const futureValueContrib = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const totalFutureValue = futureValueLump + futureValueContrib;
    const totalContributed = currentBalance + (monthlyContribution * n);
    const growthEarnings = totalFutureValue - totalContributed;
    const fourYearCost = annualCollegeCost * 4 * Math.pow(1.04, yearsToCollege);
    const coveragePercent = (totalFutureValue / fourYearCost) * 100;
    const gap = fourYearCost - totalFutureValue;
    return {
      primary: { label: "Projected 529 Balance", value: "$" + formatNumber(Math.round(totalFutureValue)) },
      details: [
        { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributed)) },
        { label: "Tax-Free Growth", value: "$" + formatNumber(Math.round(growthEarnings)) },
        { label: "Projected 4-Year Cost", value: "$" + formatNumber(Math.round(fourYearCost)) },
        { label: "Coverage Percentage", value: formatNumber(Math.round(coveragePercent)) + "%" },
        { label: "Funding Gap (if any)", value: gap > 0 ? "$" + formatNumber(Math.round(gap)) : "Fully Funded" }
      ]
    };
  },
  }],
  relatedSlugs: ["family-emergency-fund-calculator","maternity-leave-pay-calculator","family-grocery-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Future Value = Current x (1 + r)^n + Monthly x ((1 + r)^n - 1) / r; Projected College Cost = Annual Cost x 4 x 1.04^Years; Coverage = Future Value / College Cost x 100",
};
