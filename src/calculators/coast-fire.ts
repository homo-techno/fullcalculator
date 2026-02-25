import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coastFireCalculator: CalculatorDefinition = {
  slug: "coast-fire-calculator",
  title: "Coast FIRE Calculator",
  description:
    "Calculate your Coast FIRE number - the amount you need saved now so that compound growth alone will fund your retirement, even if you never save another dollar.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Coast FIRE", "coast fire number", "financial independence", "compound growth", "retirement savings"],
  variants: [
    {
      id: "coastFireNumber",
      name: "Coast FIRE Number",
      fields: [
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 30" },
        { name: "retirementAge", label: "Target Retirement Age", type: "number", placeholder: "e.g. 65" },
        { name: "annualExpensesRetirement", label: "Annual Expenses in Retirement ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", placeholder: "e.g. 4" },
        { name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "currentSavings", label: "Current Retirement Savings ($)", type: "number", placeholder: "e.g. 150000" },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const retirementAge = inputs.retirementAge as number;
        const annualExpensesRetirement = inputs.annualExpensesRetirement as number;
        const withdrawalRate = (inputs.withdrawalRate as number) || 4;
        const expectedReturn = (inputs.expectedReturn as number) / 100;
        const currentSavings = inputs.currentSavings as number || 0;

        if (!currentAge || !retirementAge || !annualExpensesRetirement || !expectedReturn) return null;

        const yearsToRetirement = retirementAge - currentAge;
        const fireNumber = annualExpensesRetirement / (withdrawalRate / 100);
        const coastFireNumber = fireNumber / Math.pow(1 + expectedReturn, yearsToRetirement);
        const isCoastFire = currentSavings >= coastFireNumber;
        const gap = coastFireNumber - currentSavings;
        const futureValueOfCurrent = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);

        return {
          primary: { label: "Coast FIRE Number", value: `$${formatNumber(coastFireNumber, 0)}` },
          details: [
            { label: "Status", value: isCoastFire ? "You've reached Coast FIRE!" : "Not yet at Coast FIRE" },
            { label: "Target FIRE Number at Retirement", value: `$${formatNumber(fireNumber, 0)}` },
            { label: "Current Savings Gap", value: isCoastFire ? "$0" : `$${formatNumber(gap, 0)}` },
            { label: "Current Savings Future Value", value: `$${formatNumber(futureValueOfCurrent, 0)}` },
            { label: "Years to Retirement", value: `${yearsToRetirement}` },
          ],
        };
      },
    },
    {
      id: "coastFireAge",
      name: "Coast FIRE by Age",
      fields: [
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 25" },
        { name: "currentSavings", label: "Current Savings ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "annualSavings", label: "Annual Savings ($)", type: "number", placeholder: "e.g. 20000" },
        { name: "retirementAge", label: "Target Retirement Age", type: "number", placeholder: "e.g. 65" },
        { name: "annualExpenses", label: "Annual Retirement Expenses ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const currentSavings = inputs.currentSavings as number || 0;
        const annualSavings = inputs.annualSavings as number;
        const retirementAge = inputs.retirementAge as number;
        const annualExpenses = inputs.annualExpenses as number;
        const returnRate = (inputs.returnRate as number) / 100;

        if (!currentAge || !annualSavings || !retirementAge || !annualExpenses || !returnRate) return null;

        const fireNumber = annualExpenses / 0.04;
        let balance = currentSavings;
        let coastFireAge = -1;

        for (let age = currentAge; age <= retirementAge; age++) {
          const yearsLeft = retirementAge - age;
          const coastTarget = fireNumber / Math.pow(1 + returnRate, yearsLeft);
          if (balance >= coastTarget && coastFireAge === -1) {
            coastFireAge = age;
          }
          balance = (balance + annualSavings) * (1 + returnRate);
        }

        const yearsOfSaving = coastFireAge > 0 ? coastFireAge - currentAge : -1;
        const coastTarget = coastFireAge > 0 ? fireNumber / Math.pow(1 + returnRate, retirementAge - coastFireAge) : 0;

        return {
          primary: { label: "Coast FIRE Age", value: coastFireAge > 0 ? `${coastFireAge}` : "Not reachable before retirement" },
          details: [
            { label: "Years of Saving Needed", value: yearsOfSaving >= 0 ? `${yearsOfSaving}` : "N/A" },
            { label: "Savings at Coast FIRE Age", value: coastFireAge > 0 ? `$${formatNumber(coastTarget, 0)}` : "N/A" },
            { label: "Target FIRE Number", value: `$${formatNumber(fireNumber, 0)}` },
            { label: "Final Portfolio (if keep saving)", value: `$${formatNumber(balance, 0)}` },
            { label: "Years Could Stop Saving Early", value: coastFireAge > 0 ? `${retirementAge - coastFireAge}` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "lean-fire-calculator", "barista-fire-calculator", "retirement-savings-needed-calculator"],
  faq: [
    { question: "What is Coast FIRE?", answer: "Coast FIRE means you've saved enough that compound growth alone will grow your portfolio to your retirement goal by your target retirement age, without any additional contributions. You can 'coast' by just covering your current expenses." },
    { question: "How is Coast FIRE different from regular FIRE?", answer: "Regular FIRE means you can retire now and live off investments. Coast FIRE means your investments will grow to support retirement by a target age, but you still need to work to cover current expenses (just not save more for retirement)." },
  ],
  formula: "Coast FIRE Number = FIRE Number / (1 + return)^years to retirement",
};
