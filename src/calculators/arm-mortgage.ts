import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const armMortgageCalculator: CalculatorDefinition = {
  slug: "arm-mortgage-calculator",
  title: "ARM Mortgage Calculator",
  description:
    "Free adjustable-rate mortgage (ARM) calculator. Compare initial fixed-rate period payments with adjusted-rate payments and see total cost over the life of your ARM loan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "arm mortgage calculator",
    "adjustable rate mortgage",
    "arm loan calculator",
    "variable rate mortgage",
    "5/1 arm calculator",
    "7/1 arm calculator",
  ],
  variants: [
    {
      id: "arm-payment",
      name: "ARM Payment Estimate",
      description: "Estimate payments during fixed and adjustable periods",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "initialRate",
          label: "Initial Interest Rate",
          type: "number",
          placeholder: "e.g. 5.0",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "adjustedRate",
          label: "Expected Adjusted Rate",
          type: "number",
          placeholder: "e.g. 7.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "fixedPeriod",
          label: "Fixed-Rate Period",
          type: "select",
          options: [
            { label: "3 years (3/1 ARM)", value: "3" },
            { label: "5 years (5/1 ARM)", value: "5" },
            { label: "7 years (7/1 ARM)", value: "7" },
            { label: "10 years (10/1 ARM)", value: "10" },
          ],
          defaultValue: "5",
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const initialRate = inputs.initialRate as number;
        const adjustedRate = inputs.adjustedRate as number;
        const fixedYears = parseInt(inputs.fixedPeriod as string) || 5;
        const totalYears = parseInt(inputs.term as string) || 30;
        if (!loan || !initialRate || !adjustedRate) return null;

        const monthlyInitial = initialRate / 100 / 12;
        const totalPayments = totalYears * 12;
        const fixedPayments = fixedYears * 12;

        const initialMonthly =
          (loan * (monthlyInitial * Math.pow(1 + monthlyInitial, totalPayments))) /
          (Math.pow(1 + monthlyInitial, totalPayments) - 1);

        let balance = loan;
        let totalInterestFixed = 0;
        for (let i = 0; i < fixedPayments; i++) {
          const interest = balance * monthlyInitial;
          totalInterestFixed += interest;
          balance -= initialMonthly - interest;
        }

        const remainingPayments = totalPayments - fixedPayments;
        const monthlyAdjusted = adjustedRate / 100 / 12;
        const adjustedMonthly =
          (balance * (monthlyAdjusted * Math.pow(1 + monthlyAdjusted, remainingPayments))) /
          (Math.pow(1 + monthlyAdjusted, remainingPayments) - 1);

        const totalInterestAdjusted = adjustedMonthly * remainingPayments - balance;
        const totalInterest = totalInterestFixed + totalInterestAdjusted;
        const totalPaid = loan + totalInterest;

        return {
          primary: {
            label: "Initial Monthly Payment",
            value: `$${formatNumber(initialMonthly)}`,
          },
          details: [
            { label: "Adjusted monthly payment", value: `$${formatNumber(adjustedMonthly)}` },
            { label: "Payment increase", value: `$${formatNumber(adjustedMonthly - initialMonthly)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost", value: `$${formatNumber(totalPaid)}` },
            { label: "Remaining balance at adjustment", value: `$${formatNumber(balance)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "mortgage-refinance-calculator"],
  faq: [
    {
      question: "What is an ARM mortgage?",
      answer:
        "An adjustable-rate mortgage (ARM) has an interest rate that changes after an initial fixed period. A 5/1 ARM has a fixed rate for 5 years, then adjusts annually. ARMs typically start with lower rates than fixed-rate mortgages.",
    },
    {
      question: "What are the risks of an ARM?",
      answer:
        "The main risk is payment shock when your monthly payment increases significantly at adjustment. Rate caps limit changes per period and over the loan life, but payments can still rise substantially.",
    },
    {
      question: "When does an ARM make sense?",
      answer:
        "ARMs work well if you plan to sell or refinance before the fixed period ends, expect rates to fall, or need the lowest possible initial payment.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1], recalculated at adjustment with new rate and remaining balance",
};
