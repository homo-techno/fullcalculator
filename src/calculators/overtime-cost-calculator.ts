import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const overtimeCostCalculator: CalculatorDefinition = {
  slug: "overtime-cost-calculator",
  title: "Overtime Cost Calculator",
  description: "Estimate the total cost of overtime labor for your team.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["overtime","labor","cost","wages"],
  variants: [{
    id: "standard",
    name: "Overtime Cost",
    description: "Estimate the total cost of overtime labor for your team.",
    fields: [
      { name: "hourlyRate", label: "Regular Hourly Rate ($)", type: "number", min: 7, max: 200, defaultValue: 25 },
      { name: "overtimeHours", label: "Overtime Hours Per Week", type: "number", min: 1, max: 40, defaultValue: 10 },
      { name: "employees", label: "Number of Employees", type: "number", min: 1, max: 500, defaultValue: 5 },
      { name: "overtimeRate", label: "Overtime Multiplier", type: "select", options: [{ value: "1.5", label: "Time and a Half (1.5x)" }, { value: "2", label: "Double Time (2x)" }] },
    ],
    calculate: (inputs) => {
    const hourlyRate = inputs.hourlyRate as number;
    const overtimeHours = inputs.overtimeHours as number;
    const employees = inputs.employees as number;
    const overtimeRate = inputs.overtimeRate as number;
    const otHourlyRate = hourlyRate * overtimeRate;
    const weeklyOTCost = otHourlyRate * overtimeHours * employees;
    const monthlyOTCost = weeklyOTCost * 4.33;
    const annualOTCost = weeklyOTCost * 52;
    const premiumCost = (otHourlyRate - hourlyRate) * overtimeHours * employees * 52;
    return { primary: { label: "Annual Overtime Cost", value: "$" + formatNumber(annualOTCost) }, details: [{ label: "OT Hourly Rate", value: "$" + formatNumber(otHourlyRate) }, { label: "Weekly OT Cost", value: "$" + formatNumber(weeklyOTCost) }, { label: "Monthly OT Cost", value: "$" + formatNumber(monthlyOTCost) }, { label: "Annual Premium Above Base", value: "$" + formatNumber(premiumCost) }] };
  },
  }],
  relatedSlugs: ["shift-differential-calculator","absenteeism-cost-calculator","workers-comp-rate-calculator"],
  faq: [
    { question: "What is the standard overtime rate?", answer: "Federal law requires 1.5x the regular rate for hours over 40 per week." },
    { question: "Is overtime cheaper than hiring new staff?", answer: "Only up to a point; excessive overtime can cost more than a new hire." },
    { question: "Do salaried employees get overtime?", answer: "Non-exempt salaried employees earning below certain thresholds do qualify." },
  ],
  formula: "AnnualOT = HourlyRate * Multiplier * OvertimeHours * Employees * 52",
};
