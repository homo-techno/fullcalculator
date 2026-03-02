import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const afterSchoolProgramCostCalculator: CalculatorDefinition = {
  slug: "after-school-program-cost-calculator",
  title: "After School Program Cost Calculator",
  description: "Calculate the total cost of after school care programs per month and year.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["after school","childcare","program","cost","care"],
  variants: [{
    id: "standard",
    name: "After School Program Cost",
    description: "Calculate the total cost of after school care programs per month and year.",
    fields: [
      { name: "dailyRate", label: "Daily Rate ($)", type: "number", min: 5, max: 100, step: 1, defaultValue: 25 },
      { name: "daysPerWeek", label: "Days Per Week", type: "number", min: 1, max: 5, step: 1, defaultValue: 5 },
      { name: "numChildren", label: "Number of Children", type: "number", min: 1, max: 6, step: 1, defaultValue: 1 },
      { name: "months", label: "School Months Per Year", type: "number", min: 1, max: 12, step: 1, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const dailyRate = inputs.dailyRate as number;
    const daysPerWeek = inputs.daysPerWeek as number;
    const numChildren = inputs.numChildren as number;
    const months = inputs.months as number;
    const weeklyTotal = dailyRate * daysPerWeek * numChildren;
    const monthlyTotal = weeklyTotal * 4.33;
    const annualTotal = monthlyTotal * months;
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(monthlyTotal) },
      details: [
        { label: "Weekly Cost", value: "$" + formatNumber(weeklyTotal) },
        { label: "Annual Cost", value: "$" + formatNumber(annualTotal) },
        { label: "Cost Per Child Per Month", value: "$" + formatNumber(monthlyTotal / numChildren) }
      ]
    };
  },
  }],
  relatedSlugs: ["babysitting-rate-calculator","summer-camp-cost-calculator","school-lunch-cost-calculator"],
  faq: [
    { question: "How much does after school care cost?", answer: "After school programs typically cost $200 to $600 per month per child." },
    { question: "Is after school care tax deductible?", answer: "Yes, after school care may qualify for the Child and Dependent Care Tax Credit." },
  ],
  formula: "Monthly Cost = Daily Rate x Days Per Week x Children x 4.33",
};
