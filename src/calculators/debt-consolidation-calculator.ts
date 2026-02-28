import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const debtConsolidationCalculator: CalculatorDefinition = {
  slug: "debt-consolidation-calculator",
  title: "Debt Consolidation Calculator",
  description: "Free debt consolidation calculator. Compare your current multiple debts vs a single consolidated loan to see potential savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt consolidation calculator", "consolidate debt calculator", "debt payoff comparison"],
  variants: [{
    id: "standard",
    name: "Debt Consolidation",
    description: "Free debt consolidation calculator",
    fields: [
      { name: "totalDebt", label: "Total Current Debt", type: "number", prefix: "$", min: 0 },
      { name: "avgRate", label: "Average Current Interest Rate", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 18 },
      { name: "monthlyPayment", label: "Current Total Monthly Payment", type: "number", prefix: "$", min: 0 },
      { name: "newRate", label: "New Consolidated Rate", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 8 },
      { name: "newTerm", label: "New Loan Term", type: "number", suffix: "months", min: 6, max: 120, defaultValue: 48 },
    ],
    calculate: (inputs) => {
      const debt = inputs.totalDebt as number;
      const avgRate = (inputs.avgRate as number) / 100 / 12;
      const monthly = inputs.monthlyPayment as number;
      const newRate = (inputs.newRate as number) / 100 / 12;
      const term = inputs.newTerm as number;
      if (!debt || !monthly || debt <= 0 || monthly <= 0) return null;
      let bal = debt, totalOld = 0, oldMonths = 0;
      while (bal > 0 && oldMonths < 600) {
        const interest = bal * avgRate;
        const principal = Math.min(bal, monthly - interest);
        if (principal <= 0) { oldMonths = 999; break; }
        bal -= principal;
        totalOld += monthly;
        oldMonths++;
      }
      const newMonthly = newRate > 0 ? debt * newRate / (1 - Math.pow(1 + newRate, -term)) : debt / term;
      const totalNew = newMonthly * term;
      const savings = totalOld - totalNew;
      return {
        primary: { label: "Total Savings", value: "$" + formatNumber(Math.max(0, savings)) },
        details: [
          { label: "Current total cost", value: "$" + formatNumber(totalOld) },
          { label: "Current payoff time", value: oldMonths >= 999 ? "Never (min payment too low)" : oldMonths + " months" },
          { label: "New monthly payment", value: "$" + formatNumber(newMonthly) },
          { label: "New total cost", value: "$" + formatNumber(totalNew) },
          { label: "New payoff time", value: term + " months" },
        ],
      };
    },
  }],
  relatedSlugs: ["mortgage-refinance-calculator", "student-loan-repayment-calculator"],
  faq: [
    { question: "How does debt consolidation work?", answer: "You combine multiple debts into a single loan with a lower interest rate, reducing total interest paid and simplifying payments." },
    { question: "Is debt consolidation worth it?", answer: "If the new rate is significantly lower than your average rate and you can maintain payments, consolidation saves money on interest." },
  ],
  formula: "Savings = Total cost of current debts - Total cost of consolidated loan",
};
