import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const simpleIraCalculator: CalculatorDefinition = {
  slug: "simple-ira-calculator",
  title: "SIMPLE IRA Calculator",
  description:
    "Calculate SIMPLE IRA contributions, employer matching, and projected growth. Compare SIMPLE IRA with other retirement plans for small businesses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["SIMPLE IRA", "small business retirement", "employer match", "retirement savings", "SIMPLE plan"],
  variants: [
    {
      id: "contributionAndGrowth",
      name: "Contribution & Growth",
      fields: [
        { name: "annualSalary", label: "Annual Salary ($)", type: "number", placeholder: "e.g. 60000" },
        { name: "employeeContribution", label: "Employee Contribution ($)", type: "number", placeholder: "e.g. 13500" },
        { name: "employerMatchPercent", label: "Employer Match (%)", type: "number", placeholder: "e.g. 3" },
        { name: "age", label: "Current Age", type: "number", placeholder: "e.g. 40" },
        { name: "retirementAge", label: "Retirement Age", type: "number", placeholder: "e.g. 65" },
        { name: "currentBalance", label: "Current Balance ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const annualSalary = inputs.annualSalary as number;
        const employeeContribution = inputs.employeeContribution as number;
        const employerMatchPercent = (inputs.employerMatchPercent as number) / 100;
        const age = inputs.age as number;
        const retirementAge = inputs.retirementAge as number;
        const currentBalance = inputs.currentBalance as number || 0;
        const returnRate = (inputs.returnRate as number) / 100;

        if (!annualSalary || !employeeContribution || !age || !retirementAge || !returnRate) return null;

        const maxContribution = age >= 50 ? 19500 : 16000;
        const actualContribution = Math.min(employeeContribution, maxContribution);
        const employerMatch = Math.min(annualSalary * employerMatchPercent, annualSalary * 0.03);
        const totalAnnual = actualContribution + employerMatch;
        const years = retirementAge - age;

        let balance = currentBalance;
        for (let i = 0; i < years; i++) {
          balance = (balance + totalAnnual) * (1 + returnRate);
        }

        const totalEmployeeContributions = actualContribution * years;
        const totalEmployerContributions = employerMatch * years;
        const growth = balance - currentBalance - totalEmployeeContributions - totalEmployerContributions;

        return {
          primary: { label: "Projected Balance at Retirement", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Your Annual Contribution", value: `$${formatNumber(actualContribution, 0)}` },
            { label: "Employer Annual Match", value: `$${formatNumber(employerMatch, 0)}` },
            { label: "Total Annual Contribution", value: `$${formatNumber(totalAnnual, 0)}` },
            { label: "Total Employee Contributions", value: `$${formatNumber(totalEmployeeContributions, 0)}` },
            { label: "Total Employer Contributions", value: `$${formatNumber(totalEmployerContributions, 0)}` },
            { label: "Investment Growth", value: `$${formatNumber(growth, 0)}` },
          ],
        };
      },
    },
    {
      id: "simpleVsSep",
      name: "SIMPLE IRA vs SEP IRA",
      fields: [
        { name: "annualIncome", label: "Annual Income ($)", type: "number", placeholder: "e.g. 80000" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 45" },
        { name: "yearsToRetire", label: "Years to Retirement", type: "number", placeholder: "e.g. 20" },
        { name: "returnRate", label: "Expected Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const annualIncome = inputs.annualIncome as number;
        const age = inputs.age as number;
        const yearsToRetire = inputs.yearsToRetire as number;
        const returnRate = (inputs.returnRate as number) / 100;

        if (!annualIncome || !age || !yearsToRetire || !returnRate) return null;

        const simpleLimit = age >= 50 ? 19500 : 16000;
        const simpleEmployerMatch = annualIncome * 0.03;
        const simpleTotal = Math.min(simpleLimit + simpleEmployerMatch, annualIncome);

        const sepLimit = Math.min(annualIncome * 0.25, 69000);

        let simpleBalance = 0;
        let sepBalance = 0;
        for (let i = 0; i < yearsToRetire; i++) {
          simpleBalance = (simpleBalance + simpleTotal) * (1 + returnRate);
          sepBalance = (sepBalance + sepLimit) * (1 + returnRate);
        }

        const difference = sepBalance - simpleBalance;

        return {
          primary: { label: "SIMPLE IRA Max Annual", value: `$${formatNumber(simpleTotal, 0)}` },
          details: [
            { label: "SEP IRA Max Annual", value: `$${formatNumber(sepLimit, 0)}` },
            { label: "SIMPLE IRA Projected Balance", value: `$${formatNumber(simpleBalance, 0)}` },
            { label: "SEP IRA Projected Balance", value: `$${formatNumber(sepBalance, 0)}` },
            { label: "SEP IRA Advantage", value: `$${formatNumber(Math.max(difference, 0), 0)}` },
            { label: "Better Option", value: sepLimit > simpleTotal ? "SEP IRA (higher limit)" : "SIMPLE IRA" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sep-ira-calculator", "ira-contribution-limit-calculator", "401k-calculator", "roth-ira-calculator"],
  faq: [
    { question: "What is a SIMPLE IRA?", answer: "A Savings Incentive Match Plan for Employees (SIMPLE) IRA is a retirement plan for small businesses with 100 or fewer employees. Employers must either match employee contributions up to 3% of salary or make a 2% nonelective contribution." },
    { question: "What is the SIMPLE IRA contribution limit?", answer: "For 2024, the employee contribution limit is $16,000 ($19,500 for age 50+). Employer matching is up to 3% of salary. Combined limits are lower than a SEP IRA or 401(k)." },
  ],
  formula: "Total Contribution = Employee Deferral + Employer Match (up to 3% of salary)",
};
