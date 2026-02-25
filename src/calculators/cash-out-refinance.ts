import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashOutRefinanceCalculator: CalculatorDefinition = {
  slug: "cash-out-refinance-calculator",
  title: "Cash-Out Refinance Calculator",
  description:
    "Free cash-out refinance calculator. Compare your current mortgage with a new cash-out refinance to see monthly payment changes, break-even point, and total costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cash out refinance calculator",
    "cash out refi",
    "refinance cash out",
    "mortgage cash out",
    "equity cash out calculator",
  ],
  variants: [
    {
      id: "cashout-compare",
      name: "Cash-Out Refinance Analysis",
      description: "Analyze your cash-out refinance scenario",
      fields: [
        {
          name: "currentBalance",
          label: "Current Mortgage Balance",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentPayment",
          label: "Current Monthly Payment (P&I)",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          min: 0,
        },
        {
          name: "homeValue",
          label: "Current Home Value",
          type: "number",
          placeholder: "e.g. 450000",
          prefix: "$",
          min: 0,
        },
        {
          name: "cashOut",
          label: "Cash-Out Amount",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "newRate",
          label: "New Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "newTerm",
          label: "New Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
        {
          name: "closingCosts",
          label: "Estimated Closing Costs",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const currentBal = inputs.currentBalance as number;
        const currentPmt = inputs.currentPayment as number;
        const homeVal = inputs.homeValue as number;
        const cashOut = inputs.cashOut as number;
        const newRate = inputs.newRate as number;
        const newYears = parseInt(inputs.newTerm as string) || 30;
        const closing = (inputs.closingCosts as number) || 0;
        if (!currentBal || !homeVal || !cashOut || !newRate) return null;

        const newLoan = currentBal + cashOut + closing;
        const newLTV = (newLoan / homeVal) * 100;
        const monthlyRate = newRate / 100 / 12;
        const payments = newYears * 12;
        const newMonthly =
          (newLoan * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const totalPaid = newMonthly * payments;
        const totalInterest = totalPaid - newLoan;
        const paymentDiff = newMonthly - (currentPmt || 0);

        return {
          primary: {
            label: "New Monthly Payment",
            value: `$${formatNumber(newMonthly)}`,
          },
          details: [
            { label: "New loan amount", value: `$${formatNumber(newLoan)}` },
            { label: "Cash received", value: `$${formatNumber(cashOut)}` },
            { label: "New LTV", value: `${formatNumber(newLTV)}` + "%" },
            { label: "Payment change", value: `$${formatNumber(paymentDiff)}` },
            { label: "Total interest (new loan)", value: `$${formatNumber(totalInterest)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-refinance-calculator", "home-equity-loan-calculator"],
  faq: [
    {
      question: "What is a cash-out refinance?",
      answer:
        "A cash-out refinance replaces your existing mortgage with a larger loan, giving you the difference in cash. You can use the funds for home improvements, debt consolidation, or other expenses.",
    },
    {
      question: "How much cash can I take out?",
      answer:
        "Most lenders allow cash-out refinancing up to 80% of your home value. VA loans may allow up to 100%. The amount depends on your equity, credit score, and lender requirements.",
    },
    {
      question: "Cash-out refi vs home equity loan?",
      answer:
        "A cash-out refi replaces your entire mortgage at a new rate and term. A home equity loan adds a second payment. Cash-out refis often have lower rates but reset your mortgage clock.",
    },
  ],
  formula: "New loan = Current balance + Cash out + Closing costs. M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
