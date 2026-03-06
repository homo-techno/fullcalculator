import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementIncomeGapCalculator: CalculatorDefinition = {
  slug: "retirement-income-gap-calculator",
  title: "Retirement Income Gap Calculator",
  description: "Calculate the gap between your expected retirement expenses and projected income sources to determine how much additional savings you need.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement income gap","retirement shortfall","retirement savings gap","income gap analysis"],
  variants: [{
    id: "standard",
    name: "Retirement Income Gap",
    description: "Calculate the gap between your expected retirement expenses and projected income sources to determine how much additional savings you need.",
    fields: [
      { name: "monthlyExpenses", label: "Expected Monthly Expenses in Retirement ($)", type: "number", min: 500, max: 50000, defaultValue: 5000 },
      { name: "socialSecurity", label: "Monthly Social Security ($)", type: "number", min: 0, max: 10000, defaultValue: 2000 },
      { name: "pensionIncome", label: "Monthly Pension Income ($)", type: "number", min: 0, max: 20000, defaultValue: 0 },
      { name: "otherIncome", label: "Other Monthly Income ($)", type: "number", min: 0, max: 20000, defaultValue: 500 },
      { name: "yearsInRetirement", label: "Expected Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const expenses = inputs.monthlyExpenses as number;
    const ss = inputs.socialSecurity as number;
    const pension = inputs.pensionIncome as number;
    const other = inputs.otherIncome as number;
    const years = inputs.yearsInRetirement as number;
    const totalMonthlyIncome = ss + pension + other;
    const monthlyGap = Math.max(0, expenses - totalMonthlyIncome);
    const annualGap = monthlyGap * 12;
    const totalGapOverRetirement = annualGap * years;
    const coveragePct = expenses > 0 ? (totalMonthlyIncome / expenses) * 100 : 0;
    return {
      primary: { label: "Monthly Income Gap", value: "$" + formatNumber(Math.round(monthlyGap)) },
      details: [
        { label: "Total Monthly Income", value: "$" + formatNumber(Math.round(totalMonthlyIncome)) },
        { label: "Monthly Expenses", value: "$" + formatNumber(Math.round(expenses)) },
        { label: "Annual Gap", value: "$" + formatNumber(Math.round(annualGap)) },
        { label: "Total Gap Over Retirement", value: "$" + formatNumber(Math.round(totalGapOverRetirement)) },
        { label: "Income Coverage", value: formatNumber(Math.round(coveragePct * 10) / 10) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-calculator","retirement-tax-calculator"],
  faq: [
    { question: "What is a retirement income gap?", answer: "A retirement income gap is the difference between your expected monthly expenses and guaranteed income sources like Social Security and pensions. This gap must be filled by savings withdrawals, investments, or other means." },
    { question: "How much should I plan for retirement expenses?", answer: "A common guideline is to plan for 70 to 80 percent of your pre-retirement income, but actual needs vary. Healthcare, travel, and hobbies may increase costs, while reduced commuting and work expenses may lower them." },
    { question: "How can I close my retirement income gap?", answer: "Options include saving more aggressively, delaying retirement, working part-time, reducing planned expenses, investing for growth, purchasing an annuity, or downsizing your home to free up equity." },
  ],
  formula: "Monthly Gap = Monthly Expenses - (Social Security + Pension + Other Income)
Annual Gap = Monthly Gap x 12
Total Gap = Annual Gap x Years in Retirement",
};
