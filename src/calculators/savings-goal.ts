import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const savingsGoalCalculator: CalculatorDefinition = {
  slug: "savings-goal-calculator",
  title: "Savings Goal Calculator",
  description: "Free savings goal calculator. Calculate how much to save each month to reach your financial goal. Plan for a house, car, vacation, or emergency fund.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["savings goal calculator", "savings calculator", "how much to save per month", "savings plan calculator", "financial goal calculator"],
  variants: [
    {
      id: "monthly",
      name: "Monthly Savings Needed",
      description: "Calculate how much to save monthly to reach your goal",
      fields: [
        { name: "goal", label: "Savings Goal", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "current", label: "Current Savings", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "months", label: "Time to Goal (Months)", type: "number", placeholder: "e.g. 36" },
        { name: "rate", label: "Annual Interest Rate", type: "number", placeholder: "e.g. 4.5", suffix: "%", defaultValue: 4.5 },
      ],
      calculate: (inputs) => {
        const goal = inputs.goal as number;
        const current = (inputs.current as number) || 0;
        const months = inputs.months as number;
        const apr = (inputs.rate as number) || 0;
        if (!goal || !months || goal <= current) return null;

        const needed = goal - current;

        if (apr === 0) {
          const monthly = needed / months;
          return {
            primary: { label: "Save Per Month", value: `$${formatNumber(monthly)}` },
            details: [
              { label: "Total to save", value: `$${formatNumber(needed)}` },
              { label: "Goal", value: `$${formatNumber(goal)}` },
              { label: "Time", value: `${months} months` },
            ],
          };
        }

        const r = apr / 100 / 12;
        const fvCurrent = current * Math.pow(1 + r, months);
        const remaining = goal - fvCurrent;
        const monthly = remaining / ((Math.pow(1 + r, months) - 1) / r);
        const totalContributed = monthly * months + current;
        const interestEarned = goal - totalContributed;

        return {
          primary: { label: "Save Per Month", value: `$${formatNumber(monthly)}` },
          details: [
            { label: "Total you contribute", value: `$${formatNumber(totalContributed)}` },
            { label: "Interest earned", value: `$${formatNumber(interestEarned)}` },
            { label: "Goal amount", value: `$${formatNumber(goal)}` },
            { label: "Time to goal", value: `${Math.floor(months / 12)} yr ${months % 12} mo` },
          ],
        };
      },
    },
    {
      id: "time",
      name: "Time to Reach Goal",
      description: "Calculate how long to reach your savings goal with fixed monthly contributions",
      fields: [
        { name: "goal", label: "Savings Goal", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "current", label: "Current Savings", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "monthly", label: "Monthly Savings", type: "number", placeholder: "e.g. 1000", prefix: "$" },
        { name: "rate", label: "Annual Interest Rate", type: "number", placeholder: "e.g. 4.5", suffix: "%", defaultValue: 4.5 },
      ],
      calculate: (inputs) => {
        const goal = inputs.goal as number;
        const current = (inputs.current as number) || 0;
        const monthly = inputs.monthly as number;
        const apr = (inputs.rate as number) || 0;
        if (!goal || !monthly || goal <= current) return null;

        let months: number;
        if (apr === 0) {
          months = Math.ceil((goal - current) / monthly);
        } else {
          const r = apr / 100 / 12;
          months = Math.ceil(Math.log((goal * r + monthly) / (current * r + monthly)) / Math.log(1 + r));
        }

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        const totalContributed = current + monthly * months;

        return {
          primary: { label: "Time to Goal", value: years > 0 ? `${years} yr ${remainingMonths} mo` : `${months} months` },
          details: [
            { label: "Total contributed", value: `$${formatNumber(totalContributed)}` },
            { label: "Goal", value: `$${formatNumber(goal)}` },
            { label: "Monthly savings", value: `$${formatNumber(monthly)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "retirement-calculator", "down-payment-calculator"],
  faq: [
    { question: "How much should I have in an emergency fund?", answer: "Financial experts recommend 3-6 months of essential expenses. If you spend $3,000/month on necessities, aim for $9,000-$18,000 in a high-yield savings account." },
    { question: "Where should I keep my savings?", answer: "High-yield savings accounts (4-5% APY as of 2024) for short-term goals and emergency funds. For goals 5+ years away, consider index funds or retirement accounts for higher potential returns." },
  ],
  formula: "Monthly = (Goal - Current×(1+r)^n) / ((1+r)^n - 1) / r",
};
