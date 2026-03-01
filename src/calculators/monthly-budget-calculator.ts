import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const monthlyBudgetCalculator: CalculatorDefinition = {
  slug: "monthly-budget-calculator",
  title: "Monthly Budget Calculator",
  description: "Plan your monthly budget and calculate remaining income after expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["monthly budget", "budget planner", "expense calculator"],
  variants: [{
    id: "standard",
    name: "Monthly Budget",
    description: "Plan your monthly budget and calculate remaining income after expenses",
    fields: [
      { name: "income", label: "Monthly Income", type: "number", prefix: "$", min: 100, max: 500000, defaultValue: 5000 },
      { name: "housing", label: "Housing Cost", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 1500 },
      { name: "transport", label: "Transportation", type: "number", prefix: "$", min: 0, max: 20000, defaultValue: 400 },
      { name: "food", label: "Food and Groceries", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      const housing = inputs.housing as number;
      const transport = inputs.transport as number;
      const food = inputs.food as number;
      if (!income || income <= 0) return null;
      const totalExpenses = housing + transport + food;
      const remaining = income - totalExpenses;
      const savingsRate = (remaining / income) * 100;
      return {
        primary: { label: "Remaining Income", value: "$" + formatNumber(remaining) },
        details: [
          { label: "Total Expenses", value: "$" + formatNumber(totalExpenses) },
          { label: "Savings Rate", value: savingsRate.toFixed(1) + "%" },
          { label: "Housing Ratio", value: ((housing / income) * 100).toFixed(1) + "%" },
          { label: "Annual Savings Potential", value: "$" + formatNumber(remaining * 12) },
        ],
      };
    },
  }],
  relatedSlugs: ["50-30-20-calculator", "mortgage-qualification-dti-calculator"],
  faq: [
    { question: "What percentage of income should go to housing?", answer: "Financial experts recommend spending no more than 28% to 30% of gross income on housing." },
    { question: "How much should I save each month?", answer: "Aim to save at least 20% of your after-tax income, including retirement contributions and emergency funds." },
  ],
  formula: "Remaining = Income - (Housing + Transport + Food)",
};
