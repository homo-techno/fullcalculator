import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const payrollTaxCalculator: CalculatorDefinition = {
  slug: "payroll-tax-calculator",
  title: "Payroll Tax Calculator",
  description:
    "Free payroll tax calculator. Calculate FICA taxes including Social Security (6.2%) and Medicare (1.45%) withholdings from your gross salary.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["payroll tax", "FICA", "social security", "medicare", "withholding"],
  variants: [
    {
      id: "employee",
      name: "Employee FICA Taxes",
      fields: [
        { name: "grossSalary", label: "Annual Gross Salary ($)", type: "number", placeholder: "e.g. 85000" },
      ],
      calculate: (inputs) => {
        const grossSalary = inputs.grossSalary as number;
        if (!grossSalary) return null;

        const ssWageCap = 168600;
        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const additionalMedicareThreshold = 200000;
        const additionalMedicareRate = 0.009;

        const ssTaxable = Math.min(grossSalary, ssWageCap);
        const ssTax = ssTaxable * ssRate;
        const medicareTax = grossSalary * medicareRate;
        const additionalMedicare = grossSalary > additionalMedicareThreshold
          ? (grossSalary - additionalMedicareThreshold) * additionalMedicareRate
          : 0;
        const totalMedicare = medicareTax + additionalMedicare;
        const totalPayrollTax = ssTax + totalMedicare;
        const effectiveRate = (totalPayrollTax / grossSalary) * 100;
        const netAfterFICA = grossSalary - totalPayrollTax;

        return {
          primary: { label: "Total FICA Tax", value: `$${formatNumber(totalPayrollTax, 2)}` },
          details: [
            { label: "Social Security Tax (6.2%)", value: `$${formatNumber(ssTax, 2)}` },
            { label: "SS Taxable Wages", value: `$${formatNumber(ssTaxable, 2)}` },
            { label: "Medicare Tax (1.45%)", value: `$${formatNumber(medicareTax, 2)}` },
            { label: "Additional Medicare (0.9%)", value: `$${formatNumber(additionalMedicare, 2)}` },
            { label: "Effective FICA Rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "Net After FICA", value: `$${formatNumber(netAfterFICA, 2)}` },
            { label: "Monthly FICA Deduction", value: `$${formatNumber(totalPayrollTax / 12, 2)}` },
          ],
        };
      },
    },
    {
      id: "employer",
      name: "Employer + Employee (Total)",
      fields: [
        { name: "grossSalary", label: "Annual Gross Salary ($)", type: "number", placeholder: "e.g. 85000" },
      ],
      calculate: (inputs) => {
        const grossSalary = inputs.grossSalary as number;
        if (!grossSalary) return null;

        const ssWageCap = 168600;
        const ssRate = 0.062;
        const medicareRate = 0.0145;

        const ssTaxable = Math.min(grossSalary, ssWageCap);
        const employeeSS = ssTaxable * ssRate;
        const employerSS = ssTaxable * ssRate;
        const employeeMedicare = grossSalary * medicareRate;
        const employerMedicare = grossSalary * medicareRate;

        const employeeTotal = employeeSS + employeeMedicare;
        const employerTotal = employerSS + employerMedicare;
        const combinedTotal = employeeTotal + employerTotal;

        return {
          primary: { label: "Total FICA (Both Sides)", value: `$${formatNumber(combinedTotal, 2)}` },
          details: [
            { label: "Employee Share", value: `$${formatNumber(employeeTotal, 2)}` },
            { label: "Employer Share", value: `$${formatNumber(employerTotal, 2)}` },
            { label: "Combined SS Tax (12.4%)", value: `$${formatNumber(employeeSS + employerSS, 2)}` },
            { label: "Combined Medicare (2.9%)", value: `$${formatNumber(employeeMedicare + employerMedicare, 2)}` },
            { label: "Total Cost to Employer", value: `$${formatNumber(grossSalary + employerTotal, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tax-bracket-calculator", "budget-calculator", "payroll-tax-calculator"],
  faq: [
    { question: "What is FICA?", answer: "FICA stands for Federal Insurance Contributions Act. It includes Social Security (6.2% on wages up to $168,600) and Medicare (1.45% on all wages) taxes, paid by both employees and employers." },
    { question: "What is the additional Medicare tax?", answer: "An additional 0.9% Medicare tax applies to wages exceeding $200,000 for single filers. This is only paid by the employee, not matched by the employer." },
  ],
  formula: "Social Security = min(salary, $168,600) × 6.2%; Medicare = salary × 1.45%; Total FICA = SS + Medicare",
};
