import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const savingsAccountCalculator: CalculatorDefinition = {
  slug: "savings-account-calculator",
  title: "Savings Account Calculator",
  description:
    "Free savings account calculator. Calculate how your savings grow with monthly deposits and compound interest. See future balance, total deposits, and total interest earned.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "savings account calculator",
    "savings interest calculator",
    "savings growth calculator",
    "high yield savings calculator",
    "compound savings calculator",
  ],
  variants: [
    {
      id: "savings",
      name: "Savings Growth Calculator",
      description: "Calculate savings growth with deposits and compound interest",
      fields: [
        {
          name: "initialDeposit",
          label: "Initial Deposit",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthlyDeposit",
          label: "Monthly Deposit",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "apy",
          label: "Annual Percentage Yield (APY)",
          type: "number",
          placeholder: "e.g. 4.5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.01,
        },
        {
          name: "years",
          label: "Time Period",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "30 years", value: "30" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const initial = (inputs.initialDeposit as number) || 0;
        const monthly = (inputs.monthlyDeposit as number) || 0;
        const apy = inputs.apy as number;
        const years = parseInt(inputs.years as string) || 5;
        if (!apy && !initial && !monthly) return null;

        // Monthly compounding
        const monthlyRate = Math.pow(1 + (apy || 0) / 100, 1 / 12) - 1;
        const totalMonths = years * 12;

        let balance = initial;
        for (let m = 0; m < totalMonths; m++) {
          balance = balance * (1 + monthlyRate) + monthly;
        }

        const totalDeposits = initial + monthly * totalMonths;
        const totalInterest = balance - totalDeposits;
        const monthlyInterestAvg = totalInterest / totalMonths;

        // Milestones
        const milestones: { label: string; value: string }[] = [
          { label: "Initial deposit", value: `$${formatNumber(initial)}` },
          { label: "Monthly deposit", value: `$${formatNumber(monthly)}` },
          { label: "APY", value: `${formatNumber(apy, 2)}%` },
          { label: "Time period", value: `${years} years` },
          { label: "Total deposits", value: `$${formatNumber(totalDeposits)}` },
          { label: "Total interest earned", value: `$${formatNumber(totalInterest)}` },
          { label: "Avg monthly interest", value: `$${formatNumber(monthlyInterestAvg)}` },
        ];

        // Show balance at intermediate years
        const checkpoints = [1, 2, 5, 10, 20].filter((y) => y < years);
        for (const cp of checkpoints) {
          let bal = initial;
          for (let m = 0; m < cp * 12; m++) {
            bal = bal * (1 + monthlyRate) + monthly;
          }
          milestones.push({ label: `Balance at year ${cp}`, value: `$${formatNumber(bal)}` });
        }

        return {
          primary: {
            label: "Future Balance",
            value: `$${formatNumber(balance)}`,
          },
          details: milestones,
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "cd-interest-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "How does compound interest work in a savings account?",
      answer:
        "Compound interest earns interest on both your principal and previously earned interest. Most savings accounts compound daily or monthly. With monthly compounding at 4.5% APY on $10,000, you earn about $459 in the first year vs $450 with simple interest.",
    },
    {
      question: "What is a good APY for a savings account?",
      answer:
        "As of 2024, high-yield savings accounts offer 4-5% APY, compared to the national average of about 0.45%. Online banks and credit unions typically offer the best rates. Shop around and compare rates regularly.",
    },
    {
      question: "How much should I have in savings?",
      answer:
        "Financial experts recommend 3-6 months of expenses in an emergency fund. Beyond that, save 15-20% of income for retirement and set specific goals (down payment, vacation, etc.). The 50/30/20 rule allocates 20% of after-tax income to savings.",
    },
  ],
  formula:
    "Balance = Initial × (1 + r)^n + Monthly × [((1 + r)^n - 1) / r], where r = monthly rate and n = total months. Monthly rate derived from APY.",
};
