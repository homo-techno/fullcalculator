import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fourOhOneKLoanCalculator: CalculatorDefinition = {
  slug: "401k-loan-calculator",
  title: "401(k) Loan Calculator",
  description:
    "Free 401(k) loan calculator. Estimate monthly payments, interest cost, and the impact on your retirement savings when borrowing from your 401(k) plan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "401k loan calculator",
    "401k withdrawal calculator",
    "borrow from 401k",
    "retirement loan calculator",
    "401k loan impact",
    "retirement plan loan",
  ],
  variants: [
    {
      id: "401k-loan-impact",
      name: "401(k) Loan Impact",
      description: "Calculate 401(k) loan payments and retirement impact",
      fields: [
        {
          name: "accountBalance",
          label: "Current 401(k) Balance",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "$",
          min: 0,
        },
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "loanRate",
          label: "Loan Interest Rate",
          type: "number",
          placeholder: "e.g. 5.5",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.01,
        },
        {
          name: "term",
          label: "Repayment Term",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
          ],
          defaultValue: "5",
        },
        {
          name: "expectedReturn",
          label: "Expected Market Return",
          type: "select",
          options: [
            { label: "5% per year", value: "5" },
            { label: "7% per year", value: "7" },
            { label: "8% per year", value: "8" },
            { label: "10% per year", value: "10" },
          ],
          defaultValue: "7",
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.accountBalance as number;
        const loanAmt = inputs.loanAmount as number;
        const loanRate = inputs.loanRate as number;
        const years = parseInt(inputs.term as string) || 5;
        const marketReturn = parseFloat(inputs.expectedReturn as string) || 7;
        if (!balance || !loanAmt || !loanRate) return null;

        const maxLoan = Math.min(balance * 0.5, 50000);
        const actualLoan = Math.min(loanAmt, maxLoan);

        const mr = loanRate / 100 / 12;
        const n = years * 12;
        const monthly =
          (actualLoan * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - actualLoan;

        // Opportunity cost: what the loan amount would have earned
        const growthWithoutLoan = actualLoan * Math.pow(1 + marketReturn / 100, years);
        const opportunityCost = growthWithoutLoan - actualLoan;

        // Net cost = opportunity cost - interest paid back (since interest goes back to your account)
        const netCost = opportunityCost - totalInterest;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Maximum allowed loan", value: `$${formatNumber(maxLoan)}` },
            { label: "Actual loan amount", value: `$${formatNumber(actualLoan)}` },
            { label: "Total interest (paid to yourself)", value: `$${formatNumber(totalInterest)}` },
            { label: "Total repayment", value: `$${formatNumber(totalPaid)}` },
            { label: "Missed market growth", value: `$${formatNumber(opportunityCost)}` },
            { label: "Net opportunity cost", value: `$${formatNumber(Math.max(0, netCost))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["personal-loan-calculator", "margin-loan-calculator"],
  faq: [
    {
      question: "How much can I borrow from my 401(k)?",
      answer:
        "You can borrow up to 50% of your vested balance or $50,000, whichever is less. Some plans have a minimum loan amount of $1,000. Not all 401(k) plans allow loans.",
    },
    {
      question: "Do I pay interest to myself?",
      answer:
        "Yes, the interest you pay on a 401(k) loan goes back into your own account. However, you pay with after-tax dollars, and the interest will be taxed again when withdrawn in retirement, creating double taxation.",
    },
    {
      question: "What happens if I leave my job?",
      answer:
        "If you leave your job or are terminated, you typically must repay the outstanding loan balance within 60-90 days. If you cannot repay, the remaining balance is treated as a distribution, subject to income tax and a 10% early withdrawal penalty if you're under 59.5.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Opportunity Cost = Loan x (1 + Market Return)^Years - Loan.",
};
