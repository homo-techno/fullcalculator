import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const employerPayrollTaxCalculator: CalculatorDefinition = {
  slug: "employer-payroll-tax-calculator",
  title: "Employer Payroll Tax Calculator",
  description: "Calculate the total employer-side payroll taxes including FICA, FUTA, and state unemployment for an employee.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["employer payroll tax", "employer fica", "employer tax cost per employee"],
  variants: [{
    id: "standard",
    name: "Employer Payroll Tax",
    description: "Calculate the total employer-side payroll taxes including FICA, FUTA, and state unemployment for an employee",
    fields: [
      { name: "annualSalary", label: "Employee Annual Salary", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 60000 },
      { name: "stateRate", label: "State Unemployment Rate (SUTA)", type: "number", suffix: "%", min: 0.5, max: 10, step: 0.1, defaultValue: 2.7 },
      { name: "sutaWageBase", label: "State Unemployment Wage Base", type: "number", prefix: "$", min: 7000, max: 60000, step: 1000, defaultValue: 10000 },
    ],
    calculate: (inputs) => {
      const salary = inputs.annualSalary as number;
      const stateRate = inputs.stateRate as number;
      const sutaBase = inputs.sutaWageBase as number;
      if (!salary || salary <= 0) return null;
      const ssWageBase = 168600;
      const ssTax = Math.min(salary, ssWageBase) * 0.062;
      const medicareTax = salary * 0.0145;
      const futaTaxable = Math.min(salary, 7000);
      const futaTax = futaTaxable * 0.006;
      const sutaTax = Math.min(salary, sutaBase || 10000) * ((stateRate || 2.7) / 100);
      const totalEmployerTax = ssTax + medicareTax + futaTax + sutaTax;
      const costPercentage = (totalEmployerTax / salary) * 100;
      const totalCostOfEmployee = salary + totalEmployerTax;
      return {
        primary: { label: "Total Employer Payroll Tax", value: "$" + formatNumber(Math.round(totalEmployerTax)) },
        details: [
          { label: "Social Security (6.2%)", value: "$" + formatNumber(Math.round(ssTax)) },
          { label: "Medicare (1.45%)", value: "$" + formatNumber(Math.round(medicareTax)) },
          { label: "FUTA + SUTA", value: "$" + formatNumber(Math.round(futaTax + sutaTax)) },
        ],
      };
    },
  }],
  relatedSlugs: ["w4-calculator", "cost-per-hire-calculator"],
  faq: [
    { question: "What payroll taxes does an employer pay?", answer: "Employers pay 6.2 percent Social Security tax (up to the wage base), 1.45 percent Medicare tax, 0.6 percent FUTA (federal unemployment) on the first $7,000, and state unemployment (SUTA) at rates that vary by state and employer history." },
    { question: "What is the Social Security wage base?", answer: "The Social Security wage base is the maximum amount of earnings subject to Social Security tax. For 2024, the wage base is $168,600. Earnings above this amount are not subject to the 6.2 percent Social Security tax." },
  ],
  formula: "Employer Tax = Social Security (6.2% up to wage base) + Medicare (1.45%) + FUTA (0.6% on $7,000) + SUTA",
};
