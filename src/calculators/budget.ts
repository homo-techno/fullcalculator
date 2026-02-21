import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const budgetCalculator: CalculatorDefinition = {
  slug: "budget-calculator",
  title: "Budget Calculator",
  description:
    "Free budget calculator using the 50/30/20 rule. Allocate your monthly income into needs, wants, and savings categories.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["budget", "50/30/20", "budgeting", "monthly budget", "savings plan"],
  variants: [
    {
      id: "fiftyThirtyTwenty",
      name: "50/30/20 Rule",
      fields: [
        { name: "monthlyIncome", label: "Monthly After-Tax Income ($)", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const monthlyIncome = inputs.monthlyIncome as number;
        if (!monthlyIncome) return null;

        const needs = monthlyIncome * 0.5;
        const wants = monthlyIncome * 0.3;
        const savings = monthlyIncome * 0.2;
        const annualSavings = savings * 12;

        return {
          primary: { label: "Monthly Savings Target", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: "Needs (50%) - Housing, food, utilities", value: `$${formatNumber(needs, 2)}` },
            { label: "Wants (30%) - Entertainment, dining out", value: `$${formatNumber(wants, 2)}` },
            { label: "Savings (20%) - Savings, debt payoff", value: `$${formatNumber(savings, 2)}` },
            { label: "Annual Income", value: `$${formatNumber(monthlyIncome * 12, 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "Weekly Budget (Wants)", value: `$${formatNumber(wants / 4.33, 2)}` },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Allocation",
      fields: [
        { name: "monthlyIncome", label: "Monthly After-Tax Income ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "needsPct", label: "Needs Percentage (%)", type: "number", placeholder: "e.g. 50" },
        { name: "wantsPct", label: "Wants Percentage (%)", type: "number", placeholder: "e.g. 30" },
        { name: "savingsPct", label: "Savings Percentage (%)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const monthlyIncome = inputs.monthlyIncome as number;
        const needsPct = inputs.needsPct as number;
        const wantsPct = inputs.wantsPct as number;
        const savingsPct = inputs.savingsPct as number;

        if (!monthlyIncome || !needsPct || !wantsPct || !savingsPct) return null;

        const totalPct = needsPct + wantsPct + savingsPct;
        const needs = monthlyIncome * (needsPct / 100);
        const wants = monthlyIncome * (wantsPct / 100);
        const savings = monthlyIncome * (savingsPct / 100);
        const remaining = monthlyIncome - needs - wants - savings;

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(savings, 2)}` },
          details: [
            { label: `Needs (${needsPct}%)`, value: `$${formatNumber(needs, 2)}` },
            { label: `Wants (${wantsPct}%)`, value: `$${formatNumber(wants, 2)}` },
            { label: `Savings (${savingsPct}%)`, value: `$${formatNumber(savings, 2)}` },
            { label: "Total Allocated", value: `${formatNumber(totalPct, 1)}%` },
            { label: "Unallocated", value: `$${formatNumber(remaining, 2)}` },
            { label: "Annual Savings", value: `$${formatNumber(savings * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["payroll-tax-calculator", "student-loan-calculator", "debt-snowball-calculator"],
  faq: [
    { question: "What is the 50/30/20 rule?", answer: "The 50/30/20 rule is a simple budgeting guideline: 50% of after-tax income goes to needs (housing, food, utilities), 30% to wants (entertainment, dining), and 20% to savings and debt repayment." },
    { question: "Should I use gross or net income?", answer: "Use your after-tax (net) income, which is your take-home pay after taxes and deductions. This gives a more accurate picture of what you actually have available to budget." },
  ],
  formula: "Needs = Income × 50%; Wants = Income × 30%; Savings = Income × 20%",
};
