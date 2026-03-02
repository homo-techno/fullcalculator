import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fieldTripCostCalculator: CalculatorDefinition = {
  slug: "field-trip-cost-calculator",
  title: "Field Trip Cost Calculator",
  description: "Calculate the per student and total cost for a school field trip.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["field trip","school","cost","student","bus"],
  variants: [{
    id: "standard",
    name: "Field Trip Cost",
    description: "Calculate the per student and total cost for a school field trip.",
    fields: [
      { name: "numStudents", label: "Number of Students", type: "number", min: 5, max: 200, step: 1, defaultValue: 30 },
      { name: "busCost", label: "Bus Rental Cost ($)", type: "number", min: 100, max: 3000, step: 50, defaultValue: 500 },
      { name: "admissionPerStudent", label: "Admission Per Student ($)", type: "number", min: 0, max: 50, step: 1, defaultValue: 12 },
      { name: "lunchPerStudent", label: "Lunch Per Student ($)", type: "number", min: 0, max: 25, step: 1, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const numStudents = inputs.numStudents as number;
    const busCost = inputs.busCost as number;
    const admissionPerStudent = inputs.admissionPerStudent as number;
    const lunchPerStudent = inputs.lunchPerStudent as number;
    const totalAdmission = admissionPerStudent * numStudents;
    const totalLunch = lunchPerStudent * numStudents;
    const grandTotal = busCost + totalAdmission + totalLunch;
    const costPerStudent = grandTotal / numStudents;
    return {
      primary: { label: "Cost Per Student", value: "$" + formatNumber(costPerStudent) },
      details: [
        { label: "Grand Total", value: "$" + formatNumber(grandTotal) },
        { label: "Bus Rental", value: "$" + formatNumber(busCost) },
        { label: "Total Admission", value: "$" + formatNumber(totalAdmission) },
        { label: "Total Lunch", value: "$" + formatNumber(totalLunch) }
      ]
    };
  },
  }],
  relatedSlugs: ["summer-camp-cost-calculator","school-bus-route-calculator","school-fundraiser-calculator"],
  faq: [
    { question: "How much does a school field trip cost per student?", answer: "Field trips typically cost $10 to $40 per student depending on destination and distance." },
    { question: "Who pays for school field trips?", answer: "Costs are usually split between school budgets, parent contributions, and fundraisers." },
  ],
  formula: "Cost Per Student = (Bus Rental + Total Admission + Total Lunch) / Students",
};
