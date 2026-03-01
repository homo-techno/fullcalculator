import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyFundTimelineCalculator: CalculatorDefinition = {
  slug: "emergency-fund-timeline-calculator",
  title: "Emergency Fund Timeline Calculator",
  description: "Calculate how long it will take to build your emergency fund based on monthly savings and target months of expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["emergency fund timeline", "emergency savings goal", "rainy day fund calculator"],
  variants: [{
    id: "standard",
    name: "Emergency Fund Timeline",
    description: "Calculate how long it will take to build your emergency fund based on monthly savings and target months of expenses",
    fields: [
      { name: "monthlyExpenses", label: "Monthly Expenses", type: "number", prefix: "$", min: 500, max: 50000, defaultValue: 4000 },
      { name: "targetMonths", label: "Target Months of Expenses", type: "number", suffix: "months", min: 1, max: 24, defaultValue: 6 },
      { name: "monthlySavings", label: "Monthly Savings", type: "number", prefix: "$", min: 50, max: 10000, defaultValue: 500 },
      { name: "currentSaved", label: "Already Saved", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const expenses = inputs.monthlyExpenses as number;
      const targetMonths = inputs.targetMonths as number;
      const savings = inputs.monthlySavings as number;
      const current = inputs.currentSaved as number;
      if (!expenses || !savings || savings <= 0) return null;
      const goal = expenses * targetMonths;
      const remaining = Math.max(0, goal - current);
      const monthsNeeded = remaining > 0 ? Math.ceil(remaining / savings) : 0;
      const progress = Math.min(100, (current / goal) * 100);
      return {
        primary: { label: "Months to Goal", value: monthsNeeded === 0 ? "Goal reached!" : monthsNeeded + " months" },
        details: [
          { label: "Total Goal", value: "$" + formatNumber(Math.round(goal)) },
          { label: "Already Saved", value: "$" + formatNumber(current) },
          { label: "Remaining", value: "$" + formatNumber(Math.round(remaining)) },
          { label: "Progress", value: progress.toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sinking-fund-calculator", "no-spend-challenge-calculator"],
  faq: [
    { question: "How many months of expenses should I save?", answer: "Financial advisors recommend 3-6 months of essential expenses. Those with variable income should aim for 6-12 months." },
    { question: "Where should I keep my emergency fund?", answer: "Keep your emergency fund in a high-yield savings account for easy access while earning some interest." },
  ],
  formula: "Months to Goal = (Goal - Current Savings) / Monthly Savings; Goal = Monthly Expenses x Target Months",
};
