import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const absenteeismRateCalculator: CalculatorDefinition = {
  slug: "absenteeism-rate-calculator",
  title: "Absenteeism Rate Calculator",
  description: "Free absenteeism rate calculator. Calculate employee absenteeism rate, lost productivity cost, and absence patterns for workforce planning.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["absenteeism rate calculator", "absence rate calculator", "employee absence", "sick days calculator", "attendance rate calculator"],
  variants: [
    {
      id: "rate",
      name: "Absenteeism Rate",
      description: "Calculate the absenteeism rate for a period",
      fields: [
        { name: "absentDays", label: "Total Absent Days (all employees)", type: "number", placeholder: "e.g. 25" },
        { name: "employees", label: "Number of Employees", type: "number", placeholder: "e.g. 50" },
        { name: "workDays", label: "Working Days in Period", type: "number", placeholder: "e.g. 22", defaultValue: 22 },
        { name: "avgDailyCost", label: "Average Daily Employee Cost", type: "number", placeholder: "e.g. 300", prefix: "$" },
      ],
      calculate: (inputs) => {
        const absent = inputs.absentDays as number;
        const employees = inputs.employees as number;
        const workDays = (inputs.workDays as number) || 22;
        const dailyCost = inputs.avgDailyCost as number;
        if (!absent || !employees) return null;

        const totalPossible = employees * workDays;
        const rate = (absent / totalPossible) * 100;
        const attendanceRate = 100 - rate;
        const avgPerEmployee = absent / employees;
        const annualAbsent = avgPerEmployee * 12;

        const details: { label: string; value: string }[] = [
          { label: "Attendance rate", value: `${formatNumber(attendanceRate, 1)}%` },
          { label: "Total possible days", value: formatNumber(totalPossible) },
          { label: "Days absent", value: formatNumber(absent) },
          { label: "Avg absences per employee", value: formatNumber(avgPerEmployee, 1) },
          { label: "Est. annual absences/employee", value: formatNumber(annualAbsent, 1) },
        ];

        if (dailyCost) {
          const monthlyCost = absent * dailyCost;
          const annualCost = monthlyCost * 12;
          details.push({ label: "Monthly cost of absences", value: `$${formatNumber(monthlyCost)}` });
          details.push({ label: "Est. annual cost", value: `$${formatNumber(annualCost)}` });
        }

        return {
          primary: { label: "Absenteeism Rate", value: formatNumber(rate, 2), suffix: "%" },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["time-card-calculator", "utilization-rate-calculator", "salary-calculator"],
  faq: [
    { question: "What is a normal absenteeism rate?", answer: "The average absenteeism rate in the US is about 2.8-3.0%. Rates below 1.5% are excellent, 1.5-3% is normal, and above 4% may indicate issues with workplace culture, health, or morale." },
    { question: "How do I reduce absenteeism?", answer: "Common strategies include flexible work arrangements, wellness programs, adequate PTO policies, strong management practices, and addressing workplace culture issues. Tracking absence patterns can help identify systemic problems." },
  ],
  formula: "Absenteeism Rate = (Absent Days / (Employees x Working Days)) x 100 | Monthly Cost = Absent Days x Daily Cost",
};
