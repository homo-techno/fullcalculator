import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engagementRingAffordabilityCalculator: CalculatorDefinition = {
  slug: "engagement-ring-affordability-calculator",
  title: "Engagement Ring Affordability Calculator",
  description: "Determine how much engagement ring you can afford based on income, savings, financing options, and monthly payment capacity.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["engagement ring affordability","ring budget","engagement ring cost","how much to spend on ring"],
  variants: [{
    id: "standard",
    name: "Engagement Ring Affordability",
    description: "Determine how much engagement ring you can afford based on income, savings, financing options, and monthly payment capacity.",
    fields: [
      { name: "annualIncome", label: "Annual Income ($)", type: "number", min: 15000, max: 500000, defaultValue: 65000 },
      { name: "monthlySavings", label: "Monthly Savings Available ($)", type: "number", min: 0, max: 5000, defaultValue: 300 },
      { name: "savedSoFar", label: "Already Saved ($)", type: "number", min: 0, max: 50000, defaultValue: 1000 },
      { name: "monthsToSave", label: "Months Until Purchase", type: "number", min: 0, max: 24, defaultValue: 6 },
      { name: "financingMonths", label: "Financing Term (0 if none)", type: "number", min: 0, max: 36, defaultValue: 0 },
      { name: "financingRate", label: "Financing APR (%)", type: "number", min: 0, max: 30, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const income = inputs.annualIncome as number;
    const monthlySave = inputs.monthlySavings as number;
    const saved = inputs.savedSoFar as number;
    const months = inputs.monthsToSave as number;
    const finMonths = inputs.financingMonths as number;
    const apr = inputs.financingRate as number;
    const totalSaved = saved + (monthlySave * months);
    const oneMonthRule = Math.round(income / 12);
    const twoMonthRule = Math.round(income / 6);
    const threeMonthRule = Math.round(income / 4);
    let financedBudget = totalSaved;
    if (finMonths > 0) {
      const monthlyRate = apr / 100 / 12;
      if (monthlyRate > 0) {
        financedBudget = totalSaved + (monthlySave * ((1 - Math.pow(1 + monthlyRate, -finMonths)) / monthlyRate));
      } else {
        financedBudget = totalSaved + (monthlySave * finMonths);
      }
    }
    return {
      primary: { label: "Cash Budget", value: "$" + formatNumber(Math.round(totalSaved)) },
      details: [
        { label: "With Financing", value: "$" + formatNumber(Math.round(financedBudget)) },
        { label: "1-Month Salary Rule", value: "$" + formatNumber(oneMonthRule) },
        { label: "2-Month Salary Rule", value: "$" + formatNumber(twoMonthRule) },
        { label: "3-Month Salary Rule", value: "$" + formatNumber(threeMonthRule) },
        { label: "Monthly Savings Potential", value: "$" + formatNumber(monthlySave) + "/mo" }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","wedding-registry-value-calculator","honeymoon-budget-planner-calculator"],
  faq: [
    { question: "How much should you spend on an engagement ring?", answer: "The old rule of 2-3 months salary is outdated. Financial experts suggest spending what you can comfortably afford without going into debt, typically 1-2 months of income." },
    { question: "Is financing an engagement ring a good idea?", answer: "0% financing can be smart if you pay it off on time. Avoid high-interest financing as a $5,000 ring at 20% APR over 3 years costs over $6,700 total." },
    { question: "What is the average engagement ring cost?", answer: "The average engagement ring costs $5,000 to $7,000 in the US. However, beautiful rings are available at every price point from $500 and up." },
  ],
  formula: "Cash Budget = AlreadySaved + (MonthlySavings x MonthsToSave); Financed = CashBudget + MonthlySavings x ((1 - (1+r)^-n) / r); Salary Rules: 1-month, 2-month, 3-month comparisons",
};
