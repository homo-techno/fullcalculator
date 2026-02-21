import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sickLeaveCalculator: CalculatorDefinition = {
  slug: "sick-leave-calculator",
  title: "Sick Leave Calculator",
  description: "Free sick leave calculator. Calculate sick leave accrual, balance, and cost of sick days for employees and employers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sick leave calculator", "sick day calculator", "sick leave accrual", "sick time calculator", "sick pay calculator"],
  variants: [
    {
      id: "accrual",
      name: "Sick Leave Accrual",
      description: "Calculate sick leave accrual based on hours worked",
      fields: [
        { name: "accrualRate", label: "Accrual Rate", type: "select", options: [
          { label: "1 hour per 30 hours worked", value: "30" },
          { label: "1 hour per 40 hours worked", value: "40" },
          { label: "1 hour per 20 hours worked", value: "20" },
        ], defaultValue: "30" },
        { name: "hoursWorked", label: "Hours Worked (this year)", type: "number", placeholder: "e.g. 1040" },
        { name: "usedHours", label: "Sick Hours Used", type: "number", placeholder: "e.g. 16" },
        { name: "maxCap", label: "Annual Cap (hours, 0 = no cap)", type: "number", placeholder: "e.g. 48", defaultValue: 48 },
      ],
      calculate: (inputs) => {
        const accrualDivisor = parseInt(inputs.accrualRate as string) || 30;
        const hoursWorked = inputs.hoursWorked as number;
        const usedHours = (inputs.usedHours as number) || 0;
        const maxCap = (inputs.maxCap as number) || 0;
        if (!hoursWorked) return null;
        let accrued = hoursWorked / accrualDivisor;
        if (maxCap > 0) accrued = Math.min(accrued, maxCap);
        const balance = Math.max(0, accrued - usedHours);
        const daysBalance = balance / 8;
        return {
          primary: { label: "Sick Leave Balance", value: `${formatNumber(balance, 1)} hours` },
          details: [
            { label: "Balance (days)", value: `${formatNumber(daysBalance, 1)} days` },
            { label: "Total Accrued", value: `${formatNumber(accrued, 1)} hours` },
            { label: "Hours Used", value: `${formatNumber(usedHours, 1)} hours` },
            { label: "Accrual Rate", value: `1 hour per ${accrualDivisor} hours worked` },
            { label: "Annual Cap", value: maxCap > 0 ? `${maxCap} hours` : "No cap" },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Sick Day Cost (Employer)",
      description: "Calculate the cost of employee sick days to the business",
      fields: [
        { name: "employees", label: "Number of Employees", type: "number", placeholder: "e.g. 50" },
        { name: "avgSalary", label: "Average Annual Salary", type: "number", placeholder: "e.g. 55000", prefix: "$" },
        { name: "avgSickDays", label: "Average Sick Days per Employee/Year", type: "number", placeholder: "e.g. 5" },
        { name: "productivityLoss", label: "Productivity Loss per Sick Day", type: "select", options: [
          { label: "25% (light coverage)", value: "25" },
          { label: "50% (partial coverage)", value: "50" },
          { label: "75% (poor coverage)", value: "75" },
          { label: "100% (no coverage)", value: "100" },
        ], defaultValue: "50" },
      ],
      calculate: (inputs) => {
        const employees = inputs.employees as number;
        const avgSalary = inputs.avgSalary as number;
        const avgSickDays = inputs.avgSickDays as number;
        const lossRate = parseInt(inputs.productivityLoss as string) || 50;
        if (!employees || !avgSalary || !avgSickDays) return null;
        const dailyRate = avgSalary / 260;
        const directCost = employees * avgSickDays * dailyRate;
        const productivityCost = directCost * (lossRate / 100);
        const totalCost = directCost + productivityCost;
        const totalSickDays = employees * avgSickDays;
        const costPerEmployee = totalCost / employees;
        return {
          primary: { label: "Total Annual Sick Leave Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Direct Wage Cost", value: `$${formatNumber(directCost)}` },
            { label: "Productivity Loss Cost", value: `$${formatNumber(productivityCost)}` },
            { label: "Cost per Employee/Year", value: `$${formatNumber(costPerEmployee)}` },
            { label: "Total Sick Days/Year", value: formatNumber(totalSickDays, 0) },
            { label: "Avg Daily Rate", value: `$${formatNumber(dailyRate)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pto-calculator", "salary-calculator", "employee-cost-calculator"],
  faq: [
    { question: "How does sick leave accrual work?", answer: "Most states and cities that mandate sick leave require accrual at 1 hour per 30 or 40 hours worked. For example, at 1 hour per 30 hours worked, a full-time employee (2,080 hours/year) accrues about 69 hours (8.7 days). Many laws cap accrual at 40-48 hours/year." },
    { question: "What is the average number of sick days per employee?", answer: "The Bureau of Labor Statistics reports an average of 7-8 paid sick days per year for full-time workers. Usage averages 3-5 days per year. Workers in government and larger companies tend to get more sick leave." },
    { question: "Which states require paid sick leave?", answer: "As of 2024, many states require paid sick leave including California, New York, Arizona, Washington, Oregon, Colorado, Connecticut, Maryland, Massachusetts, Michigan, New Jersey, New Mexico, Rhode Island, Vermont, and others. Many cities also have their own requirements." },
  ],
  formula: "Accrued Hours = Hours Worked / Accrual Rate | Balance = Accrued - Used | Annual Cost = Employees × Avg Sick Days × Daily Rate × (1 + Productivity Loss%)",
};
