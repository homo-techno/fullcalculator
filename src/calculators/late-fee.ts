import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lateFeeCalculator: CalculatorDefinition = {
  slug: "late-fee-calculator",
  title: "Late Fee Calculator",
  description: "Free late fee and penalty calculator. Calculate late payment fees, daily penalties, and total amount owed including interest on overdue payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["late fee calculator", "penalty calculator", "late payment calculator", "overdue fee calculator", "late charge calculator"],
  variants: [
    {
      id: "flat-late-fee",
      name: "Flat Late Fee",
      description: "Calculate total owed with a flat late fee and daily penalties",
      fields: [
        { name: "originalAmount", label: "Original Amount Owed", type: "number", placeholder: "e.g. 1500", prefix: "$" },
        { name: "flatFee", label: "Flat Late Fee", type: "number", placeholder: "e.g. 50", prefix: "$", defaultValue: 0 },
        { name: "dailyPenalty", label: "Daily Penalty", type: "number", placeholder: "e.g. 5", prefix: "$", defaultValue: 0 },
        { name: "daysLate", label: "Days Late", type: "number", placeholder: "e.g. 30", min: 0 },
      ],
      calculate: (inputs) => {
        const originalAmount = inputs.originalAmount as number;
        const flatFee = (inputs.flatFee as number) || 0;
        const dailyPenalty = (inputs.dailyPenalty as number) || 0;
        const daysLate = inputs.daysLate as number;

        if (!originalAmount || !daysLate) return null;

        const totalDailyPenalties = dailyPenalty * daysLate;
        const totalFees = flatFee + totalDailyPenalties;
        const totalOwed = originalAmount + totalFees;
        const penaltyPercent = (totalFees / originalAmount) * 100;

        return {
          primary: { label: "Total Amount Owed", value: `$${formatNumber(totalOwed)}` },
          details: [
            { label: "Original amount", value: `$${formatNumber(originalAmount)}` },
            { label: "Flat late fee", value: `$${formatNumber(flatFee)}` },
            { label: "Daily penalties", value: `$${formatNumber(totalDailyPenalties)} (${daysLate} days × $${formatNumber(dailyPenalty)})` },
            { label: "Total fees & penalties", value: `$${formatNumber(totalFees)}` },
            { label: "Penalty as % of original", value: `${formatNumber(penaltyPercent)}%` },
          ],
        };
      },
    },
    {
      id: "percentage-late-fee",
      name: "Percentage-Based Late Fee",
      description: "Calculate late fees as a percentage of the amount owed",
      fields: [
        { name: "originalAmount", label: "Original Amount Owed", type: "number", placeholder: "e.g. 1500", prefix: "$" },
        { name: "penaltyRate", label: "Late Fee Percentage", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "periodsLate", label: "Number of Periods Late", type: "number", placeholder: "e.g. 3", min: 1 },
        { name: "compounding", label: "Compounding", type: "select", options: [
          { label: "Simple (fee on original only)", value: "simple" },
          { label: "Compound (fee on running total)", value: "compound" },
        ], defaultValue: "simple" },
      ],
      calculate: (inputs) => {
        const originalAmount = inputs.originalAmount as number;
        const penaltyRate = inputs.penaltyRate as number;
        const periodsLate = inputs.periodsLate as number;
        const compounding = inputs.compounding as string;

        if (!originalAmount || !penaltyRate || !periodsLate) return null;

        let totalOwed: number;
        let totalFees: number;

        if (compounding === "compound") {
          totalOwed = originalAmount * Math.pow(1 + penaltyRate / 100, periodsLate);
          totalFees = totalOwed - originalAmount;
        } else {
          totalFees = originalAmount * (penaltyRate / 100) * periodsLate;
          totalOwed = originalAmount + totalFees;
        }

        return {
          primary: { label: "Total Amount Owed", value: `$${formatNumber(totalOwed)}` },
          details: [
            { label: "Original amount", value: `$${formatNumber(originalAmount)}` },
            { label: "Penalty rate", value: `${penaltyRate}% per period` },
            { label: "Periods late", value: `${periodsLate}` },
            { label: "Total penalties", value: `$${formatNumber(totalFees)}` },
            { label: "Method", value: compounding === "compound" ? "Compound" : "Simple" },
            { label: "Effective penalty rate", value: `${formatNumber((totalFees / originalAmount) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["interest-penalty-calculator", "court-fee-calculator", "credit-card-calculator"],
  faq: [
    { question: "What is a typical late fee?", answer: "Late fees vary widely. Credit cards typically charge $25-$40. Rent late fees are usually 5-10% of rent. Utility companies may charge 1-5% per month. Many states cap late fees to prevent excessive penalties." },
    { question: "Are late fees legal?", answer: "Late fees are legal in most cases but many states limit the amount. For example, most states cap rental late fees at 5-10% of monthly rent. Credit card late fees are capped at $30 for the first violation and $41 for subsequent violations within 6 billing cycles." },
    { question: "Can I negotiate late fees?", answer: "Yes, especially for a first offense. Contact the creditor promptly, explain the situation, and ask for a one-time waiver. Many companies have policies to waive the first late fee for customers in good standing." },
  ],
  formula: "Flat: Total = Original + Flat Fee + (Daily Penalty × Days Late). Percentage Simple: Total = Original × (1 + Rate × Periods). Percentage Compound: Total = Original × (1 + Rate)^Periods.",
};
