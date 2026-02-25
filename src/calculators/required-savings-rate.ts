import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const requiredSavingsRateCalculator: CalculatorDefinition = {
  slug: "required-savings-rate-calculator",
  title: "Required Savings Rate Calculator",
  description:
    "Calculate the savings rate you need to reach your retirement goal. Determine what percentage of income to save based on your age, income, and target retirement age.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["savings rate", "retirement savings", "percent to save", "income saving", "retirement goal"],
  variants: [
    {
      id: "requiredRate",
      name: "Required Savings Rate",
      fields: [
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 30" },
        { name: "retirementAge", label: "Retirement Age", type: "number", placeholder: "e.g. 65" },
        { name: "annualIncome", label: "Annual Gross Income ($)", type: "number", placeholder: "e.g. 80000" },
        { name: "currentSavings", label: "Current Retirement Savings ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "retirementTarget", label: "Retirement Savings Target ($)", type: "number", placeholder: "e.g. 1500000" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "salaryGrowth", label: "Expected Salary Growth (%)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const retirementAge = inputs.retirementAge as number;
        const annualIncome = inputs.annualIncome as number;
        const currentSavings = inputs.currentSavings as number || 0;
        const retirementTarget = inputs.retirementTarget as number;
        const returnRate = (inputs.returnRate as number) / 100;
        const salaryGrowth = (inputs.salaryGrowth as number) / 100;

        if (!currentAge || !retirementAge || !annualIncome || !retirementTarget || !returnRate) return null;

        const years = retirementAge - currentAge;
        const futureValueOfCurrent = currentSavings * Math.pow(1 + returnRate, years);
        const remainingTarget = Math.max(retirementTarget - futureValueOfCurrent, 0);

        // Binary search for required savings rate
        let low = 0;
        let high = 1;
        let savingsRate = 0.15;

        for (let iter = 0; iter < 100; iter++) {
          savingsRate = (low + high) / 2;
          let totalSaved = 0;
          let salary = annualIncome;

          for (let i = 0; i < years; i++) {
            totalSaved = (totalSaved + salary * savingsRate) * (1 + returnRate);
            salary *= (1 + salaryGrowth);
          }

          if (totalSaved < remainingTarget) {
            low = savingsRate;
          } else {
            high = savingsRate;
          }
        }

        const monthlyAmount = annualIncome * savingsRate / 12;
        const annualAmount = annualIncome * savingsRate;

        // Calculate if employer match could help
        const withMatch = savingsRate * 0.75; // assumes typical employer match reduces burden

        return {
          primary: { label: "Required Savings Rate", value: `${formatNumber(savingsRate * 100, 1)}%` },
          details: [
            { label: "Monthly Savings Needed", value: `$${formatNumber(monthlyAmount, 2)}` },
            { label: "Annual Savings Needed", value: `$${formatNumber(annualAmount, 2)}` },
            { label: "Future Value of Current Savings", value: `$${formatNumber(futureValueOfCurrent, 0)}` },
            { label: "Additional Savings Needed", value: `$${formatNumber(remainingTarget, 0)}` },
            { label: "Retirement Target", value: `$${formatNumber(retirementTarget, 0)}` },
            { label: "With Employer Match (est.)", value: `~${formatNumber(withMatch * 100, 1)}% of your salary` },
          ],
        };
      },
    },
    {
      id: "rateByAge",
      name: "Savings Rate by Starting Age",
      fields: [
        { name: "retirementAge", label: "Retirement Age", type: "number", placeholder: "e.g. 65" },
        { name: "incomeReplacementRate", label: "Income Replacement Rate (%)", type: "number", placeholder: "e.g. 80" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "retirementYears", label: "Years in Retirement", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const retirementAge = inputs.retirementAge as number || 65;
        const incomeReplacementRate = (inputs.incomeReplacementRate as number) / 100;
        const returnRate = (inputs.returnRate as number) / 100;
        const retirementYears = inputs.retirementYears as number || 25;

        if (!incomeReplacementRate || !returnRate) return null;

        const ssReplacementEstimate = 0.35;
        const portfolioReplacementNeeded = incomeReplacementRate - ssReplacementEstimate;
        const withdrawalRate = 0.04;

        const ages = [25, 30, 35, 40, 45, 50];
        const rates = ages.map((startAge) => {
          const years = retirementAge - startAge;
          const fvFactor = (Math.pow(1 + returnRate, years) - 1) / returnRate;
          const targetMultiple = portfolioReplacementNeeded / withdrawalRate;
          const rate = targetMultiple / fvFactor;
          return { age: startAge, rate: Math.min(rate * 100, 100) };
        });

        return {
          primary: { label: "Starting at 25: Savings Rate", value: `${formatNumber(rates[0].rate, 1)}%` },
          details: rates.map((r) => ({
            label: `Start at Age ${r.age}`,
            value: `${formatNumber(r.rate, 1)}% of income`,
          })),
        };
      },
    },
  ],
  relatedSlugs: ["retirement-savings-needed-calculator", "fire-number-calculator", "retirement-gap-calculator", "retirement-calculator"],
  faq: [
    { question: "What savings rate do I need for retirement?", answer: "Financial experts typically recommend saving 15-20% of gross income for retirement. However, the exact rate depends on your starting age, current savings, desired retirement lifestyle, and expected returns." },
    { question: "Does the savings rate include employer match?", answer: "Your total savings rate should include both your contribution and employer match. If your employer matches 3% and you need a 15% total rate, you need to contribute 12% yourself." },
  ],
  formula: "Required Rate found via iterative calculation: Target = Σ (Salary × Rate × (1 + return)^i) + Current Savings × (1 + return)^years",
};
