import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const latteFactorCalculator: CalculatorDefinition = {
  slug: "latte-factor-calculator",
  title: "Latte Factor Investment Calculator",
  description:
    "Free latte factor calculator. See how much small daily expenses could grow if invested instead. Based on David Bach's Latte Factor concept.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "latte factor calculator",
    "latte factor",
    "small savings investment",
    "daily savings compound",
    "David Bach latte factor",
  ],
  variants: [
    {
      id: "daily-expense",
      name: "Daily Expense to Investment",
      description: "See what your daily expense could become if invested",
      fields: [
        {
          name: "dailyExpense",
          label: "Daily Expense Amount",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 0.5,
          max: 50,
          step: 0.5,
          defaultValue: 5,
        },
        {
          name: "annualReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 1,
          max: 15,
          step: 0.5,
          defaultValue: 7,
        },
        {
          name: "years",
          label: "Investment Period",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "25 years", value: "25" },
            { label: "30 years", value: "30" },
            { label: "40 years", value: "40" },
          ],
          defaultValue: "20",
        },
      ],
      calculate: (inputs) => {
        const daily = parseFloat(inputs.dailyExpense as string);
        const rate = parseFloat(inputs.annualReturn as string);
        const years = parseFloat(inputs.years as string);
        if (!daily || !rate || !years) return null;

        const monthlyContribution = daily * 30;
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;

        // Future value of annuity: PMT * ((1 + r)^n - 1) / r
        const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        const totalContributed = monthlyContribution * totalMonths;
        const interestEarned = futureValue - totalContributed;
        const yearlyExpense = daily * 365;

        return {
          primary: { label: `Value After ${years} Years`, value: `$${formatNumber(futureValue)}` },
          details: [
            { label: "Total Contributed", value: `$${formatNumber(totalContributed)}` },
            { label: "Interest/Growth Earned", value: `$${formatNumber(interestEarned)}` },
            { label: "Monthly Savings", value: `$${formatNumber(monthlyContribution)}` },
            { label: "Yearly Savings", value: `$${formatNumber(yearlyExpense)}` },
            { label: "Growth Multiple", value: `${formatNumber(futureValue / totalContributed, 1)}x` },
          ],
          note: `A daily $${formatNumber(daily)} habit costs $${formatNumber(yearlyExpense)} per year. Invested instead, it could grow to $${formatNumber(futureValue)} in ${years} years at ${rate}% annual return.`,
        };
      },
    },
    {
      id: "goal-amount",
      name: "Savings Goal",
      description: "How many daily lattes to give up to reach a goal",
      fields: [
        {
          name: "goalAmount",
          label: "Financial Goal",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 1000,
          max: 5000000,
          step: 1000,
          defaultValue: 100000,
        },
        {
          name: "annualReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 1,
          max: 15,
          step: 0.5,
          defaultValue: 7,
        },
        {
          name: "years",
          label: "Time Horizon",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "years",
          min: 1,
          max: 50,
          step: 1,
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const goal = parseFloat(inputs.goalAmount as string);
        const rate = parseFloat(inputs.annualReturn as string);
        const years = parseFloat(inputs.years as string);
        if (!goal || !rate || !years) return null;

        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;

        // Required monthly payment: FV * r / ((1 + r)^n - 1)
        const monthlyNeeded = goal * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const dailyNeeded = monthlyNeeded / 30;
        const totalContributed = monthlyNeeded * totalMonths;
        const interestEarned = goal - totalContributed;

        // How many lattes ($5.50) is that?
        const lattesPerDay = dailyNeeded / 5.5;

        return {
          primary: { label: "Daily Savings Needed", value: `$${formatNumber(dailyNeeded)}` },
          details: [
            { label: "Monthly Savings Needed", value: `$${formatNumber(monthlyNeeded)}` },
            { label: "Total Contributions", value: `$${formatNumber(totalContributed)}` },
            { label: "Interest/Growth Earned", value: `$${formatNumber(interestEarned)}` },
            { label: "Equivalent Lattes/Day Skipped", value: formatNumber(lattesPerDay, 1) },
            { label: "Goal Amount", value: `$${formatNumber(goal)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["coffee-spending-calculator", "compound-interest-calculator", "investment-calculator"],
  faq: [
    {
      question: "What is the Latte Factor?",
      answer:
        "The Latte Factor is a concept coined by financial author David Bach. It illustrates how small, seemingly insignificant daily expenses (like a latte) can add up to enormous sums over time, and how redirecting that money into investments can build significant wealth.",
    },
    {
      question: "Can skipping coffee really make me rich?",
      answer:
        "While the math is real, it is about the principle, not just coffee. Saving $5/day ($150/month) invested at 7% return grows to about $76,000 in 20 years or $176,000 in 30 years. The key insight is that all small recurring expenses compound over time.",
    },
    {
      question: "What is a realistic return rate to use?",
      answer:
        "The S&P 500 has historically returned about 10% annually before inflation, or about 7% after inflation. A conservative estimate of 6-7% is commonly used for long-term investment projections.",
    },
  ],
  formula:
    "Future Value = Monthly Savings x ((1 + r)^n - 1) / r | where r = annual rate / 12, n = years x 12",
};
