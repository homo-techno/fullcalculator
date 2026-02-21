import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const payRaiseCalculator: CalculatorDefinition = {
  slug: "pay-raise-calculator",
  title: "Pay Raise Calculator",
  description: "Free pay raise calculator. Calculate your new salary after a raise, or find the raise percentage between two salaries.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pay raise calculator", "salary increase calculator", "raise percentage", "wage increase calculator"],
  variants: [
    {
      id: "fromPercent",
      name: "Calculate New Salary",
      fields: [
        { name: "current", label: "Current Salary", type: "number", prefix: "$", placeholder: "e.g. 65000" },
        { name: "raise", label: "Raise (%)", type: "number", suffix: "%", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const current = inputs.current as number, raise = inputs.raise as number;
        if (!current || raise === undefined) return null;
        const increase = current * (raise / 100);
        const newSalary = current + increase;
        return {
          primary: { label: "New Salary", value: `$${formatNumber(newSalary, 2)}` },
          details: [
            { label: "Annual increase", value: `$${formatNumber(increase, 2)}` },
            { label: "Monthly increase", value: `$${formatNumber(increase / 12, 2)}` },
            { label: "New monthly pay", value: `$${formatNumber(newSalary / 12, 2)}` },
            { label: "New biweekly pay", value: `$${formatNumber(newSalary / 26, 2)}` },
          ],
        };
      },
    },
    {
      id: "findPercent",
      name: "Find Raise Percentage",
      fields: [
        { name: "old", label: "Old Salary", type: "number", prefix: "$", placeholder: "e.g. 65000" },
        { name: "new", label: "New Salary", type: "number", prefix: "$", placeholder: "e.g. 72000" },
      ],
      calculate: (inputs) => {
        const oldSal = inputs.old as number, newSal = inputs.new as number;
        if (!oldSal || !newSal) return null;
        const diff = newSal - oldSal;
        const pct = (diff / oldSal) * 100;
        return {
          primary: { label: "Raise Percentage", value: `${formatNumber(pct, 2)}%` },
          details: [
            { label: "Annual increase", value: `$${formatNumber(diff, 2)}` },
            { label: "Monthly increase", value: `$${formatNumber(diff / 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "inflation-calculator"],
  faq: [{ question: "What is a good pay raise?", answer: "The average annual raise is 3-5%. A raise above 5% is considered above average. Promotions typically come with 10-15% increases. Cost-of-living adjustments are usually 2-3%." }],
  formula: "New Salary = Current × (1 + Raise%/100)",
};
