import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeSavingsCalculator: CalculatorDefinition = {
  slug: "college-savings-calculator",
  title: "College Savings Calculator",
  description:
    "Free college savings (529 plan) calculator. Project how much you need to save monthly to cover future college costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["college savings", "529 plan", "education", "tuition", "college fund"],
  variants: [
    {
      id: "projection",
      name: "Savings Projection",
      fields: [
        { name: "childAge", label: "Child's Current Age", type: "number", placeholder: "e.g. 5" },
        { name: "targetAge", label: "College Start Age", type: "number", placeholder: "e.g. 18" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", placeholder: "e.g. 500" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 6" },
        { name: "estimatedCost", label: "Estimated Total College Cost ($)", type: "number", placeholder: "e.g. 200000" },
      ],
      calculate: (inputs) => {
        const childAge = inputs.childAge as number;
        const targetAge = inputs.targetAge as number || 18;
        const currentSavings = inputs.currentSavings as number || 0;
        const monthlyContribution = inputs.monthlyContribution as number;
        const returnRate = inputs.returnRate as number;
        const estimatedCost = inputs.estimatedCost as number || 200000;

        if (childAge === undefined || childAge === null || !monthlyContribution || !returnRate) return null;

        const yearsToSave = targetAge - childAge;
        if (yearsToSave <= 0) return null;

        const monthlyRate = (returnRate / 100) / 12;
        const totalMonths = yearsToSave * 12;

        // FV of current savings
        const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, totalMonths);

        // FV of monthly contributions
        const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

        const totalProjected = fvCurrent + fvContributions;
        const totalContributed = currentSavings + monthlyContribution * totalMonths;
        const investmentGrowth = totalProjected - totalContributed;
        const gap = estimatedCost - totalProjected;
        const coveragePct = (totalProjected / estimatedCost) * 100;

        return {
          primary: { label: "Projected Savings", value: `$${formatNumber(totalProjected, 2)}` },
          details: [
            { label: "Estimated College Cost", value: `$${formatNumber(estimatedCost, 2)}` },
            { label: "Coverage", value: `${formatNumber(coveragePct, 1)}%` },
            { label: "Surplus / Shortfall", value: `$${formatNumber(-gap, 2)}` },
            { label: "Years to Save", value: `${yearsToSave}` },
            { label: "Total Contributions", value: `$${formatNumber(totalContributed, 2)}` },
            { label: "Investment Growth", value: `$${formatNumber(investmentGrowth, 2)}` },
          ],
        };
      },
    },
    {
      id: "requiredSavings",
      name: "Required Monthly Savings",
      fields: [
        { name: "childAge", label: "Child's Current Age", type: "number", placeholder: "e.g. 5" },
        { name: "targetAge", label: "College Start Age", type: "number", placeholder: "e.g. 18" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "estimatedCost", label: "Estimated Total College Cost ($)", type: "number", placeholder: "e.g. 200000" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const childAge = inputs.childAge as number;
        const targetAge = inputs.targetAge as number || 18;
        const currentSavings = inputs.currentSavings as number || 0;
        const estimatedCost = inputs.estimatedCost as number;
        const returnRate = inputs.returnRate as number;

        if (childAge === undefined || childAge === null || !estimatedCost || !returnRate) return null;

        const yearsToSave = targetAge - childAge;
        if (yearsToSave <= 0) return null;

        const monthlyRate = (returnRate / 100) / 12;
        const totalMonths = yearsToSave * 12;

        const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, totalMonths);
        const amountNeeded = estimatedCost - fvCurrent;

        // PMT = FV × r / ((1+r)^n - 1)
        const requiredMonthly = amountNeeded > 0
          ? amountNeeded * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1)
          : 0;

        return {
          primary: { label: "Required Monthly Savings", value: `$${formatNumber(requiredMonthly, 2)}` },
          details: [
            { label: "Target Amount", value: `$${formatNumber(estimatedCost, 2)}` },
            { label: "FV of Current Savings", value: `$${formatNumber(fvCurrent, 2)}` },
            { label: "Additional Amount Needed", value: `$${formatNumber(amountNeeded > 0 ? amountNeeded : 0, 2)}` },
            { label: "Years to Save", value: `${yearsToSave}` },
            { label: "Total Monthly Payments", value: `$${formatNumber(requiredMonthly * totalMonths, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["future-value-calculator", "budget-calculator", "student-loan-calculator"],
  faq: [
    { question: "What is a 529 plan?", answer: "A 529 plan is a tax-advantaged savings plan designed for education expenses. Earnings grow tax-free, and withdrawals for qualified education expenses are also tax-free." },
    { question: "How much does college cost?", answer: "Average total 4-year costs range from about $100,000 for in-state public universities to $250,000+ for private universities, including tuition, room, board, and fees." },
  ],
  formula: "FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]; Required PMT = (Target - FV_current) × r / ((1+r)^n - 1)",
};
