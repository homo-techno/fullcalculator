import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatLoanCalculator: CalculatorDefinition = {
  slug: "boat-loan-calculator",
  title: "Boat Loan Calculator",
  description:
    "Free boat loan calculator. Estimate monthly payments, total interest, and total cost for financing a new or used boat with various loan terms and rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "boat loan calculator",
    "boat financing calculator",
    "marine loan calculator",
    "boat payment calculator",
    "yacht financing",
    "watercraft loan",
  ],
  variants: [
    {
      id: "boat-loan-payment",
      name: "Boat Loan Payment",
      description: "Calculate monthly payments for a boat loan",
      fields: [
        {
          name: "boatPrice",
          label: "Boat Purchase Price",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 10000",
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
          max: 30,
          step: 0.01,
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
          name: "boatType",
          label: "Boat Type",
          type: "select",
          options: [
            { label: "New boat", value: "new" },
            { label: "Used boat", value: "used" },
          ],
          defaultValue: "new",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.boatPrice as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 10;
        if (!price || !rate) return null;

        const loanAmount = price - down;
        if (loanAmount <= 0) return null;

        const mr = rate / 100 / 12;
        const n = years * 12;
        const monthly =
          (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - loanAmount;
        const totalCost = totalPaid + down;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Down payment", value: `$${formatNumber(down)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total loan repayment", value: `$${formatNumber(totalPaid)}` },
            { label: "Total cost (incl. down payment)", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rv-loan-calculator", "personal-loan-calculator"],
  faq: [
    {
      question: "What is a typical boat loan rate?",
      answer:
        "Boat loan rates typically range from 5% to 9% depending on credit score, loan amount, term length, and whether the boat is new or used. Larger loans for newer boats generally get better rates.",
    },
    {
      question: "How long can you finance a boat?",
      answer:
        "Boat loan terms range from 2 to 20 years. Loans over $25,000 for newer boats may qualify for terms up to 20 years. Shorter terms cost less in interest but have higher monthly payments.",
    },
    {
      question: "How much should I put down on a boat?",
      answer:
        "Most lenders require 10-20% down for a boat loan. A larger down payment reduces your monthly payment and total interest, and may help you qualify for a better interest rate.",
    },
  ],
  formula: "Monthly = L[r(1+r)^n]/[(1+r)^n - 1] where L = Price - Down Payment",
};
