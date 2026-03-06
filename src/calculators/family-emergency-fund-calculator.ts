import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyEmergencyFundCalculator: CalculatorDefinition = {
  slug: "family-emergency-fund-calculator",
  title: "Family Emergency Fund Calculator",
  description: "Calculate the recommended emergency fund size for your family based on monthly expenses, income sources, dependents, and risk factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["emergency fund","family savings goal","rainy day fund","emergency savings","financial safety net"],
  variants: [{
    id: "standard",
    name: "Family Emergency Fund",
    description: "Calculate the recommended emergency fund size for your family based on monthly expenses, income sources, dependents, and risk factors.",
    fields: [
      { name: "monthlyExpenses", label: "Monthly Essential Expenses ($)", type: "number", min: 1000, max: 20000, defaultValue: 4500 },
      { name: "monthsRecommended", label: "Months of Coverage", type: "number", min: 3, max: 12, defaultValue: 6 },
      { name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "incomeStability", label: "Income Stability", type: "select", options: [{ value: "0.8", label: "Very Stable (Government/Tenured)" }, { value: "1.0", label: "Stable (Salaried)" }, { value: "1.3", label: "Variable (Commission/Freelance)" }, { value: "1.5", label: "Unstable (Seasonal/Gig)" }], defaultValue: "1.0" },
      { name: "currentSavings", label: "Current Emergency Savings ($)", type: "number", min: 0, max: 200000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
    const monthlyExpenses = inputs.monthlyExpenses as number;
    const monthsRecommended = inputs.monthsRecommended as number;
    const dependents = inputs.dependents as number;
    const incomeStability = inputs.incomeStability as number;
    const currentSavings = inputs.currentSavings as number;
    const dependentAdj = 1 + (dependents * 0.05);
    const targetFund = monthlyExpenses * monthsRecommended * incomeStability * dependentAdj;
    const gap = Math.max(0, targetFund - currentSavings);
    const monthsToGoal12 = gap / (monthlyExpenses * 0.15);
    const percentComplete = Math.min(100, (currentSavings / targetFund) * 100);
    return {
      primary: { label: "Recommended Emergency Fund", value: "$" + formatNumber(Math.round(targetFund)) },
      details: [
        { label: "Current Savings", value: "$" + formatNumber(Math.round(currentSavings)) },
        { label: "Remaining Gap", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Progress", value: formatNumber(Math.round(percentComplete)) + "%" },
        { label: "Months to Goal (Saving 15%)", value: gap > 0 ? formatNumber(Math.round(monthsToGoal12)) + " months" : "Goal Reached" },
        { label: "Months of Coverage Funded", value: formatNumber(Math.round((currentSavings / monthlyExpenses) * 10) / 10) }
      ]
    };
  },
  }],
  relatedSlugs: ["maternity-leave-pay-calculator","college-529-projector-calculator","estate-planning-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Target = Monthly Expenses x Months x Income Stability Factor x (1 + Dependents x 5%); Gap = Target - Current Savings",
};
