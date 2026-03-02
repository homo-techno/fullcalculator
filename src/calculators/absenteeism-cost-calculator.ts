import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const absenteeismCostCalculator: CalculatorDefinition = {
  slug: "absenteeism-cost-calculator",
  title: "Absenteeism Cost Calculator",
  description: "Calculate the cost of employee absences to your organization.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["absenteeism","absence","cost","productivity"],
  variants: [{
    id: "standard",
    name: "Absenteeism Cost",
    description: "Calculate the cost of employee absences to your organization.",
    fields: [
      { name: "employees", label: "Number of Employees", type: "number", min: 1, max: 10000, defaultValue: 50 },
      { name: "avgDailyPay", label: "Average Daily Pay ($)", type: "number", min: 50, max: 2000, defaultValue: 250 },
      { name: "absentDays", label: "Absent Days Per Year (each)", type: "number", min: 1, max: 50, defaultValue: 7 },
      { name: "replacementFactor", label: "Replacement Cost Factor", type: "select", options: [{ value: "1.25", label: "Low (1.25x)" }, { value: "1.5", label: "Medium (1.5x)" }, { value: "2", label: "High (2x)" }] },
    ],
    calculate: (inputs) => {
    const employees = inputs.employees as number;
    const avgDailyPay = inputs.avgDailyPay as number;
    const absentDays = inputs.absentDays as number;
    const replacementFactor = inputs.replacementFactor as number;
    const directCost = employees * avgDailyPay * absentDays;
    const indirectCost = directCost * (replacementFactor - 1);
    const totalCost = directCost + indirectCost;
    const costPerEmployee = totalCost / employees;
    const absenteeismRate = (absentDays / 260) * 100;
    return { primary: { label: "Total Absenteeism Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "Direct Wage Cost", value: "$" + formatNumber(directCost) }, { label: "Indirect Cost", value: "$" + formatNumber(indirectCost) }, { label: "Cost Per Employee", value: "$" + formatNumber(costPerEmployee) }, { label: "Absenteeism Rate", value: formatNumber(absenteeismRate) + "%" }] };
  },
  }],
  relatedSlugs: ["overtime-cost-calculator","employee-benefits-cost-calculator","pto-accrual-calculator"],
  faq: [
    { question: "What is the average absenteeism rate?", answer: "The US average is about 2.8% or roughly 7 days per year." },
    { question: "What are indirect costs of absenteeism?", answer: "Overtime for others, temp workers, lower morale, and lost productivity." },
    { question: "How can employers reduce absenteeism?", answer: "Flexible scheduling, wellness programs, and engagement initiatives help." },
  ],
  formula: "Total = DirectCost + IndirectCost; DirectCost = Employees * DailyPay * AbsentDays",
};
