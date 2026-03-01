import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const employeeTurnoverCostCalculator: CalculatorDefinition = {
  slug: "employee-turnover-cost-calculator",
  title: "Employee Turnover Cost Calculator",
  description: "Estimate the total cost of employee turnover including separation, replacement, and lost productivity expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["employee turnover cost", "turnover calculator", "cost of replacing an employee"],
  variants: [{
    id: "standard",
    name: "Employee Turnover Cost",
    description: "Estimate the total cost of employee turnover including separation, replacement, and lost productivity expenses",
    fields: [
      { name: "annualSalary", label: "Annual Salary of Departing Employee", type: "number", prefix: "$", min: 20000, max: 500000, step: 1000, defaultValue: 65000 },
      { name: "positionLevel", label: "Position Level", type: "select", options: [{value:"entry",label:"Entry Level"},{value:"mid",label:"Mid Level"},{value:"senior",label:"Senior or Specialist"},{value:"executive",label:"Executive"}], defaultValue: "mid" },
      { name: "annualTurnover", label: "Annual Turnover Rate", type: "number", suffix: "%", min: 1, max: 100, step: 1, defaultValue: 15 },
      { name: "totalEmployees", label: "Total Number of Employees", type: "number", min: 1, max: 100000, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const salary = inputs.annualSalary as number;
      const level = inputs.positionLevel as string;
      const turnoverRate = inputs.annualTurnover as number;
      const totalEmp = inputs.totalEmployees as number;
      if (!salary || salary <= 0 || !totalEmp || totalEmp <= 0) return null;
      const costMultipliers: Record<string, number> = { entry: 0.5, mid: 1.0, senior: 1.5, executive: 2.5 };
      const multiplier = costMultipliers[level] || 1.0;
      const costPerTurnover = salary * multiplier;
      const annualDepartures = Math.round(totalEmp * ((turnoverRate || 15) / 100));
      const annualTurnoverCost = costPerTurnover * annualDepartures;
      const separationCost = salary * 0.1;
      const recruitmentCost = salary * 0.15;
      const trainingCost = salary * (multiplier * 0.2);
      const productivityCost = costPerTurnover - separationCost - recruitmentCost - trainingCost;
      return {
        primary: { label: "Cost Per Turnover", value: "$" + formatNumber(Math.round(costPerTurnover)) },
        details: [
          { label: "Expected Annual Departures", value: formatNumber(annualDepartures) + " employees" },
          { label: "Total Annual Turnover Cost", value: "$" + formatNumber(Math.round(annualTurnoverCost)) },
          { label: "Cost as Multiple of Salary", value: formatNumber(multiplier) + "x annual salary" },
        ],
      };
    },
  }],
  relatedSlugs: ["cost-per-hire-calculator", "employer-payroll-tax-calculator"],
  faq: [
    { question: "How much does it cost to replace an employee?", answer: "Replacing an employee typically costs 50 to 200 percent of their annual salary. Entry-level positions cost about 50 percent, mid-level about 100 percent, and senior or specialized roles can cost 150 to 250 percent of the annual salary." },
    { question: "What contributes to turnover costs?", answer: "Turnover costs include separation processing, recruiting and interviewing replacements, onboarding and training, lost productivity during the vacancy and ramp-up period, reduced morale, and potential loss of institutional knowledge." },
  ],
  formula: "Turnover Cost = Annual Salary x Position Level Multiplier; Annual Total = Cost Per Turnover x (Employees x Turnover Rate)",
};
