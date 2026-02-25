import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const privateStudentLoanCalculator: CalculatorDefinition = {
  slug: "private-student-loan-calculator",
  title: "Private Student Loan Calculator",
  description:
    "Free private student loan calculator. Estimate monthly payments, total interest, and total cost for private student loans with fixed or variable rates and various terms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "private student loan calculator",
    "private student loan payment",
    "private education loan",
    "student loan calculator",
    "private college loan",
    "student loan interest",
  ],
  variants: [
    {
      id: "private-student-loan-payment",
      name: "Private Student Loan Payment",
      description: "Calculate payments for a private student loan",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 7.5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.01,
        },
        {
          name: "rateType",
          label: "Rate Type",
          type: "select",
          options: [
            { label: "Fixed rate", value: "fixed" },
            { label: "Variable rate", value: "variable" },
          ],
          defaultValue: "fixed",
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
            { label: "12 years", value: "12" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "10",
        },
        {
          name: "repaymentType",
          label: "In-School Repayment",
          type: "select",
          options: [
            { label: "Full payments in school", value: "full" },
            { label: "Interest-only in school", value: "interest" },
            { label: "Deferred (no payments in school)", value: "deferred" },
          ],
          defaultValue: "deferred",
        },
        {
          name: "schoolYears",
          label: "Years Remaining in School",
          type: "select",
          options: [
            { label: "0 (already graduated)", value: "0" },
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "4 years", value: "4" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 10;
        const repayType = inputs.repaymentType as string;
        const schoolYears = parseInt(inputs.schoolYears as string) || 0;
        if (!loan || !rate) return null;

        const mr = rate / 100 / 12;
        const schoolMonths = schoolYears * 12;

        let balanceAtRepayment = loan;
        let inSchoolCost = 0;

        if (schoolYears > 0) {
          if (repayType === "deferred") {
            // Interest capitalizes
            balanceAtRepayment = loan * Math.pow(1 + mr, schoolMonths);
            inSchoolCost = 0;
          } else if (repayType === "interest") {
            const monthlyInterest = loan * mr;
            inSchoolCost = monthlyInterest * schoolMonths;
            balanceAtRepayment = loan;
          } else {
            // Full payments in school
            const n = (years + schoolYears) * 12;
            const fullPayment =
              (loan * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
            inSchoolCost = fullPayment * schoolMonths;
            let bal = loan;
            for (let i = 0; i < schoolMonths; i++) {
              const int = bal * mr;
              bal = bal + int - fullPayment;
            }
            balanceAtRepayment = Math.max(0, bal);
          }
        }

        const n = years * 12;
        const monthly =
          (balanceAtRepayment * (mr * Math.pow(1 + mr, n))) /
          (Math.pow(1 + mr, n) - 1);
        const totalRepayment = monthly * n;
        const totalInterest = totalRepayment - balanceAtRepayment + (balanceAtRepayment - loan) + inSchoolCost;
        const totalCost = totalRepayment + inSchoolCost;
        const capitalizedInterest = balanceAtRepayment - loan;

        return {
          primary: {
            label: "Monthly Payment (after school)",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Original loan amount", value: `$${formatNumber(loan)}` },
            { label: "Balance at repayment start", value: `$${formatNumber(balanceAtRepayment)}` },
            { label: "Capitalized interest", value: `$${formatNumber(Math.max(0, capitalizedInterest))}` },
            { label: "In-school payments total", value: `$${formatNumber(inSchoolCost)}` },
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["parent-plus-loan-calculator", "student-loan-refinance-calculator"],
  faq: [
    {
      question: "How do private student loans differ from federal loans?",
      answer:
        "Private student loans are from banks and lenders, not the government. They typically have higher rates, require a credit check or cosigner, lack income-driven repayment options, and don't qualify for federal forgiveness programs.",
    },
    {
      question: "Should I choose fixed or variable rate?",
      answer:
        "Fixed rates provide predictable payments but start higher. Variable rates start lower but can increase over time. If you plan to pay off quickly (5-7 years), a variable rate may save money. For longer terms, fixed is generally safer.",
    },
    {
      question: "What is interest capitalization?",
      answer:
        "When you defer payments during school, unpaid interest is added to your principal balance (capitalized). This means you pay interest on interest, increasing your total cost significantly. Interest-only payments prevent this.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Deferred balance = L x (1 + r/12)^school_months.",
};
