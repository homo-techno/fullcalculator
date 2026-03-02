import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const employeeOnboardingCostCalculator: CalculatorDefinition = {
  slug: "employee-onboarding-cost-calculator",
  title: "Employee Onboarding Cost Calculator",
  description: "Estimate the total cost of onboarding a new hire.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["onboarding","new hire","cost","HR"],
  variants: [{
    id: "standard",
    name: "Employee Onboarding Cost",
    description: "Estimate the total cost of onboarding a new hire.",
    fields: [
      { name: "salary", label: "Annual Salary ($)", type: "number", min: 20000, max: 500000, defaultValue: 55000 },
      { name: "trainingHours", label: "Training Hours", type: "number", min: 1, max: 200, defaultValue: 40 },
      { name: "trainerRate", label: "Trainer Hourly Rate ($)", type: "number", min: 15, max: 200, defaultValue: 50 },
      { name: "equipmentCost", label: "Equipment Cost ($)", type: "number", min: 0, max: 10000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
    const salary = inputs.salary as number;
    const trainingHours = inputs.trainingHours as number;
    const trainerRate = inputs.trainerRate as number;
    const equipmentCost = inputs.equipmentCost as number;
    const hourlyRate = salary / 2080;
    const newHireTimeCost = trainingHours * hourlyRate;
    const trainerCost = trainingHours * trainerRate;
    const adminCost = salary * 0.05;
    const totalCost = newHireTimeCost + trainerCost + equipmentCost + adminCost;
    return { primary: { label: "Total Onboarding Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "New Hire Time Cost", value: "$" + formatNumber(newHireTimeCost) }, { label: "Trainer Cost", value: "$" + formatNumber(trainerCost) }, { label: "Equipment Cost", value: "$" + formatNumber(equipmentCost) }, { label: "Admin & Processing", value: "$" + formatNumber(adminCost) }] };
  },
  }],
  relatedSlugs: ["training-roi-calculator","employee-benefits-cost-calculator","overtime-cost-calculator"],
  faq: [
    { question: "How much does it cost to onboard a new employee?", answer: "Typically $3,000 to $10,000 depending on role and training needs." },
    { question: "What is included in onboarding costs?", answer: "Training time, equipment, admin processing, and trainer fees." },
    { question: "How long does onboarding usually take?", answer: "Most programs run 1 to 4 weeks for full productivity ramp-up." },
  ],
  formula: "Total = NewHireTimeCost + TrainerCost + Equipment + AdminCost",
};
