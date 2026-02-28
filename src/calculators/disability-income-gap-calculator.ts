import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disabilityIncomeGapCalculator: CalculatorDefinition = {
  slug: "disability-income-gap-calculator",
  title: "Disability Income Gap Calculator",
  description: "Free disability insurance gap calculator. Calculate the shortfall between your expenses and disability coverage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["disability income gap calculator", "disability insurance calculator", "income protection gap calculator"],
  variants: [{
    id: "standard",
    name: "Disability Income Gap",
    description: "Free disability insurance gap calculator",
    fields: [
      { name: "monthlyExpenses", label: "Monthly Essential Expenses", type: "number", prefix: "$", min: 0 },
      { name: "grossSalary", label: "Monthly Gross Salary", type: "number", prefix: "$", min: 0 },
      { name: "employerCoverage", label: "Employer STD/LTD Coverage %", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 60 },
      { name: "otherIncome", label: "Other Monthly Income (savings, spouse)", type: "number", prefix: "$", min: 0, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const expenses = inputs.monthlyExpenses as number;
      const salary = inputs.grossSalary as number;
      const coverage = (inputs.employerCoverage as number) / 100;
      const other = (inputs.otherIncome as number) || 0;
      if (!expenses || !salary) return null;
      const disabilityIncome = salary * coverage;
      const disabilityTax = disabilityIncome * 0.75;
      const totalAvailable = disabilityTax + other;
      const gap = Math.max(0, expenses - totalAvailable);
      return {
        primary: { label: "Monthly Income Gap", value: "$" + formatNumber(gap) },
        details: [
          { label: "Monthly expenses", value: "$" + formatNumber(expenses) },
          { label: "Disability benefit (gross)", value: "$" + formatNumber(disabilityIncome) },
          { label: "After-tax disability (~75%)", value: "$" + formatNumber(disabilityTax) },
          { label: "Other income", value: "$" + formatNumber(other) },
          { label: "Annual gap", value: "$" + formatNumber(gap * 12) },
        ],
        note: "Employer-paid disability benefits are typically taxable. Individual policies (you pay premiums) provide tax-free benefits.",
      };
    },
  }],
  relatedSlugs: ["life-insurance-needs-calculator", "emergency-fund-calculator"],
  faq: [
    { question: "How much disability insurance do I need?", answer: "Aim to cover 60-70% of gross income. If employer provides 60% STD/LTD, you may still have a gap after taxes, especially with high expenses." },
    { question: "Are disability benefits taxable?", answer: "If your employer pays the premiums, benefits are taxable. If you pay premiums with after-tax dollars, benefits are tax-free." },
  ],
  formula: "Gap = Monthly Expenses - (Salary × Coverage% × 0.75 tax adjustment) - Other Income",
};
