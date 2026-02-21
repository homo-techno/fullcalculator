import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hourlyToSalaryCalculator: CalculatorDefinition = {
  slug: "hourly-to-salary-calculator",
  title: "Hourly to Salary Calculator",
  description: "Free hourly to salary calculator. Convert between hourly wage and annual salary. See weekly, biweekly, and monthly breakdowns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hourly to salary", "salary to hourly", "wage calculator", "annual salary calculator", "hourly rate calculator"],
  variants: [
    {
      id: "hourlyToSalary",
      name: "Hourly → Annual Salary",
      fields: [
        { name: "hourly", label: "Hourly Rate", type: "number", prefix: "$", placeholder: "e.g. 25" },
        { name: "hours", label: "Hours per Week", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "weeks", label: "Weeks per Year", type: "number", placeholder: "e.g. 52", defaultValue: 52 },
      ],
      calculate: (inputs) => {
        const hourly = inputs.hourly as number;
        const hours = (inputs.hours as number) || 40;
        const weeks = (inputs.weeks as number) || 52;
        if (!hourly) return null;
        const annual = hourly * hours * weeks;
        return {
          primary: { label: "Annual Salary", value: `$${formatNumber(annual, 2)}` },
          details: [
            { label: "Monthly", value: `$${formatNumber(annual / 12, 2)}` },
            { label: "Biweekly", value: `$${formatNumber(annual / 26, 2)}` },
            { label: "Weekly", value: `$${formatNumber(hourly * hours, 2)}` },
            { label: "Daily (8hr)", value: `$${formatNumber(hourly * 8, 2)}` },
          ],
        };
      },
    },
    {
      id: "salaryToHourly",
      name: "Annual Salary → Hourly",
      fields: [
        { name: "salary", label: "Annual Salary", type: "number", prefix: "$", placeholder: "e.g. 65000" },
        { name: "hours", label: "Hours per Week", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "weeks", label: "Weeks per Year", type: "number", placeholder: "e.g. 52", defaultValue: 52 },
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        const hours = (inputs.hours as number) || 40;
        const weeks = (inputs.weeks as number) || 52;
        if (!salary) return null;
        const hourly = salary / (hours * weeks);
        return {
          primary: { label: "Hourly Rate", value: `$${formatNumber(hourly, 2)}` },
          details: [
            { label: "Monthly", value: `$${formatNumber(salary / 12, 2)}` },
            { label: "Biweekly", value: `$${formatNumber(salary / 26, 2)}` },
            { label: "Weekly", value: `$${formatNumber(salary / weeks, 2)}` },
            { label: "Daily (8hr)", value: `$${formatNumber(hourly * 8, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "pay-raise-calculator"],
  faq: [{ question: "How do I convert hourly to salary?", answer: "Annual salary = Hourly rate × Hours per week × Weeks per year. For a $25/hr rate at 40 hrs/week: $25 × 40 × 52 = $52,000/year. To reverse: hourly = salary / (hours × weeks)." }],
  formula: "Salary = Hourly × Hours/Week × Weeks/Year",
};
