import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engagementRingBudgetCalculator: CalculatorDefinition = {
  slug: "engagement-ring-budget",
  title: "Engagement Ring Budget Calculator",
  description: "Free engagement ring budget calculator. Determine a ring budget based on your income, savings, and preferred financing options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["engagement ring", "ring budget", "diamond ring cost", "engagement ring cost", "ring calculator"],
  variants: [
    {
      id: "byIncome",
      name: "By Income & Savings",
      fields: [
        { name: "annualIncome", label: "Annual Income ($)", type: "number", placeholder: "e.g. 60000" },
        { name: "monthsSaving", label: "Months to Save", type: "number", placeholder: "e.g. 6" },
        { name: "monthlySavings", label: "Monthly Savings for Ring ($)", type: "number", placeholder: "e.g. 500" },
        { name: "currentSavings", label: "Current Ring Savings ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "budgetRule", label: "Budget Rule", type: "select", options: [
          { label: "1 month salary", value: "1" },
          { label: "2 months salary", value: "2" },
          { label: "3 months salary", value: "3" },
          { label: "Custom (what you can afford)", value: "custom" },
        ] },
      ],
      calculate: (inputs) => {
        const annualIncome = (inputs.annualIncome as number) || 0;
        const monthsSaving = (inputs.monthsSaving as number) || 6;
        const monthlySavings = (inputs.monthlySavings as number) || 0;
        const currentSavings = (inputs.currentSavings as number) || 0;
        const budgetRule = (inputs.budgetRule as string) || "2";
        if (annualIncome <= 0) return null;
        const monthlyIncome = annualIncome / 12;
        const ruleAmount = budgetRule === "custom" ? (currentSavings + monthlySavings * monthsSaving) : monthlyIncome * parseInt(budgetRule);
        const savedAmount = currentSavings + (monthlySavings * monthsSaving);
        const suggestedBudget = budgetRule === "custom" ? savedAmount : Math.min(ruleAmount, savedAmount);
        return {
          primary: { label: "Suggested Ring Budget", value: "$" + formatNumber(suggestedBudget, 2) },
          details: [
            { label: "Monthly Income", value: "$" + formatNumber(monthlyIncome, 2) },
            { label: "Traditional Rule Budget", value: "$" + formatNumber(ruleAmount, 2) },
            { label: "Amount You Can Save", value: "$" + formatNumber(savedAmount, 2) },
            { label: "Current Savings", value: "$" + formatNumber(currentSavings, 2) },
            { label: "Monthly Savings Goal", value: "$" + formatNumber(monthlySavings, 2) },
            { label: "Months to Save", value: formatNumber(monthsSaving) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["honeymoon-budget", "wedding-registry", "wedding-guest-list"],
  faq: [
    { question: "How much should you spend on an engagement ring?", answer: "The old rule of 2-3 months salary is outdated. Most financial experts recommend spending what you can comfortably afford without going into debt, typically $3,000-$7,000." },
    { question: "Is financing an engagement ring a good idea?", answer: "It depends on your financial situation. 0% interest financing can be reasonable, but avoid high-interest credit cards. Saving in advance is generally the best approach." },
  ],
  formula: "Budget = Current Savings + (Monthly Savings x Months)",
};
