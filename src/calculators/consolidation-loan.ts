import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const consolidationLoanCalculator: CalculatorDefinition = {
  slug: "consolidation-loan-calculator",
  title: "Debt Consolidation Loan Calculator",
  description:
    "Free debt consolidation loan calculator. See how much you could save by consolidating multiple debts into one loan with a lower interest rate and single monthly payment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "debt consolidation calculator",
    "consolidation loan calculator",
    "consolidate debt",
    "debt consolidation savings",
    "combine debts",
    "single payment calculator",
  ],
  variants: [
    {
      id: "consolidation-savings",
      name: "Consolidation Savings",
      description: "Compare current debt payments with a consolidation loan",
      fields: [
        {
          name: "totalDebt",
          label: "Total Debt to Consolidate",
          type: "number",
          placeholder: "e.g. 30000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentAvgRate",
          label: "Current Avg Interest Rate",
          type: "number",
          placeholder: "e.g. 22",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.01,
        },
        {
          name: "currentMonthlyPayment",
          label: "Current Total Monthly Payments",
          type: "number",
          placeholder: "e.g. 900",
          prefix: "$",
          min: 0,
        },
        {
          name: "newRate",
          label: "New Consolidation Rate",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.01,
        },
        {
          name: "newTerm",
          label: "Consolidation Loan Term",
          type: "select",
          options: [
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "4 years", value: "4" },
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const totalDebt = inputs.totalDebt as number;
        const currentRate = inputs.currentAvgRate as number;
        const currentPayment = inputs.currentMonthlyPayment as number;
        const newRate = inputs.newRate as number;
        const newYears = parseInt(inputs.newTerm as string) || 3;
        if (!totalDebt || !currentRate || !currentPayment || !newRate) return null;

        const mr = newRate / 100 / 12;
        const n = newYears * 12;
        const newMonthly =
          (totalDebt * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const newTotalPaid = newMonthly * n;
        const newTotalInterest = newTotalPaid - totalDebt;

        // Estimate how long current debts would take
        const currentMR = currentRate / 100 / 12;
        let balance = totalDebt;
        let currentMonths = 0;
        let currentTotalInterest = 0;
        while (balance > 0 && currentMonths < 600) {
          const interest = balance * currentMR;
          currentTotalInterest += interest;
          const principal = currentPayment - interest;
          if (principal <= 0) break;
          balance -= principal;
          currentMonths++;
        }
        const currentTotalPaid = currentPayment * currentMonths;
        const monthlySavings = currentPayment - newMonthly;
        const totalInterestSavings = currentTotalInterest - newTotalInterest;

        return {
          primary: {
            label: "New Monthly Payment",
            value: `$${formatNumber(newMonthly)}`,
          },
          details: [
            { label: "Current total monthly payments", value: `$${formatNumber(currentPayment)}` },
            { label: "Monthly savings", value: `$${formatNumber(Math.max(0, monthlySavings))}` },
            { label: "Current total interest", value: `$${formatNumber(currentTotalInterest)}` },
            { label: "New total interest", value: `$${formatNumber(newTotalInterest)}` },
            { label: "Interest savings", value: `$${formatNumber(Math.max(0, totalInterestSavings))}` },
            { label: "Current payoff time", value: `${currentMonths} months` },
            { label: "New payoff time", value: `${n} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["personal-loan-calculator", "credit-card-payoff-calculator"],
  faq: [
    {
      question: "What is debt consolidation?",
      answer:
        "Debt consolidation combines multiple debts (credit cards, loans, etc.) into a single loan with one monthly payment, ideally at a lower interest rate. This simplifies payments and can save money on interest.",
    },
    {
      question: "Does debt consolidation hurt your credit?",
      answer:
        "Initially, a hard inquiry may slightly lower your score. However, consolidation can improve your credit over time by reducing credit utilization and establishing a consistent payment history.",
    },
    {
      question: "When is consolidation a good idea?",
      answer:
        "Consolidation makes sense when you can get a significantly lower interest rate, you have a plan to avoid accumulating new debt, and the total cost of the consolidation loan is less than your current debts.",
    },
  ],
  formula:
    "New Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Savings = Current Total Interest - New Total Interest.",
};
