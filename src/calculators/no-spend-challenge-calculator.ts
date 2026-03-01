import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const noSpendChallengeCalculator: CalculatorDefinition = {
  slug: "no-spend-challenge-calculator",
  title: "No-Spend Challenge Calculator",
  description: "Calculate potential savings from a no-spend challenge based on your typical discretionary spending.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["no spend challenge", "spending challenge savings", "no buy challenge"],
  variants: [{
    id: "standard",
    name: "No-Spend Challenge",
    description: "Calculate potential savings from a no-spend challenge based on your typical discretionary spending",
    fields: [
      { name: "dailySpend", label: "Average Daily Discretionary Spend", type: "number", prefix: "$", min: 1, max: 500, defaultValue: 25 },
      { name: "challengeDays", label: "Challenge Duration", type: "number", suffix: "days", min: 1, max: 365, defaultValue: 30 },
      { name: "compliance", label: "Expected Compliance", type: "select", options: [{value:"strict",label:"Strict (90%)"},{value:"moderate",label:"Moderate (75%)"},{value:"relaxed",label:"Relaxed (50%)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const daily = inputs.dailySpend as number;
      const days = inputs.challengeDays as number;
      const compliance = inputs.compliance as string;
      if (!daily || !days || daily <= 0 || days <= 0) return null;
      const complianceRate: Record<string, number> = { strict: 0.90, moderate: 0.75, relaxed: 0.50 };
      const rate = complianceRate[compliance] || 0.75;
      const totalSaved = daily * days * rate;
      const yearlySaved = (daily * 365 * rate);
      const perWeek = (daily * 7 * rate);
      return {
        primary: { label: "Challenge Savings", value: "$" + formatNumber(Math.round(totalSaved)) },
        details: [
          { label: "Weekly Savings", value: "$" + formatNumber(Math.round(perWeek)) },
          { label: "If Applied Year-Round", value: "$" + formatNumber(Math.round(yearlySaved)) },
          { label: "Compliance Rate", value: (rate * 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["emergency-fund-timeline-calculator", "cash-envelope-calculator"],
  faq: [
    { question: "What is a no-spend challenge?", answer: "A no-spend challenge means avoiding discretionary purchases for a set period, only spending on essentials like rent, utilities, and groceries." },
    { question: "How long should a no-spend challenge last?", answer: "Beginners should start with a weekend or one week. A full month is the most popular challenge length for significant savings." },
  ],
  formula: "Savings = Daily Discretionary Spending x Challenge Days x Compliance Rate",
};
