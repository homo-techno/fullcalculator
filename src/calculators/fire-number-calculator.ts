import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireNumberCalculator: CalculatorDefinition = {
  slug: "fire-number-calculator",
  title: "FIRE Number Calculator",
  description:
    "Calculate your FIRE number: how much you need to save for financial independence and early retirement. Uses 4% safe withdrawal rule.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FIRE number calculator",
    "financial independence number",
    "early retirement calculator",
    "FI number",
    "how much to retire",
  ],
  variants: [
    {
      id: "simple",
      name: "Simple FIRE Number",
      description: "Calculate based on annual expenses",
      fields: [
        {
          name: "annualExpenses",
          label: "Annual Living Expenses",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          suffix: "/year",
        },
        {
          name: "withdrawalRate",
          label: "Safe Withdrawal Rate",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "%",
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const expenses = parseFloat(inputs.annualExpenses as string) || 50000;
        const rate = parseFloat(inputs.withdrawalRate as string) || 4;

        const fireNumber = (expenses / (rate / 100));
        const yearsToSave = 25; // Rule of thumb
        const monthlySavingsNeeded = (fireNumber / yearsToSave) / 12;

        return {
          primary: { label: "FIRE Number (25x Rule)", value: `$${formatNumber(fireNumber, 0)}` },
          details: [
            { label: "Annual expenses", value: `$${formatNumber(expenses, 0)}` },
            { label: "Withdrawal rate", value: `${rate}%` },
            { label: "Portfolio needed", value: `$${formatNumber(fireNumber, 0)}` },
            { label: "Years to save (typical)", value: `${yearsToSave}` },
            { label: "Monthly savings needed", value: `$${formatNumber(monthlySavingsNeeded, 0)}` },
            { label: "Annual income (4% SWR)", value: `$${formatNumber(fireNumber * (rate / 100), 0)}` },
          ],
          note: "4% rule assumes 30+ year retirement. Adjust based on your time horizon and risk tolerance.",
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed FIRE Calculation",
      description: "Account for inflation and investment returns",
      fields: [
        {
          name: "currentExpenses",
          label: "Current Annual Expenses",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
        },
        {
          name: "yearsUntilRetirement",
          label: "Years Until Retirement",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "inflationRate",
          label: "Expected Inflation Rate",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
        },
        {
          name: "investmentReturn",
          label: "Expected Investment Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
        },
      ],
      calculate: (inputs) => {
        const currentExpenses = parseFloat(inputs.currentExpenses as string) || 40000;
        const yearsToRetire = parseFloat(inputs.yearsUntilRetirement as string) || 20;
        const inflation = parseFloat(inputs.inflationRate as string) || 3;
        const investmentReturn = parseFloat(inputs.investmentReturn as string) || 7;

        // Future expenses accounting for inflation
        const futureExpenses = currentExpenses * Math.pow(1 + inflation / 100, yearsToRetire);

        // FIRE number with 4% withdrawal rate
        const fireNumber = futureExpenses / 0.04;

        // Real return (after inflation)
        const realReturn = investmentReturn - inflation;
        const monthlyReturn = Math.pow(1 + realReturn / 100, 1 / 12) - 1;

        // Monthly savings needed to reach FIRE number
        const months = yearsToRetire * 12;
        const monthlySavings = (fireNumber * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);

        return {
          primary: { label: "FIRE Target (Inflation-Adjusted)", value: `$${formatNumber(fireNumber, 0)}` },
          details: [
            { label: "Current expenses", value: `$${formatNumber(currentExpenses, 0)}` },
            { label: "Expenses in", value: `${yearsToRetire} years: $${formatNumber(futureExpenses, 0)}` },
            { label: "Inflation rate", value: `${inflation}%` },
            { label: "Real return (after inflation)", value: `${formatNumber(realReturn, 2)}%` },
            { label: "FIRE number needed", value: `$${formatNumber(fireNumber, 0)}` },
            { label: "Monthly savings required", value: `$${formatNumber(monthlySavings, 0)}` },
            { label: "Annual savings required", value: `$${formatNumber(monthlySavings * 12, 0)}` },
          ],
          note: "Assumes consistent returns and savings. Market volatility and life changes may affect outcomes.",
        };
      },
    },
  ],
  relatedSlugs: ["fatfire-calculator", "leanfire-calculator", "years-to-fire-calculator"],
  faq: [
    {
      question: "What is the 4% rule?",
      answer:
        "The 4% rule states you can withdraw 4% of your portfolio in the first year of retirement, then adjust for inflation. Based on historical market data, this has ~95% success rate over 30-year retirements.",
    },
    {
      question: "Is the 4% rule still safe?",
      answer:
        "For 30+ year retirements in 2026: mostly yes, though some recommend 3-3.5% for safety. For 60+ year retirements or uncertain markets, consider 3% or less.",
    },
    {
      question: "How does the 25x rule work?",
      answer:
        "25x your annual expenses = your FIRE number. This comes from the 4% withdrawal rate: need $25 to safely withdraw $1/year. Example: $50k expenses needs $1.25M portfolio.",
    },
  ],
  formula: "FIRE Number = Annual Expenses ÷ (Withdrawal Rate ÷ 100)",
};
