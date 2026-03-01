import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashEnvelopeCalculator: CalculatorDefinition = {
  slug: "cash-envelope-calculator",
  title: "Cash Envelope Calculator",
  description: "Set up cash envelope budgeting by allocating your income into spending categories.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cash envelope budgeting", "envelope system", "budget envelopes"],
  variants: [{
    id: "standard",
    name: "Cash Envelope",
    description: "Set up cash envelope budgeting by allocating your income into spending categories",
    fields: [
      { name: "monthlyIncome", label: "Monthly Take-Home Pay", type: "number", prefix: "$", min: 500, max: 50000, defaultValue: 4000 },
      { name: "envelopes", label: "Number of Envelopes", type: "number", min: 2, max: 20, defaultValue: 5 },
      { name: "savingsPercent", label: "Savings Percentage", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const income = inputs.monthlyIncome as number;
      const envelopes = inputs.envelopes as number;
      const savingsPct = inputs.savingsPercent as number;
      if (!income || income <= 0 || !envelopes) return null;
      const savingsAmount = income * (savingsPct / 100);
      const spendable = income - savingsAmount;
      const perEnvelope = spendable / envelopes;
      const perWeek = perEnvelope / 4.33;
      return {
        primary: { label: "Per Envelope (Monthly)", value: "$" + formatNumber(Math.round(perEnvelope)) },
        details: [
          { label: "Total Spendable", value: "$" + formatNumber(Math.round(spendable)) },
          { label: "Savings Set Aside", value: "$" + formatNumber(Math.round(savingsAmount)) },
          { label: "Per Envelope (Weekly)", value: "$" + formatNumber(Math.round(perWeek)) },
        ],
      };
    },
  }],
  relatedSlugs: ["no-spend-challenge-calculator", "sinking-fund-calculator"],
  faq: [
    { question: "How does the cash envelope system work?", answer: "You divide your spending money into physical envelopes labeled by category. When an envelope is empty, you stop spending in that category." },
    { question: "How many budget envelopes should I have?", answer: "Most people use 5-10 envelopes for categories like groceries, dining out, entertainment, gas, and personal care." },
  ],
  formula: "Per Envelope = (Monthly Income - Savings) / Number of Envelopes",
};
