import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fourOhThreeBCalculator: CalculatorDefinition = {
  slug: "403b-calculator",
  title: "403(b) Calculator",
  description:
    "Calculate your 403(b) retirement plan growth. Estimate future value with employer contributions, annual returns, and tax-deferred compounding for educators and nonprofit employees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["403b", "retirement plan", "teacher retirement", "nonprofit retirement", "tax-deferred savings"],
  variants: [
    {
      id: "growthProjection",
      name: "Growth Projection",
      fields: [
        { name: "currentBalance", label: "Current Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 15000" },
        { name: "employerContribution", label: "Annual Employer Contribution ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "yearsToRetire", label: "Years to Retirement", type: "number", placeholder: "e.g. 25" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "yearsOfService", label: "Current Years of Service (for 15-year rule)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const currentBalance = inputs.currentBalance as number || 0;
        const annualContribution = inputs.annualContribution as number;
        const employerContribution = inputs.employerContribution as number || 0;
        const yearsToRetire = inputs.yearsToRetire as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const yearsOfService = inputs.yearsOfService as number || 0;

        if (!annualContribution || !yearsToRetire || !returnRate) return null;

        const totalAnnual = annualContribution + employerContribution;
        let balance = currentBalance;

        for (let i = 0; i < yearsToRetire; i++) {
          balance = (balance + totalAnnual) * (1 + returnRate);
        }

        const totalContributions = (annualContribution * yearsToRetire) + currentBalance;
        const totalEmployerContributions = employerContribution * yearsToRetire;
        const totalGrowth = balance - totalContributions - totalEmployerContributions;
        const extraContributionEligible = yearsOfService >= 15;
        const maxExtra = extraContributionEligible ? 3000 : 0;

        return {
          primary: { label: "Projected 403(b) Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Your Total Contributions", value: `$${formatNumber(totalContributions, 0)}` },
            { label: "Total Employer Contributions", value: `$${formatNumber(totalEmployerContributions, 0)}` },
            { label: "Investment Growth", value: `$${formatNumber(totalGrowth, 0)}` },
            { label: "Growth as % of Contributions", value: `${formatNumber((totalGrowth / (totalContributions + totalEmployerContributions)) * 100, 1)}%` },
            { label: "15-Year Rule Extra ($3K/yr)", value: extraContributionEligible ? "Eligible" : `${15 - yearsOfService} years until eligible` },
          ],
        };
      },
    },
    {
      id: "vs401k",
      name: "403(b) vs 401(k) Comparison",
      fields: [
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 15000" },
        { name: "yearsToRetire", label: "Years to Retirement", type: "number", placeholder: "e.g. 25" },
        { name: "returnRate403b", label: "403(b) Expected Return (%)", type: "number", placeholder: "e.g. 6" },
        { name: "returnRate401k", label: "401(k) Expected Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "expense403b", label: "403(b) Expense Ratio (%)", type: "number", placeholder: "e.g. 0.8" },
        { name: "expense401k", label: "401(k) Expense Ratio (%)", type: "number", placeholder: "e.g. 0.3" },
      ],
      calculate: (inputs) => {
        const annualContribution = inputs.annualContribution as number;
        const yearsToRetire = inputs.yearsToRetire as number;
        const returnRate403b = (inputs.returnRate403b as number) / 100;
        const returnRate401k = (inputs.returnRate401k as number) / 100;
        const expense403b = (inputs.expense403b as number) / 100;
        const expense401k = (inputs.expense401k as number) / 100;

        if (!annualContribution || !yearsToRetire) return null;

        const net403b = returnRate403b - expense403b;
        const net401k = returnRate401k - expense401k;

        let balance403b = 0;
        let balance401k = 0;

        for (let i = 0; i < yearsToRetire; i++) {
          balance403b = (balance403b + annualContribution) * (1 + net403b);
          balance401k = (balance401k + annualContribution) * (1 + net401k);
        }

        const feeDifference = balance401k - balance403b;
        const totalContributions = annualContribution * yearsToRetire;

        return {
          primary: { label: "403(b) Projected Balance", value: `$${formatNumber(balance403b, 2)}` },
          details: [
            { label: "401(k) Projected Balance", value: `$${formatNumber(balance401k, 2)}` },
            { label: "Fee Impact (difference)", value: `$${formatNumber(Math.abs(feeDifference), 0)}` },
            { label: "403(b) Net Return", value: `${formatNumber(net403b * 100, 2)}%` },
            { label: "401(k) Net Return", value: `${formatNumber(net401k * 100, 2)}%` },
            { label: "Total Contributions", value: `$${formatNumber(totalContributions, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["401k-calculator", "roth-ira-calculator", "retirement-calculator", "pension-calculator"],
  faq: [
    { question: "What is a 403(b) plan?", answer: "A 403(b) plan is a tax-advantaged retirement plan for employees of public schools, tax-exempt organizations, and certain ministers. It works similarly to a 401(k) but is specifically for nonprofit and education sectors." },
    { question: "What is the 15-year rule for 403(b)?", answer: "Employees with 15+ years of service at the same organization may contribute an extra $3,000 per year above the standard limit, up to a lifetime maximum of $15,000. This is unique to 403(b) plans." },
  ],
  formula: "FV = Σ (Balance + Annual Contribution + Employer Contribution) × (1 + return) per year",
};
