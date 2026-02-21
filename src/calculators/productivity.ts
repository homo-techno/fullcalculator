import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const productivityCalculator: CalculatorDefinition = {
  slug: "productivity-calculator",
  title: "Productivity Calculator",
  description: "Free productivity calculator. Measure labor productivity, output per hour, and revenue per employee for your business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["productivity calculator", "labor productivity", "output per hour", "revenue per employee", "efficiency calculator"],
  variants: [
    {
      id: "labor",
      name: "Labor Productivity",
      description: "Calculate output per labor hour or per employee",
      fields: [
        { name: "totalOutput", label: "Total Output (units or revenue)", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "totalHours", label: "Total Labor Hours", type: "number", placeholder: "e.g. 1200" },
        { name: "numEmployees", label: "Number of Employees", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const output = inputs.totalOutput as number;
        const hours = inputs.totalHours as number;
        const employees = inputs.numEmployees as number;
        if (!output || !hours) return null;
        const outputPerHour = output / hours;
        const details = [
          { label: "Output per Hour", value: `$${formatNumber(outputPerHour)}` },
          { label: "Total Output", value: `$${formatNumber(output)}` },
          { label: "Total Hours", value: formatNumber(hours, 0) },
        ];
        if (employees) {
          details.push({ label: "Output per Employee", value: `$${formatNumber(output / employees)}` });
          details.push({ label: "Hours per Employee", value: formatNumber(hours / employees, 1) });
        }
        return {
          primary: { label: "Productivity (Output/Hour)", value: `$${formatNumber(outputPerHour)}` },
          details,
        };
      },
    },
    {
      id: "efficiency",
      name: "Efficiency Rate",
      description: "Calculate efficiency as actual output vs expected output",
      fields: [
        { name: "actualOutput", label: "Actual Output", type: "number", placeholder: "e.g. 450" },
        { name: "expectedOutput", label: "Expected/Standard Output", type: "number", placeholder: "e.g. 500" },
        { name: "actualHours", label: "Actual Hours Worked", type: "number", placeholder: "e.g. 42" },
        { name: "standardHours", label: "Standard Hours", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const actual = inputs.actualOutput as number;
        const expected = inputs.expectedOutput as number;
        const actualHrs = inputs.actualHours as number;
        const standardHrs = inputs.standardHours as number;
        if (!actual || !expected) return null;
        const efficiency = (actual / expected) * 100;
        const details = [
          { label: "Actual Output", value: formatNumber(actual, 0) },
          { label: "Expected Output", value: formatNumber(expected, 0) },
          { label: "Variance", value: `${formatNumber(actual - expected, 0)} units` },
        ];
        if (actualHrs && standardHrs) {
          const timeEfficiency = (standardHrs / actualHrs) * 100;
          const overallEfficiency = (efficiency * timeEfficiency) / 100;
          details.push({ label: "Time Efficiency", value: `${formatNumber(timeEfficiency)}%` });
          details.push({ label: "Overall Efficiency", value: `${formatNumber(overallEfficiency)}%` });
        }
        return {
          primary: { label: "Efficiency Rate", value: formatNumber(efficiency), suffix: "%" },
          details,
        };
      },
    },
    {
      id: "revenuePerEmployee",
      name: "Revenue per Employee",
      description: "Calculate revenue and profit generated per employee",
      fields: [
        { name: "annualRevenue", label: "Annual Revenue", type: "number", placeholder: "e.g. 5000000", prefix: "$" },
        { name: "annualProfit", label: "Annual Net Profit", type: "number", placeholder: "e.g. 750000", prefix: "$" },
        { name: "employees", label: "Number of Employees", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const revenue = inputs.annualRevenue as number;
        const profit = (inputs.annualProfit as number) || 0;
        const employees = inputs.employees as number;
        if (!revenue || !employees) return null;
        const revPerEmployee = revenue / employees;
        const profitPerEmployee = profit / employees;
        return {
          primary: { label: "Revenue per Employee", value: `$${formatNumber(revPerEmployee)}` },
          details: [
            { label: "Profit per Employee", value: `$${formatNumber(profitPerEmployee)}` },
            { label: "Total Revenue", value: `$${formatNumber(revenue)}` },
            { label: "Total Employees", value: formatNumber(employees, 0) },
            { label: "Revenue per Employee/Month", value: `$${formatNumber(revPerEmployee / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["employee-cost-calculator", "meeting-cost-calculator", "salary-calculator"],
  faq: [
    { question: "How do you measure productivity?", answer: "The most common measure is Labor Productivity = Total Output / Total Labor Hours. For businesses, Revenue per Employee is widely used. Efficiency rate compares actual output to expected output as a percentage." },
    { question: "What is a good revenue per employee?", answer: "It varies dramatically by industry. Tech companies: $200,000-$1,000,000+. Manufacturing: $100,000-$300,000. Retail: $50,000-$200,000. Professional services: $100,000-$500,000. Compare against your industry benchmarks." },
    { question: "How can I improve productivity?", answer: "Invest in training and tools, reduce unnecessary meetings, automate repetitive tasks, set clear goals and metrics, improve work processes, eliminate bottlenecks, and ensure employees have the resources they need." },
  ],
  formula: "Labor Productivity = Total Output / Total Labor Hours | Efficiency = (Actual Output / Expected Output) × 100 | Revenue per Employee = Annual Revenue / Headcount",
};
