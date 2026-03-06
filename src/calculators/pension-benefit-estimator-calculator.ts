import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pensionBenefitEstimatorCalculator: CalculatorDefinition = {
  slug: "pension-benefit-estimator-calculator",
  title: "Pension Benefit Estimator Calculator",
  description: "Estimate your monthly pension benefit based on years of service, final average salary, and your pension plan multiplier percentage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pension benefit estimator","pension calculation","defined benefit pension","pension multiplier"],
  variants: [{
    id: "standard",
    name: "Pension Benefit Estimator",
    description: "Estimate your monthly pension benefit based on years of service, final average salary, and your pension plan multiplier percentage.",
    fields: [
      { name: "finalAvgSalary", label: "Final Average Salary ($)", type: "number", min: 10000, max: 500000, defaultValue: 75000 },
      { name: "yearsOfService", label: "Years of Service", type: "number", min: 1, max: 50, defaultValue: 25 },
      { name: "multiplier", label: "Benefit Multiplier (%)", type: "number", min: 0.5, max: 4, defaultValue: 1.5 },
      { name: "earlyRetirementReduction", label: "Early Retirement Reduction (%)", type: "number", min: 0, max: 50, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const salary = inputs.finalAvgSalary as number;
    const years = inputs.yearsOfService as number;
    const multiplier = inputs.multiplier as number;
    const reduction = inputs.earlyRetirementReduction as number;
    const annualBenefit = salary * (multiplier / 100) * years;
    const reducedBenefit = annualBenefit * (1 - reduction / 100);
    const monthlyBenefit = reducedBenefit / 12;
    const replacementRate = salary > 0 ? (reducedBenefit / salary) * 100 : 0;
    return {
      primary: { label: "Monthly Pension Benefit", value: "$" + formatNumber(Math.round(monthlyBenefit)) },
      details: [
        { label: "Annual Pension Benefit", value: "$" + formatNumber(Math.round(reducedBenefit)) },
        { label: "Before Early Reduction", value: "$" + formatNumber(Math.round(annualBenefit)) + "/yr" },
        { label: "Income Replacement Rate", value: formatNumber(Math.round(replacementRate * 10) / 10) + "%" },
        { label: "Total Service Credit", value: formatNumber(years) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["pension-vs-lump-sum-calculator","retirement-income-gap-calculator"],
  faq: [
    { question: "What is a pension benefit multiplier?", answer: "A pension benefit multiplier is the percentage of salary you earn for each year of service. Common multipliers range from 1 to 2.5 percent. For example, with a 1.5 percent multiplier and 30 years of service, your pension would be 45 percent of your final average salary." },
    { question: "What is final average salary?", answer: "Final average salary is typically the average of your highest consecutive 3 to 5 years of earnings. Some plans use a different averaging period. This figure is a key component in calculating your defined benefit pension." },
    { question: "How does early retirement affect my pension?", answer: "Retiring before your plan normal retirement age typically reduces your pension by 3 to 7 percent per year. The reduction compensates for the longer expected payout period." },
  ],
  formula: "Annual Benefit = Final Average Salary x Multiplier % x Years of Service; Reduced Benefit = Annual Benefit x (1 - Early Retirement Reduction %); Monthly Benefit = Reduced Benefit / 12",
};
