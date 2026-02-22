import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turnoverCostCalculator: CalculatorDefinition = {
  slug: "turnover-cost-calculator",
  title: "Employee Turnover Cost Calculator",
  description: "Free employee turnover cost calculator. Estimate the true cost of losing an employee including recruitment, training, lost productivity, and ramp-up time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["turnover cost calculator", "employee turnover", "attrition cost", "replacement cost calculator", "employee retention cost"],
  variants: [
    {
      id: "single",
      name: "Single Employee Turnover Cost",
      description: "Calculate the cost of replacing one employee",
      fields: [
        { name: "annualSalary", label: "Annual Salary", type: "number", placeholder: "e.g. 75000", prefix: "$" },
        { name: "recruitingCost", label: "Recruiting / Job Posting Cost", type: "number", placeholder: "e.g. 5000", prefix: "$", defaultValue: 0 },
        { name: "interviewHours", label: "Total Interview Hours (all staff)", type: "number", placeholder: "e.g. 20", suffix: "hours", defaultValue: 20 },
        { name: "interviewerRate", label: "Avg Interviewer Hourly Rate", type: "number", placeholder: "e.g. 50", prefix: "$", defaultValue: 50 },
        { name: "trainingWeeks", label: "Training / Onboarding Duration", type: "number", placeholder: "e.g. 4", suffix: "weeks", defaultValue: 4 },
        { name: "rampMonths", label: "Time to Full Productivity", type: "number", placeholder: "e.g. 6", suffix: "months", defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const salary = inputs.annualSalary as number;
        const recruiting = (inputs.recruitingCost as number) || 0;
        const intHours = (inputs.interviewHours as number) || 0;
        const intRate = (inputs.interviewerRate as number) || 50;
        const trainWeeks = (inputs.trainingWeeks as number) || 0;
        const rampMonths = (inputs.rampMonths as number) || 0;
        if (!salary) return null;

        const interviewCost = intHours * intRate;
        const dailyRate = salary / 260;
        const trainingCost = trainWeeks * 5 * dailyRate * 0.5; // 50% productivity during training
        const rampCost = rampMonths * 22 * dailyRate * 0.25; // 25% lost productivity during ramp
        const separationCost = salary * 0.05; // admin, severance, etc.
        const totalCost = recruiting + interviewCost + trainingCost + rampCost + separationCost;
        const pctSalary = (totalCost / salary) * 100;

        return {
          primary: { label: "Total Turnover Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "% of annual salary", value: `${formatNumber(pctSalary, 0)}%` },
            { label: "Recruiting costs", value: `$${formatNumber(recruiting)}` },
            { label: "Interview costs", value: `$${formatNumber(interviewCost)}` },
            { label: "Training productivity loss", value: `$${formatNumber(trainingCost)}` },
            { label: "Ramp-up productivity loss", value: `$${formatNumber(rampCost)}` },
            { label: "Separation / admin costs", value: `$${formatNumber(separationCost)}` },
          ],
        };
      },
    },
    {
      id: "annual",
      name: "Annual Turnover Impact",
      description: "Calculate annual turnover cost for the organization",
      fields: [
        { name: "employees", label: "Total Employees", type: "number", placeholder: "e.g. 200" },
        { name: "turnoverRate", label: "Annual Turnover Rate", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "avgSalary", label: "Average Annual Salary", type: "number", placeholder: "e.g. 65000", prefix: "$" },
        { name: "costMultiplier", label: "Cost Multiplier (% of salary)", type: "number", placeholder: "e.g. 50", suffix: "%", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const employees = inputs.employees as number;
        const rate = inputs.turnoverRate as number;
        const avgSalary = inputs.avgSalary as number;
        const multiplier = (inputs.costMultiplier as number) || 50;
        if (!employees || !rate || !avgSalary) return null;

        const departures = Math.round(employees * (rate / 100));
        const costPerTurnover = avgSalary * (multiplier / 100);
        const totalCost = departures * costPerTurnover;

        return {
          primary: { label: "Annual Turnover Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Expected departures", value: formatNumber(departures) },
            { label: "Cost per turnover", value: `$${formatNumber(costPerTurnover)}` },
            { label: "Turnover rate", value: `${formatNumber(rate, 1)}%` },
            { label: "Cost per employee (averaged)", value: `$${formatNumber(totalCost / employees)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hiring-cost-calculator", "salary-calculator", "training-roi-calculator"],
  faq: [
    { question: "How much does employee turnover really cost?", answer: "Studies show turnover costs 50-200% of an employee's annual salary. Entry-level positions cost around 30-50%, mid-level 100-150%, and senior/executive roles can cost 200%+ due to institutional knowledge loss and longer ramp-up times." },
    { question: "What is a good turnover rate?", answer: "Average turnover rates vary by industry: tech 13-15%, retail 60%+, healthcare 20-25%. Generally, voluntary turnover below 10% is considered good. Some turnover is healthy as it brings fresh perspectives." },
  ],
  formula: "Turnover Cost = Recruiting + Interview + Training Loss + Ramp-up Loss + Separation | Annual Impact = Departures x Cost per Turnover",
};
