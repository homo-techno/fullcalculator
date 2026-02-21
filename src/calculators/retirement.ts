import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementCalculator: CalculatorDefinition = {
  slug: "retirement-calculator",
  title: "Retirement Calculator",
  description: "Free retirement calculator. Estimate how much you need to save for retirement and project your retirement savings growth over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement calculator", "401k calculator", "retirement savings calculator", "retirement planning", "how much to save for retirement"],
  variants: [
    {
      id: "savings",
      name: "Retirement Savings Projection",
      description: "Project your retirement savings based on current savings, contributions, and expected returns",
      fields: [
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 30", min: 18, max: 80 },
        { name: "retireAge", label: "Retirement Age", type: "number", placeholder: "e.g. 65", min: 30, max: 80 },
        { name: "currentSavings", label: "Current Savings", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "monthlyContribution", label: "Monthly Contribution", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "annualReturn", label: "Annual Return", type: "number", placeholder: "e.g. 7", suffix: "%", defaultValue: 7 },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const retireAge = inputs.retireAge as number;
        const current = (inputs.currentSavings as number) || 0;
        const monthly = (inputs.monthlyContribution as number) || 0;
        const rate = ((inputs.annualReturn as number) || 7) / 100;
        if (!currentAge || !retireAge || retireAge <= currentAge) return null;

        const years = retireAge - currentAge;
        const monthlyRate = rate / 12;
        const months = years * 12;

        const futureValueCurrent = current * Math.pow(1 + monthlyRate, months);
        const futureValueContributions = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        const total = futureValueCurrent + futureValueContributions;
        const totalContributed = current + monthly * months;
        const totalInterest = total - totalContributed;

        const monthlyWithdrawal4pct = (total * 0.04) / 12;

        return {
          primary: { label: "Projected Retirement Savings", value: `$${formatNumber(total)}` },
          details: [
            { label: "Total contributed", value: `$${formatNumber(totalContributed)}` },
            { label: "Investment growth", value: `$${formatNumber(totalInterest)}` },
            { label: "Years to retirement", value: `${years}` },
            { label: "Monthly income (4% rule)", value: `$${formatNumber(monthlyWithdrawal4pct)}` },
            { label: "Annual income (4% rule)", value: `$${formatNumber(monthlyWithdrawal4pct * 12)}` },
          ],
          note: "The 4% rule suggests withdrawing 4% of savings annually in retirement. Actual returns vary. This does not account for inflation or taxes.",
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "paycheck-calculator", "savings-goal-calculator"],
  faq: [
    { question: "How much do I need to retire?", answer: "A common rule of thumb is 25x your annual expenses (based on the 4% withdrawal rule). If you spend $50,000/year, aim for $1.25 million. Adjust for your lifestyle and expected Social Security income." },
    { question: "What is the 4% rule?", answer: "The 4% rule suggests you can withdraw 4% of your retirement savings each year without running out of money over a 30-year retirement. It's based on historical stock/bond returns." },
  ],
  formula: "FV = PV(1+r)^n + PMT × ((1+r)^n - 1) / r",
};
