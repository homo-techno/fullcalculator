import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentLoanRefinanceCalculator: CalculatorDefinition = {
  slug: "student-loan-refinance-calculator",
  title: "Student Loan Refinance Calculator",
  description:
    "Free student loan refinance calculator. Compare your current student loan payments with refinanced options to see potential savings on monthly payments and total interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "student loan refinance calculator",
    "refinance student loans",
    "student loan refinancing savings",
    "consolidate student loans",
    "student loan rate",
    "student debt refinance",
  ],
  variants: [
    {
      id: "student-refinance-savings",
      name: "Student Loan Refinance Savings",
      description: "Compare current student loans with refinance options",
      fields: [
        {
          name: "totalBalance",
          label: "Total Student Loan Balance",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentRate",
          label: "Current Weighted Avg Rate",
          type: "number",
          placeholder: "e.g. 6.8",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.01,
        },
        {
          name: "currentRemainingYears",
          label: "Years Remaining on Current Loans",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "10",
        },
        {
          name: "newRate",
          label: "New Refinance Rate",
          type: "number",
          placeholder: "e.g. 4.5",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.01,
        },
        {
          name: "newTerm",
          label: "New Loan Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "7",
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.totalBalance as number;
        const currentRate = inputs.currentRate as number;
        const currentYears = parseInt(inputs.currentRemainingYears as string) || 10;
        const newRate = inputs.newRate as number;
        const newYears = parseInt(inputs.newTerm as string) || 7;
        if (!balance || !currentRate || !newRate) return null;

        const calcMonthly = (l: number, r: number, y: number) => {
          const mr = r / 100 / 12;
          const n = y * 12;
          return (l * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        };

        const currentMonthly = calcMonthly(balance, currentRate, currentYears);
        const newMonthly = calcMonthly(balance, newRate, newYears);

        const currentTotal = currentMonthly * currentYears * 12;
        const newTotal = newMonthly * newYears * 12;

        const currentInterest = currentTotal - balance;
        const newInterest = newTotal - balance;

        const monthlySavings = currentMonthly - newMonthly;
        const totalSavings = currentInterest - newInterest;

        return {
          primary: {
            label: "Total Interest Savings",
            value: `$${formatNumber(Math.max(0, totalSavings))}`,
          },
          details: [
            { label: "Current monthly payment", value: `$${formatNumber(currentMonthly)}` },
            { label: "New monthly payment", value: `$${formatNumber(newMonthly)}` },
            { label: "Monthly difference", value: `$${formatNumber(monthlySavings)}` },
            { label: "Current total interest", value: `$${formatNumber(currentInterest)}` },
            { label: "New total interest", value: `$${formatNumber(newInterest)}` },
            { label: "Current payoff", value: `${currentYears} years` },
            { label: "New payoff", value: `${newYears} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["private-student-loan-calculator", "income-driven-repayment-calculator"],
  faq: [
    {
      question: "Should I refinance my student loans?",
      answer:
        "Refinancing makes sense if you can get a significantly lower rate, have stable income, and don't need federal loan protections. Be aware that refinancing federal loans into private ones means losing access to income-driven repayment and forgiveness programs.",
    },
    {
      question: "What rate can I get when refinancing?",
      answer:
        "Refinance rates typically range from 3% to 9% depending on your credit score, income, and the lender. Borrowers with excellent credit and high income may qualify for rates well below their current federal loan rates.",
    },
    {
      question: "Can I refinance federal and private loans together?",
      answer:
        "Yes, you can refinance both federal and private student loans into a single private loan. However, your federal loans will lose government protections like income-driven repayment, deferment, and Public Service Loan Forgiveness.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Savings = Current Total Interest - New Total Interest.",
};
