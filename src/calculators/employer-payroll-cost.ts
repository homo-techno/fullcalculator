import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const employerPayrollCostCalculator: CalculatorDefinition = {
  slug: "employer-payroll-cost-calculator",
  title: "Employer Payroll Cost Calculator",
  description:
    "Free employer payroll cost calculator. Calculate the true cost of an employee including payroll taxes, benefits, and employer contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "employer payroll cost",
    "cost of employee",
    "employer tax calculator",
    "FUTA SUTA calculator",
    "total employee cost",
  ],
  variants: [
    {
      id: "employer-cost",
      name: "Total Employer Cost Per Employee",
      description:
        "Calculate the full cost of employing someone including taxes and benefits",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
        },
        {
          name: "healthInsurance",
          label: "Employer Health Insurance (annual)",
          type: "number",
          placeholder: "e.g. 7500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "retirement401k",
          label: "401(k) Employer Match (annual)",
          type: "number",
          placeholder: "e.g. 3000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "sutaRate",
          label: "State Unemployment (SUTA) Rate",
          type: "number",
          placeholder: "e.g. 2.7",
          suffix: "%",
          defaultValue: 2.7,
        },
        {
          name: "sutaWageBase",
          label: "SUTA Wage Base",
          type: "number",
          placeholder: "e.g. 7000",
          prefix: "$",
          defaultValue: 7000,
        },
        {
          name: "workersComp",
          label: "Workers' Comp Insurance (annual)",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherBenefits",
          label: "Other Benefits (annual)",
          type: "number",
          placeholder: "e.g. 1000",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const salary = inputs.annualSalary as number;
        const health = (inputs.healthInsurance as number) || 0;
        const retirement = (inputs.retirement401k as number) || 0;
        const sutaRate = (inputs.sutaRate as number) || 2.7;
        const sutaBase = (inputs.sutaWageBase as number) || 7000;
        const workersComp = (inputs.workersComp as number) || 0;
        const otherBenefits = (inputs.otherBenefits as number) || 0;

        if (!salary || salary <= 0) return null;

        const employerSS = Math.min(salary, 168600) * 0.062;
        const employerMedicare = salary * 0.0145;
        const futa = Math.min(salary, 7000) * 0.006;
        const suta = Math.min(salary, sutaBase) * (sutaRate / 100);

        const totalPayrollTaxes = employerSS + employerMedicare + futa + suta;
        const totalBenefits = health + retirement + workersComp + otherBenefits;
        const totalCost = salary + totalPayrollTaxes + totalBenefits;
        const costMultiplier = totalCost / salary;

        return {
          primary: {
            label: "Total Employer Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            {
              label: "Base salary",
              value: `$${formatNumber(salary)}`,
            },
            {
              label: "Employer Social Security (6.2%)",
              value: `$${formatNumber(employerSS)}`,
            },
            {
              label: "Employer Medicare (1.45%)",
              value: `$${formatNumber(employerMedicare)}`,
            },
            {
              label: "FUTA (0.6%)",
              value: `$${formatNumber(futa)}`,
            },
            {
              label: "SUTA",
              value: `$${formatNumber(suta)}`,
            },
            {
              label: "Total payroll taxes",
              value: `$${formatNumber(totalPayrollTaxes)}`,
            },
            {
              label: "Total benefits",
              value: `$${formatNumber(totalBenefits)}`,
            },
            {
              label: "Cost multiplier",
              value: `${formatNumber(costMultiplier)}x salary`,
            },
          ],
          note: "The true cost of an employee is typically 1.25x to 1.4x their salary when payroll taxes and benefits are included. FUTA applies to first $7,000 of wages per employee.",
        };
      },
    },
  ],
  relatedSlugs: [
    "payroll-withholding-calculator",
    "paycheck-calculator",
    "social-security-tax-calculator",
  ],
  faq: [
    {
      question: "What payroll taxes does an employer pay?",
      answer:
        "Employers pay 6.2% Social Security (on first $168,600), 1.45% Medicare, 0.6% FUTA (on first $7,000), and state unemployment tax (SUTA, varies by state). Total employer payroll taxes are typically about 8-10% of salary.",
    },
    {
      question: "How much more does an employee cost beyond salary?",
      answer:
        "Including payroll taxes, health insurance, retirement contributions, and other benefits, an employee typically costs 1.25x to 1.4x their base salary. For a $75,000 salary, the true cost is usually $94,000 to $105,000.",
    },
  ],
  formula:
    "Total Cost = Salary + SS (6.2%) + Medicare (1.45%) + FUTA (0.6%) + SUTA + Benefits",
};
