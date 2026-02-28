import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ukStudentLoanCalculator: CalculatorDefinition = {
  slug: "uk-student-loan-calculator",
  title: "UK Student Loan Repayment Calculator",
  description: "Free UK student loan repayment calculator. Calculate monthly and annual repayments for Plan 1, 2, 4, 5 and postgraduate loans.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["uk student loan calculator", "student loan repayment calculator", "plan 2 student loan calculator"],
  variants: [{
    id: "standard",
    name: "UK Student Loan Repayment",
    description: "Free UK student loan repayment calculator",
    fields: [
      { name: "salary", label: "Annual Gross Salary", type: "number", prefix: "£", min: 0 },
      { name: "plan", label: "Loan Plan", type: "select", options: [{ label: "Plan 2 (England/Wales, after 2012)", value: "plan2" }, { label: "Plan 1 (pre-2012 / NI / Scotland pre-2023)", value: "plan1" }, { label: "Plan 4 (Scotland, from 2023)", value: "plan4" }, { label: "Plan 5 (England/Wales, from 2023)", value: "plan5" }, { label: "Postgraduate Loan", value: "pg" }], defaultValue: "plan2" },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const plan = inputs.plan as string;
      if (!salary || salary <= 0) return null;
      const thresholds: Record<string, number> = { plan1: 24990, plan2: 27295, plan4: 31395, plan5: 25000, pg: 21000 };
      const rates: Record<string, number> = { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, pg: 0.06 };
      const threshold = thresholds[plan] || 27295;
      const rate = rates[plan] || 0.09;
      const annual = Math.max(0, salary - threshold) * rate;
      return {
        primary: { label: "Annual Repayment", value: "£" + formatNumber(annual) },
        details: [
          { label: "Monthly repayment", value: "£" + formatNumber(annual / 12) },
          { label: "Repayment threshold", value: "£" + formatNumber(threshold) },
          { label: "Rate", value: (rate * 100) + "%" },
          { label: "Income above threshold", value: "£" + formatNumber(Math.max(0, salary - threshold)) },
        ],
        note: "Repayments are " + (rate * 100) + "% of income above £" + formatNumber(threshold) + ". Deducted automatically via PAYE.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "When do I start repaying my student loan?", answer: "You repay 9% (6% for postgrad) of income above the threshold. Plan 2: £27,295/year. Deducted via PAYE from your salary." },
    { question: "What is the difference between Plan 1 and Plan 2?", answer: "Plan 1 (pre-2012): threshold £24,990, written off after 25 years. Plan 2 (post-2012): threshold £27,295, written off after 30 years." },
  ],
  formula: "Repayment = (Salary - Threshold) × 9% (or 6% for postgrad)",
};
