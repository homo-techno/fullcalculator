import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const debtAvalancheCalculator: CalculatorDefinition = {
  slug: "debt-avalanche",
  title: "Debt Avalanche vs Snowball Calculator",
  description: "Free online debt payoff calculator. Compare the debt avalanche (highest interest first) and debt snowball (smallest balance first) strategies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt avalanche", "debt snowball", "debt payoff", "debt repayment", "debt strategy", "pay off debt", "debt free"],
  variants: [
    {
      id: "compare-strategies",
      name: "Compare Payoff Strategies",
      fields: [
        {
          name: "debt1Balance",
          label: "Debt 1 Balance ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "debt1Rate",
          label: "Debt 1 Interest Rate (%)",
          type: "number",
          placeholder: "e.g. 22",
          min: 0,
        },
        {
          name: "debt1MinPayment",
          label: "Debt 1 Minimum Payment ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "debt2Balance",
          label: "Debt 2 Balance ($)",
          type: "number",
          placeholder: "e.g. 12000",
          min: 0,
        },
        {
          name: "debt2Rate",
          label: "Debt 2 Interest Rate (%)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
        },
        {
          name: "debt2MinPayment",
          label: "Debt 2 Minimum Payment ($)",
          type: "number",
          placeholder: "e.g. 250",
          min: 0,
        },
        {
          name: "debt3Balance",
          label: "Debt 3 Balance ($, 0 if none)",
          type: "number",
          placeholder: "e.g. 2000",
          min: 0,
        },
        {
          name: "debt3Rate",
          label: "Debt 3 Interest Rate (%)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0,
        },
        {
          name: "debt3MinPayment",
          label: "Debt 3 Minimum Payment ($)",
          type: "number",
          placeholder: "e.g. 75",
          min: 0,
        },
        {
          name: "extraPayment",
          label: "Extra Monthly Payment ($)",
          type: "number",
          placeholder: "e.g. 200",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const debts = [
          {
            balance: parseFloat(inputs.debt1Balance as string) || 0,
            rate: parseFloat(inputs.debt1Rate as string) || 0,
            minPayment: parseFloat(inputs.debt1MinPayment as string) || 0,
          },
          {
            balance: parseFloat(inputs.debt2Balance as string) || 0,
            rate: parseFloat(inputs.debt2Rate as string) || 0,
            minPayment: parseFloat(inputs.debt2MinPayment as string) || 0,
          },
          {
            balance: parseFloat(inputs.debt3Balance as string) || 0,
            rate: parseFloat(inputs.debt3Rate as string) || 0,
            minPayment: parseFloat(inputs.debt3MinPayment as string) || 0,
          },
        ].filter(d => d.balance > 0);

        const extraPayment = parseFloat(inputs.extraPayment as string) || 0;

        if (debts.length === 0) {
          return {
            primary: { label: "No Debts Entered", value: "$0" },
            details: [],
          };
        }

        const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
        const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);

        // Simulate avalanche (highest rate first)
        const simulatePayoff = (order: typeof debts): { months: number; totalInterest: number } => {
          const balances = order.map(d => d.balance);
          const rates = order.map(d => d.rate / 100 / 12);
          const mins = order.map(d => d.minPayment);
          let months = 0;
          let totalInterest = 0;
          const maxMonths = 600;

          while (balances.some(b => b > 0.01) && months < maxMonths) {
            months++;
            let extra = extraPayment;
            for (let i = 0; i < balances.length; i++) {
              if (balances[i] <= 0) continue;
              const interest = balances[i] * rates[i];
              totalInterest += interest;
              balances[i] += interest;
              const payment = Math.min(balances[i], mins[i]);
              balances[i] -= payment;
            }
            // Apply extra to target debt
            for (let i = 0; i < balances.length; i++) {
              if (balances[i] <= 0) continue;
              const extraApplied = Math.min(extra, balances[i]);
              balances[i] -= extraApplied;
              extra -= extraApplied;
              if (extra <= 0) break;
            }
          }
          return { months, totalInterest };
        };

        // Avalanche: sort by rate descending
        const avalancheOrder = [...debts].sort((a, b) => b.rate - a.rate);
        const avalanche = simulatePayoff(avalancheOrder);

        // Snowball: sort by balance ascending
        const snowballOrder = [...debts].sort((a, b) => a.balance - b.balance);
        const snowball = simulatePayoff(snowballOrder);

        const interestSavings = snowball.totalInterest - avalanche.totalInterest;
        const timeSavings = snowball.months - avalanche.months;

        return {
          primary: { label: "Interest Saved (Avalanche)", value: "$" + formatNumber(interestSavings) },
          details: [
            { label: "Total Debt", value: "$" + formatNumber(totalDebt) },
            { label: "Total Minimum Payments", value: "$" + formatNumber(totalMinPayments) + "/mo" },
            { label: "Extra Payment", value: "$" + formatNumber(extraPayment) + "/mo" },
            { label: "Avalanche Payoff Time", value: formatNumber(avalanche.months, 0) + " months" },
            { label: "Avalanche Total Interest", value: "$" + formatNumber(avalanche.totalInterest) },
            { label: "Snowball Payoff Time", value: formatNumber(snowball.months, 0) + " months" },
            { label: "Snowball Total Interest", value: "$" + formatNumber(snowball.totalInterest) },
            { label: "Time Saved (Avalanche)", value: formatNumber(Math.max(0, timeSavings), 0) + " months" },
            { label: "Recommended Strategy", value: interestSavings > 100 ? "Avalanche (saves more)" : "Either (similar results)" },
          ],
          note: "The avalanche method saves the most money. The snowball method provides quicker psychological wins by paying off smaller debts first. Both are effective strategies.",
        };
      },
    },
  ],
  relatedSlugs: ["effective-interest-rate", "npv-calculator", "apy-calculator"],
  faq: [
    {
      question: "What is the debt avalanche method?",
      answer: "The debt avalanche method involves making minimum payments on all debts, then applying extra payments to the debt with the highest interest rate first. This minimizes total interest paid and is mathematically optimal.",
    },
    {
      question: "What is the debt snowball method?",
      answer: "The debt snowball method involves making minimum payments on all debts, then applying extra payments to the smallest balance first. While it costs more in interest, it provides quick wins that can boost motivation and increase the likelihood of sticking with the plan.",
    },
    {
      question: "Which debt payoff strategy is better?",
      answer: "The avalanche method saves the most money on interest. However, research shows the snowball method can be more effective in practice because the psychological momentum of quickly eliminating debts keeps people motivated. Choose the method that you will actually stick with.",
    },
  ],
  formula: "Both methods: Pay minimum on all debts + Apply extra to target debt\nAvalanche: Target = Highest interest rate first\nSnowball: Target = Smallest balance first",
};
