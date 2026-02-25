import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireNumberCalculator: CalculatorDefinition = {
  slug: "fire-number-calculator",
  title: "FIRE Number Calculator",
  description:
    "Calculate your Financial Independence, Retire Early (FIRE) number. Determine how much you need saved to retire and live off your investments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["FIRE", "financial independence", "retire early", "FIRE number", "early retirement", "4% rule"],
  variants: [
    {
      id: "fireNumber",
      name: "FIRE Number",
      fields: [
        { name: "annualExpenses", label: "Annual Expenses in Retirement ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", placeholder: "e.g. 4" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 200000" },
        { name: "annualSavings", label: "Annual Savings ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const annualExpenses = inputs.annualExpenses as number;
        const withdrawalRate = (inputs.withdrawalRate as number) || 4;
        const currentSavings = inputs.currentSavings as number || 0;
        const annualSavings = inputs.annualSavings as number || 0;
        const returnRate = (inputs.returnRate as number) / 100;

        if (!annualExpenses) return null;

        const fireNumber = annualExpenses / (withdrawalRate / 100);
        const gap = fireNumber - currentSavings;

        let yearsToFire = 0;
        if (annualSavings > 0 && returnRate > 0) {
          let balance = currentSavings;
          while (balance < fireNumber && yearsToFire < 100) {
            balance = (balance + annualSavings) * (1 + returnRate);
            yearsToFire++;
          }
        }

        const progress = (currentSavings / fireNumber) * 100;

        return {
          primary: { label: "Your FIRE Number", value: `$${formatNumber(fireNumber, 0)}` },
          details: [
            { label: "Current Progress", value: `${formatNumber(progress, 1)}%` },
            { label: "Remaining Gap", value: `$${formatNumber(Math.max(gap, 0), 0)}` },
            { label: "Years to FIRE", value: yearsToFire > 0 && yearsToFire < 100 ? `${yearsToFire}` : "N/A" },
            { label: "Safe Withdrawal Rate", value: `${withdrawalRate}%` },
            { label: "Monthly Withdrawal in Retirement", value: `$${formatNumber(annualExpenses / 12, 2)}` },
          ],
        };
      },
    },
    {
      id: "whatIf",
      name: "What-If Scenarios",
      fields: [
        { name: "annualExpenses", label: "Annual Expenses ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 200000" },
        { name: "annualSavings", label: "Annual Savings ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "expenseReduction", label: "Possible Expense Reduction (%)", type: "number", placeholder: "e.g. 20" },
        { name: "savingsIncrease", label: "Possible Savings Increase (%)", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const annualExpenses = inputs.annualExpenses as number;
        const currentSavings = inputs.currentSavings as number || 0;
        const annualSavings = inputs.annualSavings as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const expenseReduction = (inputs.expenseReduction as number) / 100;
        const savingsIncrease = (inputs.savingsIncrease as number) / 100;

        if (!annualExpenses || !annualSavings || !returnRate) return null;

        const calcYears = (target: number, savings: number) => {
          let balance = currentSavings;
          let years = 0;
          while (balance < target && years < 100) {
            balance = (balance + savings) * (1 + returnRate);
            years++;
          }
          return years < 100 ? years : -1;
        };

        const baseTarget = annualExpenses / 0.04;
        const reducedTarget = (annualExpenses * (1 - expenseReduction)) / 0.04;
        const baseYears = calcYears(baseTarget, annualSavings);
        const reducedYears = calcYears(reducedTarget, annualSavings);
        const increasedSavingsYears = calcYears(baseTarget, annualSavings * (1 + savingsIncrease));
        const bothYears = calcYears(reducedTarget, annualSavings * (1 + savingsIncrease));

        return {
          primary: { label: "Base Case: Years to FIRE", value: baseYears >= 0 ? `${baseYears}` : "100+" },
          details: [
            { label: "Base FIRE Number", value: `$${formatNumber(baseTarget, 0)}` },
            { label: "Cut Expenses: Years to FIRE", value: reducedYears >= 0 ? `${reducedYears} years` : "100+" },
            { label: "Increase Savings: Years to FIRE", value: increasedSavingsYears >= 0 ? `${increasedSavingsYears} years` : "100+" },
            { label: "Both Changes: Years to FIRE", value: bothYears >= 0 ? `${bothYears} years` : "100+" },
            { label: "Reduced FIRE Number", value: `$${formatNumber(reducedTarget, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["coast-fire-calculator", "lean-fire-calculator", "barista-fire-calculator", "retirement-savings-needed-calculator"],
  faq: [
    { question: "What is a FIRE number?", answer: "Your FIRE number is the amount of money you need invested to be financially independent. It's typically calculated as your annual expenses divided by your safe withdrawal rate (usually 4%), based on the Trinity Study." },
    { question: "What is the 4% rule?", answer: "The 4% rule suggests you can withdraw 4% of your portfolio in the first year of retirement, adjusting for inflation each subsequent year, and have a high probability of not running out of money over 30 years." },
  ],
  formula: "FIRE Number = Annual Expenses / Safe Withdrawal Rate",
};
