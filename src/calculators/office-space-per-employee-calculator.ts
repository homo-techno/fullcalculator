import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const officeSpacePerEmployeeCalculator: CalculatorDefinition = {
  slug: "office-space-per-employee-calculator",
  title: "Office Space Per Employee Calculator",
  description: "Determine the square footage needed per worker in an office.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["office","space","square feet","employee"],
  variants: [{
    id: "standard",
    name: "Office Space Per Employee",
    description: "Determine the square footage needed per worker in an office.",
    fields: [
      { name: "employees", label: "Number of Employees", type: "number", min: 1, max: 1000, defaultValue: 25 },
      { name: "sqftPerPerson", label: "Sq Ft Per Person", type: "number", min: 50, max: 400, defaultValue: 150 },
      { name: "commonAreaPct", label: "Common Area (%)", type: "number", min: 5, max: 50, defaultValue: 20 },
      { name: "costPerSqft", label: "Cost Per Sq Ft ($/year)", type: "number", min: 5, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const employees = inputs.employees as number;
    const sqftPerPerson = inputs.sqftPerPerson as number;
    const commonAreaPct = inputs.commonAreaPct as number;
    const costPerSqft = inputs.costPerSqft as number;
    const workspaceSqft = employees * sqftPerPerson;
    const commonSqft = workspaceSqft * (commonAreaPct / 100);
    const totalSqft = workspaceSqft + commonSqft;
    const annualCost = totalSqft * costPerSqft;
    const costPerEmployee = annualCost / employees;
    return { primary: { label: "Total Office Space Needed", value: formatNumber(totalSqft) + " sq ft" }, details: [{ label: "Workspace Area", value: formatNumber(workspaceSqft) + " sq ft" }, { label: "Common Area", value: formatNumber(commonSqft) + " sq ft" }, { label: "Annual Lease Cost", value: "$" + formatNumber(annualCost) }, { label: "Cost Per Employee", value: "$" + formatNumber(costPerEmployee) }] };
  },
  }],
  relatedSlugs: ["conference-room-calculator","cubicle-layout-calculator","standing-desk-height-calculator"],
  faq: [
    { question: "How much office space does each employee need?", answer: "The standard is 100 to 200 square feet per person including shared areas." },
    { question: "What is included in common area space?", answer: "Break rooms, conference rooms, hallways, restrooms, and lobbies." },
    { question: "How do open offices affect space needs?", answer: "Open floor plans can reduce per-person space to 60 to 80 square feet." },
  ],
  formula: "TotalSqft = (Employees * SqftPerPerson) * (1 + CommonArea%/100)",
};
