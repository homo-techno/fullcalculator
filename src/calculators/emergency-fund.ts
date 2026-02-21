import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyFundCalculator: CalculatorDefinition = {
  slug: "emergency-fund-calculator",
  title: "Emergency Fund Calculator",
  description: "Free emergency fund calculator. Calculate how much you need in your emergency fund and how long it will take to build.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["emergency fund calculator", "emergency savings", "rainy day fund", "savings buffer", "financial safety net"],
  variants: [
    {
      id: "needed",
      name: "How Much Do I Need?",
      fields: [
        { name: "expenses", label: "Monthly Essential Expenses", type: "number", prefix: "$", placeholder: "e.g. 3500" },
        { name: "months", label: "Months of Coverage", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "saved", label: "Already Saved", type: "number", prefix: "$", placeholder: "e.g. 5000", defaultValue: 0 },
        { name: "monthly", label: "Monthly Savings Contribution", type: "number", prefix: "$", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const expenses = inputs.expenses as number, months = (inputs.months as number) || 6;
        const saved = (inputs.saved as number) || 0, contribution = inputs.monthly as number;
        if (!expenses) return null;
        const target = expenses * months;
        const remaining = Math.max(0, target - saved);
        const monthsToGoal = contribution ? Math.ceil(remaining / contribution) : 0;
        return {
          primary: { label: "Target Emergency Fund", value: `$${formatNumber(target, 2)}` },
          details: [
            { label: "Still needed", value: `$${formatNumber(remaining, 2)}` },
            { label: "Already saved", value: `$${formatNumber(saved, 2)}` },
            { label: "Progress", value: `${formatNumber(Math.min((saved / target) * 100, 100), 1)}%` },
            ...(contribution ? [{ label: "Months to reach goal", value: remaining <= 0 ? "Already there!" : `${monthsToGoal} months` }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["savings-goal-calculator", "retirement-calculator", "net-worth-calculator"],
  faq: [{ question: "How much should I have in my emergency fund?", answer: "Most financial advisors recommend 3-6 months of essential living expenses. If you have a stable job, 3 months may suffice. Self-employed or single-income households should aim for 6-12 months." }],
  formula: "Emergency Fund = Monthly Expenses × Months of Coverage",
};
