import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n529ContributionCalculator: CalculatorDefinition = {
  slug: "529-contribution-calculator",
  title: "529 Contribution Calculator",
  description: "Calculate how much to save monthly to reach your target college fund",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["529 plan","college fund","education savings plan"],
  variants: [{
    id: "standard",
    name: "529 Contribution",
    description: "Calculate how much to save monthly to reach your target college fund",
    fields: [
      { name: "targetAmount", label: "Target College Fund ($)", type: "number", defaultValue: 100000, min: 0, step: 5000 },
      { name: "currentBalance", label: "Current Balance ($)", type: "number", defaultValue: 5000, min: 0, step: 1000 },
      { name: "yearsToSave", label: "Years to Save", type: "number", defaultValue: 15, min: 1, max: 25, step: 1 },
      { name: "annualReturn", label: "Expected Annual Return (%)", type: "number", defaultValue: 7, min: 0, max: 15, step: 0.5 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const target = inputs.targetAmount as number || 100000;
      const current = inputs.currentBalance as number || 5000;
      const years = inputs.yearsToSave as number || 15;
      const rate = (inputs.annualReturn as number || 7) / 100;
      const monthlyRate = rate / 12;
      const months = years * 12;
      const futureOfCurrent = current * Math.pow(1 + monthlyRate, months);
      const remaining = Math.max(0, target - futureOfCurrent);
      const monthlyContrib = monthlyRate > 0 ? remaining * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) : remaining / months;
      const totalContributions = monthlyContrib * months + current;
      const totalGrowth = target - totalContributions;
      return {
        primary: { label: "Monthly Contribution Needed", value: "$" + formatNumber(Math.round(monthlyContrib)) },
        details: [
          { label: "Target Amount", value: "$" + formatNumber(Math.round(target)) },
          { label: "Current Balance Growth", value: "$" + formatNumber(Math.round(futureOfCurrent)) },
          { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributions)) },
          { label: "Total Investment Growth", value: "$" + formatNumber(Math.round(totalGrowth)) }
        ]
      };
    },
  }],
  relatedSlugs: ["college-savings-gap-calculator"],
  faq: [
    { question: "What is a 529 plan?", answer: "A 529 plan is a tax-advantaged savings plan designed to help pay for education expenses." },
    { question: "Are 529 contributions tax deductible?", answer: "Many states offer tax deductions or credits for 529 contributions. Federal benefits apply to withdrawals." },
  ],
  formula: "Monthly = (Target - Current x (1+r)^n) x r / ((1+r)^n - 1)",
};
