import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const realHourlyWageCalculator: CalculatorDefinition = {
  slug: "real-hourly-wage-calculator",
  title: "Real Hourly Wage Calculator",
  description: "Calculate your true hourly wage after accounting for commute time, work expenses, and unpaid preparation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["real hourly wage", "true hourly rate", "actual wage calculator"],
  variants: [{
    id: "standard",
    name: "Real Hourly Wage",
    description: "Calculate your true hourly wage after accounting for commute time, work expenses, and unpaid preparation",
    fields: [
      { name: "annualSalary", label: "Annual After-Tax Income", type: "number", prefix: "$", min: 10000, max: 500000, step: 1000, defaultValue: 50000 },
      { name: "weeklyHoursWorked", label: "Weekly Hours at Work", type: "number", suffix: "hours", min: 10, max: 80, defaultValue: 45 },
      { name: "weeklyCommuteHours", label: "Weekly Commute Time", type: "number", suffix: "hours", min: 0, max: 30, step: 0.5, defaultValue: 5 },
      { name: "monthlyWorkExpenses", label: "Monthly Work-Related Expenses", type: "number", prefix: "$", min: 0, max: 5000, step: 50, defaultValue: 400 },
    ],
    calculate: (inputs) => {
      const salary = inputs.annualSalary as number;
      const workHours = inputs.weeklyHoursWorked as number;
      const commuteHours = inputs.weeklyCommuteHours as number;
      const expenses = inputs.monthlyWorkExpenses as number;
      if (!salary || !workHours || salary <= 0 || workHours <= 0) return null;
      const annualExpenses = (expenses || 0) * 12;
      const netIncome = salary - annualExpenses;
      const totalWeeklyHours = workHours + (commuteHours || 0);
      const weeksPerYear = 50;
      const totalAnnualHours = totalWeeklyHours * weeksPerYear;
      const realHourlyWage = netIncome / totalAnnualHours;
      const nominalHourly = salary / (workHours * weeksPerYear);
      const reduction = ((nominalHourly - realHourlyWage) / nominalHourly) * 100;
      return {
        primary: { label: "Real Hourly Wage", value: "$" + formatNumber(Math.round(realHourlyWage * 100) / 100) },
        details: [
          { label: "Nominal Hourly Rate", value: "$" + formatNumber(Math.round(nominalHourly * 100) / 100) },
          { label: "Wage Reduction", value: formatNumber(Math.round(reduction)) + "% lower than nominal" },
          { label: "Annual Work Expenses", value: "$" + formatNumber(Math.round(annualExpenses)) },
        ],
      };
    },
  }],
  relatedSlugs: ["hourly-rate-calculator", "cost-per-hire-calculator"],
  faq: [
    { question: "What is a real hourly wage?", answer: "The real hourly wage is your actual take-home pay divided by all the hours dedicated to work, including commute time, preparation, and work-related errands. It reveals the true value of each hour spent on employment." },
    { question: "What expenses should be included in the real wage calculation?", answer: "Include commuting costs (gas, transit, parking), work clothing, meals bought at work, childcare needed for work hours, professional development costs, and any tools or equipment you pay for yourself." },
  ],
  formula: "Real Hourly Wage = (After-Tax Income - Annual Work Expenses) / (Weekly Work Hours + Commute Hours) x 50 weeks",
};
