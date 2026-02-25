import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementIncomeCalculator: CalculatorDefinition = {
  slug: "retirement-income-calculator",
  title: "Retirement Income Calculator",
  description:
    "Calculate your total retirement income from all sources including Social Security, pensions, 401(k), IRA, and other investments. Plan your retirement income strategy.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement income", "income planning", "Social Security", "pension income", "withdrawal strategy"],
  variants: [
    {
      id: "incomeBreakdown",
      name: "Income Breakdown",
      fields: [
        { name: "socialSecurity", label: "Monthly Social Security ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "pensionIncome", label: "Monthly Pension ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "retirementSavings", label: "Total Retirement Savings ($)", type: "number", placeholder: "e.g. 800000" },
        { name: "withdrawalRate", label: "Withdrawal Rate (%)", type: "number", placeholder: "e.g. 4" },
        { name: "otherIncome", label: "Other Monthly Income ($)", type: "number", placeholder: "e.g. 500" },
        { name: "monthlyExpenses", label: "Expected Monthly Expenses ($)", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const socialSecurity = inputs.socialSecurity as number || 0;
        const pensionIncome = inputs.pensionIncome as number || 0;
        const retirementSavings = inputs.retirementSavings as number || 0;
        const withdrawalRate = (inputs.withdrawalRate as number) || 4;
        const otherIncome = inputs.otherIncome as number || 0;
        const monthlyExpenses = inputs.monthlyExpenses as number || 0;

        const annualWithdrawal = retirementSavings * (withdrawalRate / 100);
        const monthlyWithdrawal = annualWithdrawal / 12;
        const totalMonthlyIncome = socialSecurity + pensionIncome + monthlyWithdrawal + otherIncome;
        const totalAnnualIncome = totalMonthlyIncome * 12;
        const monthlyGap = monthlyExpenses - totalMonthlyIncome;
        const incomeReplacementRatio = monthlyExpenses > 0 ? (totalMonthlyIncome / monthlyExpenses) * 100 : 0;

        return {
          primary: { label: "Total Monthly Retirement Income", value: `$${formatNumber(totalMonthlyIncome, 2)}` },
          details: [
            { label: "Annual Retirement Income", value: `$${formatNumber(totalAnnualIncome, 0)}` },
            { label: "Social Security", value: `$${formatNumber(socialSecurity, 2)}/mo` },
            { label: "Pension", value: `$${formatNumber(pensionIncome, 2)}/mo` },
            { label: "Portfolio Withdrawal", value: `$${formatNumber(monthlyWithdrawal, 2)}/mo` },
            { label: "Other Income", value: `$${formatNumber(otherIncome, 2)}/mo` },
            { label: "Monthly Surplus/Gap", value: monthlyGap <= 0 ? `+$${formatNumber(-monthlyGap, 2)} surplus` : `-$${formatNumber(monthlyGap, 2)} gap` },
            { label: "Income-to-Expense Ratio", value: `${formatNumber(incomeReplacementRatio, 1)}%` },
          ],
        };
      },
    },
    {
      id: "portfolioLongevity",
      name: "Portfolio Longevity",
      fields: [
        { name: "portfolioBalance", label: "Portfolio Balance ($)", type: "number", placeholder: "e.g. 800000" },
        { name: "monthlyWithdrawal", label: "Monthly Withdrawal ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 5" },
        { name: "inflationRate", label: "Inflation Rate (%)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const portfolioBalance = inputs.portfolioBalance as number;
        const monthlyWithdrawal = inputs.monthlyWithdrawal as number;
        const returnRate = (inputs.returnRate as number) / 100 / 12;
        const inflationRate = (inputs.inflationRate as number) / 100 / 12;

        if (!portfolioBalance || !monthlyWithdrawal) return null;

        let balance = portfolioBalance;
        let withdrawal = monthlyWithdrawal;
        let months = 0;

        while (balance > 0 && months < 600) {
          balance = balance * (1 + returnRate) - withdrawal;
          withdrawal *= (1 + inflationRate);
          months++;
        }

        const years = months / 12;
        const effectiveRate = (monthlyWithdrawal * 12 / portfolioBalance) * 100;

        return {
          primary: { label: "Portfolio Lasts", value: months < 600 ? `${formatNumber(years, 1)} years` : "50+ years" },
          details: [
            { label: "Initial Monthly Withdrawal", value: `$${formatNumber(monthlyWithdrawal, 2)}` },
            { label: "Effective Withdrawal Rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "Starting Balance", value: `$${formatNumber(portfolioBalance, 0)}` },
            { label: "Total Withdrawn (est.)", value: months < 600 ? `$${formatNumber(monthlyWithdrawal * months * 1.3, 0)}` : "Indefinite" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "social-security-benefit-calculator", "retirement-savings-needed-calculator", "retirement-gap-calculator"],
  faq: [
    { question: "How much income will I need in retirement?", answer: "Most financial planners recommend replacing 70-80% of your pre-retirement income. However, your actual needs depend on your lifestyle, health, location, and whether your home is paid off." },
    { question: "What is a safe withdrawal rate?", answer: "The commonly cited safe withdrawal rate is 4%, meaning you withdraw 4% of your portfolio in the first year and adjust for inflation thereafter. This historically provides a high probability of lasting 30+ years." },
  ],
  formula: "Total Income = Social Security + Pension + (Portfolio × Withdrawal Rate / 12) + Other Income",
};
