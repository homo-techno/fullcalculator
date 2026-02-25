import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leanFireCalculator: CalculatorDefinition = {
  slug: "lean-fire-calculator",
  title: "Lean FIRE Calculator",
  description:
    "Calculate your Lean FIRE number based on minimal living expenses. Plan for early retirement with a frugal lifestyle and lower savings target.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Lean FIRE", "frugal retirement", "minimal expenses", "early retirement", "financial independence"],
  variants: [
    {
      id: "leanFireNumber",
      name: "Lean FIRE Number",
      fields: [
        { name: "housing", label: "Monthly Housing Cost ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "food", label: "Monthly Food Cost ($)", type: "number", placeholder: "e.g. 400" },
        { name: "transportation", label: "Monthly Transportation ($)", type: "number", placeholder: "e.g. 200" },
        { name: "healthcare", label: "Monthly Healthcare ($)", type: "number", placeholder: "e.g. 300" },
        { name: "utilities", label: "Monthly Utilities ($)", type: "number", placeholder: "e.g. 150" },
        { name: "otherEssentials", label: "Monthly Other Essentials ($)", type: "number", placeholder: "e.g. 200" },
        { name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", placeholder: "e.g. 4" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 100000" },
      ],
      calculate: (inputs) => {
        const housing = inputs.housing as number || 0;
        const food = inputs.food as number || 0;
        const transportation = inputs.transportation as number || 0;
        const healthcare = inputs.healthcare as number || 0;
        const utilities = inputs.utilities as number || 0;
        const otherEssentials = inputs.otherEssentials as number || 0;
        const withdrawalRate = (inputs.withdrawalRate as number) || 4;
        const currentSavings = inputs.currentSavings as number || 0;

        const monthlyExpenses = housing + food + transportation + healthcare + utilities + otherEssentials;
        const annualExpenses = monthlyExpenses * 12;

        if (annualExpenses === 0) return null;

        const leanFireNumber = annualExpenses / (withdrawalRate / 100);
        const progress = (currentSavings / leanFireNumber) * 100;
        const gap = Math.max(leanFireNumber - currentSavings, 0);

        return {
          primary: { label: "Lean FIRE Number", value: `$${formatNumber(leanFireNumber, 0)}` },
          details: [
            { label: "Monthly Essential Expenses", value: `$${formatNumber(monthlyExpenses, 2)}` },
            { label: "Annual Essential Expenses", value: `$${formatNumber(annualExpenses, 0)}` },
            { label: "Current Progress", value: `${formatNumber(progress, 1)}%` },
            { label: "Remaining Gap", value: `$${formatNumber(gap, 0)}` },
            { label: "Monthly Withdrawal in Retirement", value: `$${formatNumber(monthlyExpenses, 2)}` },
          ],
        };
      },
    },
    {
      id: "timeline",
      name: "Lean FIRE Timeline",
      fields: [
        { name: "leanExpenses", label: "Annual Lean Expenses ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "annualSavings", label: "Annual Savings ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const leanExpenses = inputs.leanExpenses as number;
        const currentSavings = inputs.currentSavings as number || 0;
        const annualSavings = inputs.annualSavings as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const currentAge = inputs.currentAge as number;

        if (!leanExpenses || !annualSavings || !returnRate || !currentAge) return null;

        const leanFireTarget = leanExpenses / 0.04;
        let balance = currentSavings;
        let years = 0;

        while (balance < leanFireTarget && years < 100) {
          balance = (balance + annualSavings) * (1 + returnRate);
          years++;
        }

        const fireAge = years < 100 ? currentAge + years : -1;
        const savingsRate = annualSavings / (annualSavings + leanExpenses) * 100;

        return {
          primary: { label: "Years to Lean FIRE", value: years < 100 ? `${years}` : "100+" },
          details: [
            { label: "Lean FIRE Age", value: fireAge > 0 ? `${fireAge}` : "N/A" },
            { label: "Lean FIRE Target", value: `$${formatNumber(leanFireTarget, 0)}` },
            { label: "Projected Portfolio at Lean FIRE", value: `$${formatNumber(balance, 0)}` },
            { label: "Current Savings Rate", value: `${formatNumber(savingsRate, 1)}%` },
            { label: "Monthly Lean Budget", value: `$${formatNumber(leanExpenses / 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "coast-fire-calculator", "barista-fire-calculator", "retirement-gap-calculator"],
  faq: [
    { question: "What is Lean FIRE?", answer: "Lean FIRE is a version of Financial Independence, Retire Early that focuses on minimal living expenses, typically under $40,000-$50,000 per year for a household. It requires a smaller portfolio but demands a more frugal lifestyle in retirement." },
    { question: "How is Lean FIRE different from regular FIRE?", answer: "Lean FIRE targets only essential expenses, while regular FIRE includes discretionary spending. Lean FIRE numbers are lower (often $625K-$1.25M) compared to regular FIRE, making it achievable sooner." },
  ],
  formula: "Lean FIRE Number = Annual Essential Expenses / Safe Withdrawal Rate",
};
