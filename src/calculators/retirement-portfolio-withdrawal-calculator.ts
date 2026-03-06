import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementPortfolioWithdrawalCalculator: CalculatorDefinition = {
  slug: "retirement-portfolio-withdrawal-calculator",
  title: "Retirement Portfolio Withdrawal Calculator",
  description: "Calculate sustainable withdrawal amounts from your retirement portfolio using various withdrawal rate strategies while accounting for inflation and investment returns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement withdrawal rate","safe withdrawal rate","portfolio withdrawal calculator","4 percent rule calculator"],
  variants: [{
    id: "standard",
    name: "Retirement Portfolio Withdrawal",
    description: "Calculate sustainable withdrawal amounts from your retirement portfolio using various withdrawal rate strategies while accounting for inflation and investment returns.",
    fields: [
      { name: "portfolioBalance", label: "Portfolio Balance ($)", type: "number", min: 10000, max: 50000000, defaultValue: 1000000 },
      { name: "withdrawalRate", label: "Annual Withdrawal Rate (%)", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 0, max: 15, defaultValue: 6 },
      { name: "inflationRate", label: "Expected Inflation (%)", type: "number", min: 0, max: 10, defaultValue: 3 },
      { name: "retirementYears", label: "Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const balance = inputs.portfolioBalance as number;
    const wr = inputs.withdrawalRate as number / 100;
    const returnRate = inputs.expectedReturn as number / 100;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.retirementYears as number;
    const firstYearWithdrawal = balance * wr;
    const monthlyWithdrawal = firstYearWithdrawal / 12;
    let remaining = balance;
    let totalWithdrawn = 0;
    let yearsDepleted = years;
    for (let y = 0; y < years; y++) {
      const withdrawal = firstYearWithdrawal * Math.pow(1 + inflation, y);
      remaining = remaining * (1 + returnRate) - withdrawal;
      totalWithdrawn += withdrawal;
      if (remaining <= 0) { yearsDepleted = y + 1; break; }
    }
    const endBalance = Math.max(0, remaining);
    const realReturn = returnRate - inflation;
    return {
      primary: { label: "First Year Withdrawal", value: "$" + formatNumber(Math.round(firstYearWithdrawal)) },
      details: [
        { label: "Monthly Withdrawal", value: "$" + formatNumber(Math.round(monthlyWithdrawal)) },
        { label: "Portfolio Lasts", value: formatNumber(yearsDepleted) + " years" },
        { label: "Ending Balance", value: "$" + formatNumber(Math.round(endBalance)) },
        { label: "Total Withdrawn", value: "$" + formatNumber(Math.round(totalWithdrawn)) },
        { label: "Real Return (after inflation)", value: formatNumber(Math.round(realReturn * 1000) / 10) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","retirement-income-calculator"],
  faq: [
    { question: "What is the 4 percent rule?", answer: "The 4 percent rule suggests withdrawing 4 percent of your portfolio in the first year of retirement, then adjusting that dollar amount for inflation each year. Research by William Bengen found this approach historically sustained portfolios for at least 30 years." },
    { question: "Is the 4 percent rule still valid?", answer: "Some financial planners now suggest a more conservative 3 to 3.5 percent rate due to lower expected future returns and longer retirements. Others argue that flexible spending strategies can support higher initial rates." },
    { question: "What happens if the market drops early in retirement?", answer: "Poor returns early in retirement, known as sequence-of-returns risk, can significantly impact portfolio longevity. A major market decline in the first few years of retirement can deplete a portfolio much faster than the same decline later." },
  ],
  formula: "First Year Withdrawal = Portfolio Balance x Withdrawal Rate; Each Year: Portfolio = Previous Balance x (1 + Return) - Inflation-Adjusted Withdrawal; Portfolio Lasts Until Balance Reaches Zero",
};
