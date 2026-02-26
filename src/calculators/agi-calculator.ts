import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const agiCalculator: CalculatorDefinition = {
  slug: "agi-calculator",
  title: "Adjusted Gross Income (AGI) Calculator",
  description:
    "Free AGI calculator. Estimate your Adjusted Gross Income by subtracting above-the-line deductions from your total gross income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "agi calculator",
    "adjusted gross income",
    "above the line deductions",
    "gross income calculator",
    "tax deductions",
  ],
  variants: [
    {
      id: "standard",
      name: "AGI Calculator",
      description:
        "Calculate your Adjusted Gross Income from gross income and above-the-line deductions",
      fields: [
        {
          name: "wagesIncome",
          label: "Wages & Salary",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "selfEmploymentIncome",
          label: "Self-Employment Income",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "interestIncome",
          label: "Interest & Dividend Income",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherIncome",
          label: "Other Income (Rental, Capital Gains, etc.)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "educatorExpenses",
          label: "Educator Expenses (up to $300)",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "studentLoanInterest",
          label: "Student Loan Interest (up to $2,500)",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "hsaDeduction",
          label: "HSA Deduction",
          type: "number",
          placeholder: "e.g. 3850",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "iraDeduction",
          label: "Traditional IRA Deduction",
          type: "number",
          placeholder: "e.g. 6500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "seTaxDeduction",
          label: "Deductible Half of SE Tax",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "alimonyPaid",
          label: "Alimony Paid (pre-2019 agreements)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const wages = parseFloat(inputs.wagesIncome as string) || 0;
        const seIncome = parseFloat(inputs.selfEmploymentIncome as string) || 0;
        const interest = parseFloat(inputs.interestIncome as string) || 0;
        const other = parseFloat(inputs.otherIncome as string) || 0;

        const educator = Math.min(parseFloat(inputs.educatorExpenses as string) || 0, 300);
        const studentLoan = Math.min(parseFloat(inputs.studentLoanInterest as string) || 0, 2500);
        const hsa = parseFloat(inputs.hsaDeduction as string) || 0;
        const ira = parseFloat(inputs.iraDeduction as string) || 0;
        const seTax = parseFloat(inputs.seTaxDeduction as string) || 0;
        const alimony = parseFloat(inputs.alimonyPaid as string) || 0;

        const grossIncome = wages + seIncome + interest + other;
        if (grossIncome <= 0) return null;

        const totalDeductions = educator + studentLoan + hsa + ira + seTax + alimony;
        const agi = Math.max(0, grossIncome - totalDeductions);

        return {
          primary: { label: "Adjusted Gross Income (AGI)", value: `$${formatNumber(agi)}` },
          details: [
            { label: "Total gross income", value: `$${formatNumber(grossIncome)}` },
            { label: "Total above-the-line deductions", value: `$${formatNumber(totalDeductions)}` },
            { label: "Educator expenses deduction", value: `$${formatNumber(educator)}` },
            { label: "Student loan interest deduction", value: `$${formatNumber(studentLoan)}` },
            { label: "HSA deduction", value: `$${formatNumber(hsa)}` },
            { label: "IRA deduction", value: `$${formatNumber(ira)}` },
          ],
          note: "AGI is used to determine eligibility for many tax credits and deductions. Above-the-line deductions can be taken regardless of whether you itemize.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "magi-calculator", "fica-tax-calculator"],
  faq: [
    {
      question: "What is Adjusted Gross Income (AGI)?",
      answer:
        "AGI is your total gross income minus specific above-the-line deductions. It includes wages, self-employment income, interest, dividends, rental income, and capital gains, minus deductions like student loan interest, HSA contributions, and IRA deductions.",
    },
    {
      question: "Why is AGI important?",
      answer:
        "AGI determines your eligibility for many tax benefits including IRA deductions, student loan interest deductions, and various tax credits. It's also the starting point for calculating your taxable income on Form 1040.",
    },
    {
      question: "What are above-the-line deductions?",
      answer:
        "Above-the-line deductions are subtracted from gross income to arrive at AGI. They include educator expenses ($300 max), student loan interest ($2,500 max), HSA contributions, IRA contributions, and half of self-employment tax. You can claim these even without itemizing.",
    },
  ],
  formula: "AGI = Gross Income - Above-the-Line Deductions",
};
