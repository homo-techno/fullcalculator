import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fourOhOneKCalculator: CalculatorDefinition = {
  slug: "401k-calculator",
  title: "401K Calculator",
  description:
    "Free 401(k) retirement calculator. Estimate your 401k growth with employer match, annual contributions, and compound interest over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["401k", "retirement", "employer match", "retirement savings", "compound interest"],
  variants: [
    {
      id: "withMatch",
      name: "With Employer Match",
      fields: [
        { name: "currentBalance", label: "Current Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 19500" },
        { name: "employerMatch", label: "Employer Match (%)", type: "number", placeholder: "e.g. 50" },
        { name: "matchLimit", label: "Match Limit (% of salary)", type: "number", placeholder: "e.g. 6" },
        { name: "annualSalary", label: "Annual Salary ($)", type: "number", placeholder: "e.g. 80000" },
        { name: "yearsToRetire", label: "Years to Retirement", type: "number", placeholder: "e.g. 30" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const currentBalance = inputs.currentBalance as number;
        const annualContribution = inputs.annualContribution as number;
        const employerMatch = inputs.employerMatch as number;
        const matchLimit = inputs.matchLimit as number;
        const annualSalary = inputs.annualSalary as number;
        const yearsToRetire = inputs.yearsToRetire as number;
        const returnRate = inputs.returnRate as number;

        if (!currentBalance && currentBalance !== 0) return null;
        if (!annualContribution || !yearsToRetire || !returnRate) return null;

        const r = returnRate / 100;
        const maxMatchableSalary = annualSalary ? annualSalary * (matchLimit / 100) : 0;
        const employerContribution = annualSalary
          ? Math.min(annualContribution, maxMatchableSalary) * (employerMatch / 100)
          : 0;
        const totalAnnual = annualContribution + employerContribution;

        let balanceWithMatch = currentBalance || 0;
        let balanceWithout = currentBalance || 0;

        for (let i = 0; i < yearsToRetire; i++) {
          balanceWithMatch = (balanceWithMatch + totalAnnual) * (1 + r);
          balanceWithout = (balanceWithout + annualContribution) * (1 + r);
        }

        const totalContributions = annualContribution * yearsToRetire;
        const totalEmployerMatch = employerContribution * yearsToRetire;

        return {
          primary: { label: "Future Value (with match)", value: `$${formatNumber(balanceWithMatch, 2)}` },
          details: [
            { label: "Future Value (without match)", value: `$${formatNumber(balanceWithout, 2)}` },
            { label: "Your Total Contributions", value: `$${formatNumber(totalContributions, 2)}` },
            { label: "Total Employer Match", value: `$${formatNumber(totalEmployerMatch, 2)}` },
            { label: "Annual Employer Match", value: `$${formatNumber(employerContribution, 2)}` },
            { label: "Total Investment Growth", value: `$${formatNumber(balanceWithMatch - totalContributions - totalEmployerMatch - (currentBalance || 0), 2)}` },
            { label: "Match Advantage", value: `$${formatNumber(balanceWithMatch - balanceWithout, 2)}` },
          ],
        };
      },
    },
    {
      id: "simple",
      name: "Simple Growth",
      fields: [
        { name: "currentBalance", label: "Current Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 19500" },
        { name: "yearsToRetire", label: "Years to Retirement", type: "number", placeholder: "e.g. 30" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const currentBalance = inputs.currentBalance as number || 0;
        const annualContribution = inputs.annualContribution as number;
        const yearsToRetire = inputs.yearsToRetire as number;
        const returnRate = inputs.returnRate as number;

        if (!annualContribution || !yearsToRetire || !returnRate) return null;

        const r = returnRate / 100;
        let balance = currentBalance;

        for (let i = 0; i < yearsToRetire; i++) {
          balance = (balance + annualContribution) * (1 + r);
        }

        const totalContributions = annualContribution * yearsToRetire + currentBalance;
        const totalGrowth = balance - totalContributions;

        return {
          primary: { label: "Future Value", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Total Contributions", value: `$${formatNumber(totalContributions, 2)}` },
            { label: "Investment Growth", value: `$${formatNumber(totalGrowth, 2)}` },
            { label: "Growth Percentage", value: `${formatNumber((totalGrowth / totalContributions) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roth-ira-calculator", "future-value-calculator", "budget-calculator"],
  faq: [
    { question: "How much should I contribute to my 401(k)?", answer: "Financial advisors typically recommend contributing at least enough to get the full employer match, which is essentially free money. The IRS contribution limit for 2024 is $23,000 ($30,500 if age 50+)." },
    { question: "What is employer match?", answer: "Employer match is when your employer contributes to your 401(k) based on your own contributions. For example, a 50% match up to 6% of salary means if you contribute 6% of your salary, your employer adds another 3%." },
  ],
  formula: "FV = Σ (Balance + Annual Contribution + Employer Match) × (1 + r) for each year",
};
