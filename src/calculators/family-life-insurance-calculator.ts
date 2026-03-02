import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyLifeInsuranceCalculator: CalculatorDefinition = {
  slug: "family-life-insurance-calculator",
  title: "Family Life Insurance Needs Calculator",
  description: "Calculate how much life insurance coverage your family needs based on income replacement, debts, education funding, and final expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["life insurance needs","family insurance","insurance coverage calculator","income replacement","death benefit"],
  variants: [{
    id: "standard",
    name: "Family Life Insurance Needs",
    description: "Calculate how much life insurance coverage your family needs based on income replacement, debts, education funding, and final expenses.",
    fields: [
      { name: "annualIncome", label: "Annual Income to Replace ($)", type: "number", min: 20000, max: 500000, defaultValue: 75000 },
      { name: "yearsToReplace", label: "Years of Income Needed", type: "number", min: 5, max: 30, defaultValue: 15 },
      { name: "totalDebts", label: "Total Outstanding Debts ($)", type: "number", min: 0, max: 1000000, defaultValue: 250000 },
      { name: "childEducation", label: "Education Fund Per Child ($)", type: "number", min: 0, max: 200000, defaultValue: 80000 },
      { name: "numChildren", label: "Number of Children", type: "number", min: 0, max: 8, defaultValue: 2 },
      { name: "existingCoverage", label: "Existing Life Insurance ($)", type: "number", min: 0, max: 2000000, defaultValue: 100000 },
    ],
    calculate: (inputs) => {
    const annualIncome = inputs.annualIncome as number;
    const yearsToReplace = inputs.yearsToReplace as number;
    const totalDebts = inputs.totalDebts as number;
    const childEducation = inputs.childEducation as number;
    const numChildren = inputs.numChildren as number;
    const existingCoverage = inputs.existingCoverage as number;
    const incomeNeeds = annualIncome * yearsToReplace;
    const educationNeeds = childEducation * numChildren;
    const finalExpenses = 15000;
    const totalNeeds = incomeNeeds + totalDebts + educationNeeds + finalExpenses;
    const additionalNeeded = Math.max(0, totalNeeds - existingCoverage);
    const estMonthlyPremium20yr = (additionalNeeded / 1000) * 0.55;
    return {
      primary: { label: "Total Insurance Needed", value: "$" + formatNumber(Math.round(totalNeeds)) },
      details: [
        { label: "Income Replacement", value: "$" + formatNumber(Math.round(incomeNeeds)) },
        { label: "Debt Payoff", value: "$" + formatNumber(Math.round(totalDebts)) },
        { label: "Education Funding", value: "$" + formatNumber(Math.round(educationNeeds)) },
        { label: "Final Expenses", value: "$" + formatNumber(finalExpenses) },
        { label: "Additional Coverage Needed", value: "$" + formatNumber(Math.round(additionalNeeded)) },
        { label: "Est. Monthly Premium (20-yr term)", value: "$" + formatNumber(Math.round(estMonthlyPremium20yr)) }
      ]
    };
  },
  }],
  relatedSlugs: ["estate-planning-cost-calculator","family-emergency-fund-calculator","maternity-leave-pay-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Needs = (Annual Income x Years) + Debts + (Education x Children) + Final Expenses
Additional Needed = Total Needs - Existing Coverage",
};
