import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disabilityInsuranceBenefitCalculator: CalculatorDefinition = {
  slug: "disability-insurance-benefit-calculator",
  title: "Disability Insurance Benefit Calculator",
  description: "Calculate your monthly disability insurance benefit based on income and policy terms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["disability insurance benefit", "disability coverage", "income replacement insurance"],
  variants: [{
    id: "standard",
    name: "Disability Insurance Benefit",
    description: "Calculate your monthly disability insurance benefit based on income and policy terms",
    fields: [
      { name: "annualIncome", label: "Annual Income", type: "number", prefix: "$", min: 10000, max: 2000000, defaultValue: 80000 },
      { name: "benefitPct", label: "Benefit Percentage", type: "number", suffix: "%", min: 40, max: 80, defaultValue: 60 },
      { name: "eliminationPeriod", label: "Elimination Period", type: "select", options: [{value:"30",label:"30 Days"},{value:"60",label:"60 Days"},{value:"90",label:"90 Days"},{value:"180",label:"180 Days"}], defaultValue: "90" },
    ],
    calculate: (inputs) => {
      const income = inputs.annualIncome as number;
      const pct = (inputs.benefitPct as number) / 100;
      const elimDays = parseInt(inputs.eliminationPeriod as string);
      if (!income || income <= 0 || !pct) return null;
      const monthlyIncome = income / 12;
      const monthlyBenefit = monthlyIncome * pct;
      const annualBenefit = monthlyBenefit * 12;
      const elimCost = monthlyIncome * (elimDays / 30);
      const premiumEstimate = annualBenefit * 0.02;
      return {
        primary: { label: "Monthly Benefit", value: "$" + formatNumber(Math.round(monthlyBenefit)) },
        details: [
          { label: "Annual Benefit", value: "$" + formatNumber(Math.round(annualBenefit)) },
          { label: "Income During Elimination Period", value: "$0" },
          { label: "Savings Needed for Elimination", value: "$" + formatNumber(Math.round(elimCost)) },
          { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(premiumEstimate)) },
        ],
      };
    },
  }],
  relatedSlugs: ["health-insurance-premium-tax-credit-calculator", "long-term-care-insurance-cost-calculator"],
  faq: [
    { question: "How much disability insurance do I need?", answer: "Most policies replace 60% to 70% of your gross income, and you should have enough savings to cover the elimination period." },
    { question: "What is an elimination period?", answer: "The elimination period is the waiting time after becoming disabled before benefits begin, typically 30 to 180 days." },
  ],
  formula: "Monthly Benefit = (Annual Income / 12) x Benefit Percentage",
};
