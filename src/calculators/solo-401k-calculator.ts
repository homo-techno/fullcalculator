import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solo401kCalculator: CalculatorDefinition = {
  slug: "solo-401k-calculator",
  title: "Solo 401(k) Calculator",
  description: "Calculate maximum solo 401(k) contributions for self-employed individuals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["solo 401k calculator", "self employed 401k", "individual 401k contribution"],
  variants: [{
    id: "standard",
    name: "Solo 401(k)",
    description: "Calculate maximum solo 401(k) contributions for self-employed individuals",
    fields: [
      { name: "netSEIncome", label: "Net Self-Employment Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 150000 },
      { name: "age", label: "Age", type: "select", options: [{value:"under50",label:"Under 50"},{value:"50plus",label:"50 or Older"}], defaultValue: "under50" },
      { name: "entityType", label: "Business Entity", type: "select", options: [{value:"sole",label:"Sole Proprietor / LLC"},{value:"scorp",label:"S-Corp"}], defaultValue: "sole" },
    ],
    calculate: (inputs) => {
      const income = inputs.netSEIncome as number;
      const ageGroup = inputs.age as string;
      const entity = inputs.entityType as string;
      if (!income || income <= 0) return null;
      const seTax = income * 0.9235 * 0.153;
      const seDeduction = seTax / 2;
      const adjustedIncome = entity === "sole" ? income - seDeduction : income;
      const employeeLimit = ageGroup === "50plus" ? 30500 : 23000;
      const employeeDeferral = Math.min(employeeLimit, adjustedIncome);
      const employerContrib = entity === "sole" ? adjustedIncome * 0.20 : income * 0.25;
      const totalLimit = 69000 + (ageGroup === "50plus" ? 7500 : 0);
      const totalContribution = Math.min(employeeDeferral + employerContrib, totalLimit);
      return {
        primary: { label: "Maximum Total Contribution", value: "$" + formatNumber(Math.round(totalContribution)) },
        details: [
          { label: "Employee Deferral", value: "$" + formatNumber(Math.round(employeeDeferral)) },
          { label: "Employer Contribution (profit sharing)", value: "$" + formatNumber(Math.round(employerContrib)) },
          { label: "Overall Limit", value: "$" + formatNumber(totalLimit) },
          { label: "Tax Savings (est. 24%)", value: "$" + formatNumber(Math.round(totalContribution * 0.24)) },
        ],
      };
    },
  }],
  relatedSlugs: ["catch-up-contribution-calculator", "ira-contribution-calculator"],
  faq: [
    { question: "Who can open a solo 401(k)?", answer: "Any self-employed individual with no full-time employees other than a spouse can open a solo 401(k)." },
    { question: "What is the solo 401(k) contribution limit?", answer: "The total limit is $69,000 for 2024 ($76,500 if 50 or older), combining employee deferrals and employer profit sharing." },
  ],
  formula: "Total = Employee Deferral (up to $23,000) + Employer Contribution (20-25% of income)",
};
