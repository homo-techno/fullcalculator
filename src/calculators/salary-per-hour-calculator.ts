import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salaryPerHourCalculator: CalculatorDefinition = {
  slug: "salary-per-hour-calculator",
  title: "Salary Per Hour Calculator",
  description: "Free salary per hour calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["salary per hour calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Salary Per Hour",
      description: "Calculate salary per hour",
      fields: [
        {
          name: "salary",
          label: "Annual Salary",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
          min: 0,
        },
        {
          name: "hours",
          label: "Hours per Week",
          type: "number",
          placeholder: "e.g. 40",
          min: 1,
          max: 100,
        },
        {
          name: "weeks",
          label: "Weeks per Year",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 52,
          defaultValue: 50,
        }
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        const hrs = inputs.hours as number;
        const weeks = inputs.weeks as number || 50;
        if (!salary || !hrs) return null;
        const hourly = salary / (hrs * weeks);
        const daily = hourly * (hrs / 5);
        const monthly = salary / 12;
        return {
          primary: { label: "Hourly Rate", value: "$" + formatNumber(hourly) },
          details: [
            { label: "Daily rate", value: "$" + formatNumber(daily) },
            { label: "Monthly", value: "$" + formatNumber(monthly) },
            { label: "Per minute", value: "$" + formatNumber(hourly / 60) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the salary per hour calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
