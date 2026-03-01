import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hourlyRateCalculator: CalculatorDefinition = {
  slug: "hourly-rate-calculator",
  title: "Hourly Rate Calculator",
  description: "Calculate your effective hourly rate from a salary or determine the salary equivalent of an hourly rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hourly rate calculator", "salary to hourly", "hourly wage calculator"],
  variants: [{
    id: "standard",
    name: "Hourly Rate",
    description: "Calculate your effective hourly rate from a salary or determine the salary equivalent of an hourly rate",
    fields: [
      { name: "annualSalary", label: "Annual Salary", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 65000 },
      { name: "hoursPerWeek", label: "Hours Worked Per Week", type: "number", suffix: "hours", min: 10, max: 80, defaultValue: 40 },
      { name: "weeksPerYear", label: "Working Weeks Per Year", type: "number", suffix: "weeks", min: 40, max: 52, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const salary = inputs.annualSalary as number;
      const hours = inputs.hoursPerWeek as number;
      const weeks = inputs.weeksPerYear as number;
      if (!salary || !hours || !weeks || salary <= 0 || hours <= 0 || weeks <= 0) return null;
      const totalHours = hours * weeks;
      const hourlyRate = salary / totalHours;
      const dailyRate = hourlyRate * (hours / 5);
      const monthlyRate = salary / 12;
      const weeklyRate = salary / weeks;
      return {
        primary: { label: "Hourly Rate", value: "$" + formatNumber(Math.round(hourlyRate * 100) / 100) },
        details: [
          { label: "Daily Rate", value: "$" + formatNumber(Math.round(dailyRate * 100) / 100) },
          { label: "Weekly Rate", value: "$" + formatNumber(Math.round(weeklyRate * 100) / 100) },
          { label: "Monthly Rate", value: "$" + formatNumber(Math.round(monthlyRate * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["real-hourly-wage-calculator", "commission-rate-calculator"],
  faq: [
    { question: "How do I convert salary to hourly rate?", answer: "Divide your annual salary by the total number of hours worked per year. For a standard full-time schedule, this is typically 2,080 hours (40 hours per week times 52 weeks). Adjust for actual vacation and time off." },
    { question: "What is a good hourly rate?", answer: "A good hourly rate depends on location, industry, and experience. The national median hourly wage in the United States is approximately $22 per hour. Skilled professionals and those in high-cost areas typically earn significantly more." },
  ],
  formula: "Hourly Rate = Annual Salary / (Hours Per Week x Working Weeks Per Year)",
};
