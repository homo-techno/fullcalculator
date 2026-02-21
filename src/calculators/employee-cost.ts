import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const employeeCostCalculator: CalculatorDefinition = {
  slug: "employee-cost-calculator",
  title: "Employee Cost Calculator",
  description: "Free employee cost calculator. Calculate the true total cost of an employee including salary, benefits, taxes, and overhead.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["employee cost calculator", "total cost of employee", "cost per employee", "employee burden rate", "true cost of hiring"],
  variants: [
    {
      id: "total",
      name: "Total Employee Cost",
      description: "Calculate the full cost of employing someone including benefits, taxes, and overhead",
      fields: [
        { name: "salary", label: "Annual Base Salary", type: "number", placeholder: "e.g. 65000", prefix: "$" },
        { name: "healthInsurance", label: "Health Insurance (annual)", type: "number", placeholder: "e.g. 7200", prefix: "$" },
        { name: "retirementMatch", label: "Retirement Match %", type: "number", placeholder: "e.g. 4", suffix: "%", defaultValue: 4 },
        { name: "payrollTaxRate", label: "Employer Payroll Tax %", type: "number", placeholder: "e.g. 7.65", suffix: "%", defaultValue: 7.65 },
        { name: "otherBenefits", label: "Other Benefits (annual)", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "overhead", label: "Overhead (equipment, space, etc.)", type: "number", placeholder: "e.g. 5000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        if (!salary) return null;
        const health = (inputs.healthInsurance as number) || 0;
        const retireRate = (inputs.retirementMatch as number) || 0;
        const payrollRate = (inputs.payrollTaxRate as number) || 7.65;
        const otherBenefits = (inputs.otherBenefits as number) || 0;
        const overhead = (inputs.overhead as number) || 0;
        const retirementCost = salary * (retireRate / 100);
        const payrollTax = salary * (payrollRate / 100);
        const totalCost = salary + health + retirementCost + payrollTax + otherBenefits + overhead;
        const burdenRate = ((totalCost - salary) / salary) * 100;
        const monthlyCost = totalCost / 12;
        const hourlyEquivalent = totalCost / 2080;
        return {
          primary: { label: "Total Annual Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Base Salary", value: `$${formatNumber(salary)}` },
            { label: "Health Insurance", value: `$${formatNumber(health)}` },
            { label: "Retirement Match", value: `$${formatNumber(retirementCost)}` },
            { label: "Payroll Taxes", value: `$${formatNumber(payrollTax)}` },
            { label: "Other Benefits", value: `$${formatNumber(otherBenefits)}` },
            { label: "Overhead", value: `$${formatNumber(overhead)}` },
            { label: "Burden Rate", value: `${formatNumber(burdenRate)}%` },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyCost)}` },
            { label: "Effective Hourly Cost", value: `$${formatNumber(hourlyEquivalent)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Employee vs Contractor",
      description: "Compare the cost of a full-time employee vs independent contractor",
      fields: [
        { name: "salary", label: "Employee Annual Salary", type: "number", placeholder: "e.g. 65000", prefix: "$" },
        { name: "benefitsCost", label: "Total Benefits Cost (annual)", type: "number", placeholder: "e.g. 15000", prefix: "$" },
        { name: "payrollTaxRate", label: "Employer Payroll Tax %", type: "number", placeholder: "e.g. 7.65", suffix: "%", defaultValue: 7.65 },
        { name: "contractorRate", label: "Contractor Hourly Rate", type: "number", placeholder: "e.g. 55", prefix: "$" },
        { name: "contractorHours", label: "Contractor Hours/Year", type: "number", placeholder: "e.g. 2080", defaultValue: 2080 },
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        const benefits = (inputs.benefitsCost as number) || 0;
        const payrollRate = (inputs.payrollTaxRate as number) || 7.65;
        const contractorRate = inputs.contractorRate as number;
        const contractorHours = (inputs.contractorHours as number) || 2080;
        if (!salary || !contractorRate) return null;
        const payrollTax = salary * (payrollRate / 100);
        const employeeTotal = salary + benefits + payrollTax;
        const contractorTotal = contractorRate * contractorHours;
        const difference = contractorTotal - employeeTotal;
        return {
          primary: { label: "Cost Difference", value: `$${formatNumber(Math.abs(difference))}`, suffix: difference > 0 ? "contractor costs more" : "employee costs more" },
          details: [
            { label: "Total Employee Cost", value: `$${formatNumber(employeeTotal)}` },
            { label: "Total Contractor Cost", value: `$${formatNumber(contractorTotal)}` },
            { label: "Employee Effective Hourly", value: `$${formatNumber(employeeTotal / 2080)}` },
            { label: "Contractor Hourly Rate", value: `$${formatNumber(contractorRate)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "payroll-tax-calculator"],
  faq: [
    { question: "What is the true cost of an employee?", answer: "The true cost is typically 1.25x to 1.4x the base salary. This includes employer payroll taxes (7.65% for FICA), health insurance ($7,000-$22,000/year), retirement contributions, workers comp, and overhead like equipment and office space." },
    { question: "What is a burden rate?", answer: "The burden rate is the percentage of additional costs on top of base salary. If an employee earns $65,000 and total additional costs are $20,000, the burden rate is 30.8%. Average burden rates range from 25-40%." },
    { question: "What employer payroll taxes are required?", answer: "Employers must pay 6.2% Social Security tax (up to the wage base limit), 1.45% Medicare tax, federal unemployment tax (FUTA) of 0.6%, and state unemployment tax (SUTA) which varies by state." },
  ],
  formula: "Total Cost = Salary + Benefits + Payroll Taxes + Retirement Match + Overhead | Burden Rate = (Total Cost - Salary) / Salary × 100",
};
