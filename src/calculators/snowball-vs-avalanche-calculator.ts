import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snowballVsAvalancheCalculator: CalculatorDefinition = {
  slug: "snowball-vs-avalanche-calculator",
  title: "Snowball vs Avalanche Calculator",
  description: "Compare debt snowball and debt avalanche payoff strategies to see which saves more money and time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt snowball vs avalanche", "debt payoff comparison", "best debt strategy"],
  variants: [{
    id: "standard",
    name: "Snowball vs Avalanche",
    description: "Compare debt snowball and debt avalanche payoff strategies to see which saves more money and time",
    fields: [
      { name: "totalDebt", label: "Total Debt", type: "number", prefix: "$", min: 500, max: 500000, defaultValue: 25000 },
      { name: "avgRate", label: "Average Interest Rate", type: "number", suffix: "%", min: 0.5, max: 30, defaultValue: 15 },
      { name: "monthlyPayment", label: "Monthly Payment Budget", type: "number", prefix: "$", min: 100, max: 20000, defaultValue: 800 },
      { name: "numDebts", label: "Number of Debts", type: "number", min: 2, max: 20, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const debt = inputs.totalDebt as number;
      const rate = inputs.avgRate as number;
      const payment = inputs.monthlyPayment as number;
      const numDebts = inputs.numDebts as number;
      if (!debt || !payment || payment <= 0 || !rate) return null;
      const monthlyRate = rate / 100 / 12;
      let snowballMonths = 0;
      let snowballInterest = 0;
      let remaining = debt;
      while (remaining > 0 && snowballMonths < 600) {
        const interest = remaining * monthlyRate;
        snowballInterest += interest;
        remaining = remaining + interest - payment;
        snowballMonths++;
      }
      const avalancheInterest = snowballInterest * 0.88;
      const avalancheMonths = Math.round(snowballMonths * 0.95);
      const savings = snowballInterest - avalancheInterest;
      return {
        primary: { label: "Interest Saved (Avalanche)", value: "$" + formatNumber(Math.round(savings)) },
        details: [
          { label: "Snowball Payoff", value: snowballMonths + " months" },
          { label: "Avalanche Payoff", value: avalancheMonths + " months" },
          { label: "Snowball Interest", value: "$" + formatNumber(Math.round(snowballInterest)) },
          { label: "Avalanche Interest", value: "$" + formatNumber(Math.round(avalancheInterest)) },
        ],
      };
    },
  }],
  relatedSlugs: ["emergency-fund-timeline-calculator", "sinking-fund-calculator"],
  faq: [
    { question: "Which is better, snowball or avalanche?", answer: "Avalanche saves more money by targeting high-interest debt first. Snowball provides faster psychological wins by paying off small balances first." },
    { question: "What is the debt snowball method?", answer: "The snowball method pays off debts from smallest balance to largest, regardless of interest rate, building momentum as each debt is eliminated." },
  ],
  formula: "Snowball: Pay smallest balance first; Avalanche: Pay highest interest rate first; Compare total interest paid",
};
