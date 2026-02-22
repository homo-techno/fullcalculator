import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epfCalculator: CalculatorDefinition = {
  slug: "epf-calculator",
  title: "EPF Calculator",
  description:
    "Free EPF calculator. Calculate Employee Provident Fund maturity amount, employer contribution, and interest earned. Plan your retirement with EPF.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "EPF calculator",
    "PF calculator",
    "employee provident fund calculator",
    "EPF interest calculator",
    "EPF maturity",
    "provident fund",
  ],
  variants: [
    {
      id: "basic",
      name: "EPF Maturity Calculator",
      description: "Calculate EPF corpus at retirement with annual salary increments",
      fields: [
        {
          name: "basicSalary",
          label: "Monthly Basic Salary + DA",
          type: "number",
          placeholder: "e.g. 30000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "currentAge",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "years",
          min: 18,
          max: 57,
        },
        {
          name: "retirementAge",
          label: "Retirement Age",
          type: "number",
          placeholder: "e.g. 58",
          suffix: "years",
          min: 40,
          max: 60,
          defaultValue: 58,
        },
        {
          name: "epfRate",
          label: "EPF Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 8.15",
          suffix: "%",
          min: 1,
          max: 15,
          step: 0.01,
          defaultValue: 8.15,
        },
        {
          name: "annualIncrement",
          label: "Expected Annual Salary Increment",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.5,
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const basicSalary = inputs.basicSalary as number;
        const currentAge = inputs.currentAge as number;
        const retirementAge = inputs.retirementAge as number;
        const epfRate = inputs.epfRate as number;
        const annualIncrement = inputs.annualIncrement as number;
        if (!basicSalary || !currentAge || !retirementAge) return null;

        const years = retirementAge - currentAge;
        if (years <= 0) return null;

        const monthlyRate = epfRate / 100 / 12;
        const employeeContribRate = 0.12; // 12%
        const employerContribRate = 0.0367; // 3.67% (8.33% goes to EPS)

        let balance = 0;
        let totalEmployeeContrib = 0;
        let totalEmployerContrib = 0;
        let currentBasic = basicSalary;

        for (let year = 0; year < years; year++) {
          for (let month = 0; month < 12; month++) {
            const employeeContrib = currentBasic * employeeContribRate;
            const employerContrib = currentBasic * employerContribRate;
            totalEmployeeContrib += employeeContrib;
            totalEmployerContrib += employerContrib;
            balance = (balance + employeeContrib + employerContrib) * (1 + monthlyRate);
          }
          currentBasic = currentBasic * (1 + annualIncrement / 100);
        }

        const totalInterest = balance - totalEmployeeContrib - totalEmployerContrib;

        return {
          primary: { label: "EPF Corpus at Retirement", value: `₹${formatNumber(balance)}` },
          details: [
            { label: "Your contribution (12%)", value: `₹${formatNumber(totalEmployeeContrib)}` },
            { label: "Employer EPF contribution (3.67%)", value: `₹${formatNumber(totalEmployerContrib)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Years to retirement", value: `${years} years` },
          ],
          note: "Employer contributes 12% of basic, of which 8.33% goes to EPS (Employee Pension Scheme) and 3.67% goes to EPF.",
        };
      },
    },
    {
      id: "withdrawal",
      name: "EPF Balance Check",
      description: "Estimate current EPF balance based on salary history",
      fields: [
        {
          name: "basicSalary",
          label: "Starting Monthly Basic + DA",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "yearsWorked",
          label: "Years Worked",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 1,
          max: 40,
        },
        {
          name: "epfRate",
          label: "Average EPF Interest Rate",
          type: "number",
          placeholder: "e.g. 8.15",
          suffix: "%",
          min: 1,
          max: 15,
          step: 0.01,
          defaultValue: 8.15,
        },
        {
          name: "annualIncrement",
          label: "Average Annual Increment",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          min: 0,
          max: 30,
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const basicSalary = inputs.basicSalary as number;
        const yearsWorked = inputs.yearsWorked as number;
        const epfRate = inputs.epfRate as number;
        const annualIncrement = inputs.annualIncrement as number;
        if (!basicSalary || !yearsWorked) return null;

        const monthlyRate = epfRate / 100 / 12;
        let balance = 0;
        let totalContrib = 0;
        let currentBasic = basicSalary;

        for (let year = 0; year < yearsWorked; year++) {
          for (let month = 0; month < 12; month++) {
            const monthlyContrib = currentBasic * 0.12 + currentBasic * 0.0367;
            totalContrib += monthlyContrib;
            balance = (balance + monthlyContrib) * (1 + monthlyRate);
          }
          currentBasic = currentBasic * (1 + annualIncrement / 100);
        }

        const totalInterest = balance - totalContrib;

        return {
          primary: { label: "Estimated EPF Balance", value: `₹${formatNumber(balance)}` },
          details: [
            { label: "Total contributions", value: `₹${formatNumber(totalContrib)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Years worked", value: `${yearsWorked} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["nps-calculator", "gratuity-calculator", "retirement-calculator"],
  faq: [
    {
      question: "What is EPF?",
      answer:
        "EPF (Employee Provident Fund) is a retirement savings scheme managed by EPFO (Employee Provident Fund Organisation) in India. Both employee and employer contribute 12% of the basic salary + DA. The employer's 12% is split: 3.67% to EPF and 8.33% to EPS.",
    },
    {
      question: "What is the current EPF interest rate?",
      answer:
        "The EPF interest rate is declared annually by the EPFO. It is typically around 8-8.5%. The rate is compounded monthly. Check the EPFO website for the current year's declared rate.",
    },
    {
      question: "When can I withdraw my EPF?",
      answer:
        "Full EPF withdrawal is allowed on retirement (58 years), resignation after 2 months of unemployment, or for specific purposes like home purchase, medical emergency, or education. Partial withdrawal rules vary by purpose and years of service.",
    },
  ],
  formula: "EPF Corpus = Σ (Employee + Employer Contribution) × (1 + monthly rate)^months",
};
